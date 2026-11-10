"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type ScrambleTextProps = {
  children: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
  className?: string;
  /** Characters cycled through before each letter settles */
  chars?: string;
  duration?: number;
  /** Re-run the scramble whenever the pointer enters */
  scrambleOnHover?: boolean;
};

/**
 * Decode-on-scroll effect via GSAP's ScrambleTextPlugin.
 *
 * The real text is rendered into the DOM first and only then scrambled, so
 * the accessible name and the crawled content are always the final string —
 * an aria-label plus garbage text content would read correctly but index badly.
 */
export function ScrambleText({
  children,
  as: Tag = "span",
  className,
  chars = "upperCase",
  duration = 1.4,
  scrambleOnHover = false,
}: ScrambleTextProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const node = ref.current;
      if (!node || reducedMotion) return;

      const run = () =>
        gsap.to(node, {
          duration,
          scrambleText: { text: children, chars, speed: 0.6, revealDelay: 0.25 },
          ease: "none",
        });

      gsap.to(node, {
        duration,
        scrambleText: { text: children, chars, speed: 0.6, revealDelay: 0.25 },
        ease: "none",
        scrollTrigger: { trigger: node, start: "top 85%", once: true },
      });

      if (!scrambleOnHover) return;
      node.addEventListener("pointerenter", run);
      return () => node.removeEventListener("pointerenter", run);
    },
    { scope: ref, dependencies: [children, reducedMotion, scrambleOnHover] }
  );

  return (
    // @ts-expect-error -- polymorphic ref across the five allowed tags
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
