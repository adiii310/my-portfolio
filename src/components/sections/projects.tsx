"use client";

import { useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Inspectable } from "@/components/inspect/inspectable";
import { ProjectCard } from "./project-card";
import { CaseStudyDialog } from "./case-study-dialog";
import { projects, type Project } from "@/data/projects";

/**
 * Gap between the viewport top and the pinned track, in px.
 *
 * The navbar is `position: fixed`, so a track pinned at `top: 0` would sit
 * underneath it and lose the card's index/context badges. Keep this in sync
 * with the `lg:h-[...]` clearance on the track below.
 */
const PIN_TOP = 96;

/**
 * The showcase.
 *
 * Desktop: the section pins and the track translates horizontally, so vertical
 * scroll input drives sideways motion.
 * Mobile and reduced motion: a plain vertical stack — a pinned horizontal
 * scroller on a phone is a usability trap, not a flourish.
 *
 * gsap.matchMedia handles the switch and reverts the desktop timeline cleanly
 * when the viewport crosses the breakpoint, which a manual resize listener
 * would leave behind as an orphaned pin-spacer.
 */
export function Projects() {
  const container = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();

  const [active, setActive] = useState<Project | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openProject = (project: Project) => {
    setActive(project);
    setDialogOpen(true);
  };

  useGSAP(
    () => {
      if (reducedMotion) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const track = trackRef.current;
        if (!track) return;

        // Distance = how much wider the track is than the viewport.
        const getDistance = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            pin: true,
            // Pin below the fixed navbar rather than at the viewport top,
            // otherwise the header crops the first rows of every card.
            start: `top ${PIN_TOP}px`,
            scrub: 0.8,
            // Scroll length maps 1:1 to horizontal distance, so the gesture
            // feels proportional rather than arbitrarily fast or slow.
            end: () => `+=${getDistance()}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            // The hint rides along inside the pinned area, so it has to retire
            // itself once the gesture is under way — otherwise it still reads
            // "keep scrolling" at the end of the track.
            onUpdate: (self) => {
              const hint = hintRef.current;
              if (hint) hint.style.opacity = `${Math.max(0, 1 - self.progress * 6)}`;
            },
          },
        });

        // Images drift against their cards for depth inside the horizontal move.
        const imageTweens = gsap.utils
          .toArray<HTMLElement>("[data-project-image]")
          .map((image) =>
            gsap.fromTo(
              image,
              { xPercent: -6 },
              {
                xPercent: 6,
                ease: "none",
                scrollTrigger: {
                  trigger: image.closest("[data-project-card]"),
                  containerAnimation: tween,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              }
            )
          );

        return () => {
          imageTweens.forEach((t) => t.scrollTrigger?.kill());
          tween.scrollTrigger?.kill();
          hintRef.current?.style.removeProperty("opacity");
        };
      });

      // Below lg: vertical reveals only.
      mm.add("(max-width: 1023px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-project-card]").forEach((card) => {
          gsap.from(card, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 85%", once: true },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: container, dependencies: [reducedMotion] }
  );

  return (
    <>
      <Inspectable
        as="section"
        name="Projects"
        props={{ count: projects.length, pinned: true, axis: "horizontal" }}
        tech={["GSAP ScrollTrigger", "pin", "containerAnimation", "matchMedia"]}
        note="Pinned horizontal track on desktop; the inner images use containerAnimation so their parallax follows the horizontal scroll, not the vertical one."
        className="relative"
      >
        <section
          id="work"
          aria-labelledby="work-heading"
          className="scroll-mt-24 py-24 sm:py-32"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="04 — Work"
              title="Platforms, not pages."
              description="Multi-tenant SaaS, real-time dashboards and AI pipelines — taken from first commit to production."
            />
          </div>

          <div
            ref={container}
            // Once pinned, this owns the band between the navbar (PIN_TOP =
            // 6rem) and a 3rem gutter at the bottom, so a card fits the visible
            // area instead of running off the fold.
            className="mt-16 lg:flex lg:h-[calc(100dvh-9rem)] lg:max-h-224 lg:min-h-136 lg:flex-col lg:overflow-hidden"
          >
            <div
              ref={trackRef}
              className="flex flex-col gap-8 px-4 sm:px-6 lg:w-max lg:min-h-0 lg:flex-1 lg:flex-row lg:items-stretch lg:gap-10 lg:px-[max(1.5rem,calc((100vw-72rem)/2))]"
            >
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={index}
                  horizontal
                  onOpen={openProject}
                />
              ))}

              {/* Trailing spacer so the last card can reach centre-screen */}
              <div aria-hidden="true" className="hidden w-[20vw] shrink-0 lg:block" />
            </div>

            {/*
              Horizontal-scroll affordance. It lives *inside* the pinned
              container on purpose — as a sibling after it, the pin-spacer
              pushed it a full track-length down the page, so the hint only
              appeared once the user had already worked the gesture out.
            */}
            <p
              ref={hintRef}
              className="hidden shrink-0 pt-6 text-center font-mono text-xs text-muted-foreground lg:block"
            >
              Keep scrolling — this section moves sideways
            </p>
          </div>
        </section>
      </Inspectable>

      <CaseStudyDialog
        project={active}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
