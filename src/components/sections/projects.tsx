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
            scrub: 0.8,
            // Scroll length maps 1:1 to horizontal distance, so the gesture
            // feels proportional rather than arbitrarily fast or slow.
            end: () => `+=${getDistance()}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
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

          <div ref={container} className="mt-16 lg:overflow-hidden">
            <div
              ref={trackRef}
              className="flex flex-col gap-8 px-4 sm:px-6 lg:w-max lg:flex-row lg:items-stretch lg:gap-10 lg:px-[max(1.5rem,calc((100vw-72rem)/2))]"
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
          </div>

          {/* Horizontal-scroll affordance */}
          <p className="mt-10 hidden text-center font-mono text-xs text-muted-foreground lg:block">
            Keep scrolling — this section moves sideways
          </p>
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
