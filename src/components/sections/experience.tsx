"use client";

import { useRef } from "react";
import { Briefcase, GraduationCap } from "lucide-react";

import { gsap, useGSAP, ease } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Inspectable } from "@/components/inspect/inspectable";
import { experience } from "@/data/experience";

export function Experience() {
  const container = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      // The spine draws itself as the section scrolls past.
      gsap.fromTo(
        "[data-timeline-line]",
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top 70%",
            end: "bottom 80%",
            scrub: 0.5,
          },
        }
      );

      // Each node pops when the spine reaches it.
      gsap.utils.toArray<HTMLElement>("[data-timeline-node]").forEach((node) => {
        gsap.from(node, {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(2)",
          scrollTrigger: { trigger: node, start: "top 78%", once: true },
        });
      });

      // Cards slide in from the spine side.
      gsap.utils.toArray<HTMLElement>("[data-timeline-card]").forEach((card) => {
        gsap.from(card, {
          x: 36,
          opacity: 0,
          duration: 0.85,
          ease: ease.expo,
          scrollTrigger: { trigger: card, start: "top 82%", once: true },
        });
      });
    },
    { scope: container, dependencies: [reducedMotion] }
  );

  return (
    <Inspectable
      as="section"
      name="Experience"
      props={{ entries: experience.length, line: "DrawSVGPlugin" }}
      tech={["GSAP", "DrawSVGPlugin", "ScrollTrigger scrub"]}
      note="The spine is a real SVG path drawn with DrawSVG, scrubbed to scroll progress."
      className="relative"
    >
      <section
        id="experience"
        aria-labelledby="experience-heading"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32"
      >
        <SectionHeading
          eyebrow="03 — Experience"
          title="Where I've shipped."
          description="Two and a half years, one employer, and three platforms taken from zero to production."
        />

        <div ref={container} className="relative mt-16 pl-10 sm:pl-16">
          {/* Spine */}
          <svg
            aria-hidden="true"
            className="absolute top-2 left-[13px] h-[calc(100%-1rem)] w-0.5 overflow-visible sm:left-[29px]"
            viewBox="0 0 2 100"
            preserveAspectRatio="none"
            fill="none"
          >
            {/* Track */}
            <line
              x1="1"
              y1="0"
              x2="1"
              y2="100"
              stroke="var(--border)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            {/* Drawn progress */}
            <line
              data-timeline-line
              x1="1"
              y1="0"
              x2="1"
              y2="100"
              stroke="url(#timeline-gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <defs>
              <linearGradient id="timeline-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--brand)" />
                <stop offset="100%" stopColor="var(--brand-cyan)" />
              </linearGradient>
            </defs>
          </svg>

          <ol className="flex flex-col gap-10">
            {experience.map((entry) => {
              const Icon = entry.kind === "work" ? Briefcase : GraduationCap;

              return (
                <li key={entry.id} className="relative">
                  {/* Node */}
                  <span
                    data-timeline-node
                    aria-hidden="true"
                    className="absolute top-6 -left-10 grid size-7 place-items-center rounded-full sm:-left-16"
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <Icon className="size-3.5" style={{ color: "var(--brand)" }} />
                  </span>

                  <GlassCard data-timeline-card as="article" className="p-6 sm:p-8">
                    <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                          {entry.role}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {entry.organization} · {entry.location}
                        </p>
                      </div>

                      <time
                        dateTime={entry.startDate}
                        className="shrink-0 font-mono text-xs text-muted-foreground"
                      >
                        {entry.period}
                      </time>
                    </header>

                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {entry.summary}
                    </p>

                    <ul className="mt-5 flex flex-col gap-2.5">
                      {entry.highlights.map((highlight) => (
                        <li
                          key={highlight.slice(0, 40)}
                          className="flex gap-3 text-sm leading-relaxed"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.55rem] size-1 shrink-0 rounded-full"
                            style={{ background: "var(--brand)" }}
                          />
                          <span className="text-muted-foreground">{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    <ul className="mt-6 flex flex-wrap gap-1.5">
                      {entry.stack.map((item) => (
                        <li key={item}>
                          <Badge
                            variant="outline"
                            className="font-mono text-[10px] font-normal"
                          >
                            {item}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </Inspectable>
  );
}
