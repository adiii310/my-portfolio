"use client";

import { useRef } from "react";

import { gsap, useGSAP, ease } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type RevealProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  children: React.ReactNode;
  className?: string;
  /** Stagger direct children instead of animating the wrapper as one unit */
  stagger?: number;
  delay?: number;
  y?: number;
  /** Adds a clip-path wipe on top of the fade-up */
  clip?: boolean;
  as?: "div" | "section" | "ul" | "li" | "article";
};

/**
 * Scroll-triggered fade-up, optionally staggering its direct children.
 *
 * Only transform and opacity are animated. The clip variant uses `clipPath`,
 * which is also compositor-friendly, unlike animating height or a mask image.
 *
 * Under reduced motion the content is simply rendered — no ScrollTrigger is
 * created at all, so there is nothing to recalculate on resize either.
 */
export function Reveal({
  children,
  className,
  stagger = 0,
  delay = 0,
  y = 28,
  clip = false,
  as: Tag = "div",
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const node = ref.current;
      if (!node || reducedMotion) return;

      const targets = stagger > 0 ? Array.from(node.children) : [node];
      if (targets.length === 0) return;

      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 0.9,
        delay,
        ease: ease.expo,
        stagger,
        ...(clip
          ? { clipPath: "inset(0% 0% 100% 0%)" }
          : {}),
        scrollTrigger: { trigger: node, start: "top 88%", once: true },
      });
    },
    { scope: ref, dependencies: [reducedMotion, stagger, delay, y, clip] }
  );

  return (
    // @ts-expect-error -- polymorphic ref across the five allowed tags
    <Tag ref={ref} className={cn(className)} {...rest}>
      {children}
    </Tag>
  );
}
