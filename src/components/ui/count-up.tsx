"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type CountUpProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
};

/**
 * Counts from zero to `value` when scrolled into view.
 *
 * Decimal precision is derived from the target (2.5 renders one decimal place,
 * 40 renders none) so "2.5+ years" doesn't tick through 2.47319.
 *
 * The final value is rendered server-side as the element's text content, so
 * it is present for crawlers and for reduced-motion users without JS running.
 */
export function CountUp({
  value,
  suffix = "",
  prefix = "",
  duration = 1.8,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const decimals = (value.toString().split(".")[1] ?? "").length;

  useGSAP(
    () => {
      const node = ref.current;
      if (!node || reducedMotion) return;

      const counter = { current: 0 };

      gsap.to(counter, {
        current: value,
        duration,
        ease: "power2.out",
        scrollTrigger: { trigger: node, start: "top 88%", once: true },
        onUpdate: () => {
          node.textContent = `${prefix}${counter.current.toFixed(decimals)}${suffix}`;
        },
        onComplete: () => {
          node.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
        },
      });
    },
    { scope: ref, dependencies: [value, reducedMotion] }
  );

  return (
    <span
      ref={ref}
      className={cn("tabular-nums", className)}
      // Announce the final value, never the intermediate ticks.
      aria-label={`${prefix}${value}${suffix}`}
    >
      {`${prefix}${value.toFixed(decimals)}${suffix}`}
    </span>
  );
}
