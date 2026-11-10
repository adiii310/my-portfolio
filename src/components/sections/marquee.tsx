"use client";

import { useRef } from "react";

import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Inspectable } from "@/components/inspect/inspectable";
import { marqueeTech } from "@/data/skills";
import { cn } from "@/lib/utils";

/**
 * Infinite tech strip whose speed — and direction — react to scroll velocity.
 *
 * The track holds two identical copies of the list and wraps at -50%, so the
 * seam is never visible. Scroll velocity feeds a timeScale that eases back to
 * 1, which makes a fast flick visibly whip the strip before it settles.
 */
export function Marquee({
  className,
  baseSpeed = 28,
}: {
  className?: string;
  baseSpeed?: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const track = container.current?.querySelector("[data-marquee-track]");
      if (!track) return;

      const tween = gsap.to(track, {
        xPercent: -50,
        duration: baseSpeed,
        ease: "none",
        repeat: -1,
      });

      // Direction flips with scroll direction; magnitude scales with speed.
      const trigger = ScrollTrigger.create({
        trigger: container.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const boost = gsap.utils.clamp(-6, 6, velocity / 260);
          const direction = self.direction === -1 ? -1 : 1;

          gsap.to(tween, {
            timeScale: direction * (1 + Math.abs(boost)),
            duration: 0.25,
            overwrite: true,
            onComplete: () => {
              // Always settle back to a calm forward crawl.
              gsap.to(tween, { timeScale: direction, duration: 1.2 });
            },
          });
        },
      });

      return () => {
        trigger.kill();
        tween.kill();
      };
    },
    { scope: container, dependencies: [reducedMotion, baseSpeed] }
  );

  // Two copies so the -50% wrap lands exactly on a repeat.
  const items = [...marqueeTech, ...marqueeTech];

  return (
    <Inspectable
      name="Marquee"
      props={{ items: marqueeTech.length, velocityReactive: true }}
      tech={["GSAP", "ScrollTrigger.getVelocity()"]}
      note="Scroll velocity drives the tween's timeScale, then eases back to a steady crawl."
      className={cn("relative overflow-hidden py-6", className)}
    >
      <div
        ref={container}
        aria-hidden="true"
        className="relative flex overflow-hidden border-y border-border/60"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div
          data-marquee-track
          className="flex shrink-0 items-center gap-10 py-5 pr-10 will-change-transform"
        >
          {items.map((tech, index) => (
            <span
              key={`${tech}-${index}`}
              className="flex shrink-0 items-center gap-10 font-mono text-sm tracking-wide text-muted-foreground whitespace-nowrap"
            >
              {tech}
              <span
                className="size-1 rounded-full"
                style={{ background: "var(--brand)" }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* The list is decorative above, so expose it once to assistive tech. */}
      <span className="sr-only">
        Technologies: {marqueeTech.join(", ")}.
      </span>
    </Inspectable>
  );
}
