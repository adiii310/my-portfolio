"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { useIsTouch } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: React.ReactNode;
  /** How far the element travels toward the cursor, 0–1 of the offset */
  strength?: number;
  /** Extra hit area around the element, in px */
  padding?: number;
  className?: string;
};

/**
 * Pulls its child toward the cursor while the pointer is nearby, then springs
 * back on leave. Disabled entirely on touch devices (no hover to track) and
 * under reduced motion.
 *
 * Uses gsap.quickTo rather than gsap.to: quickTo pre-compiles the setter once,
 * so per-frame updates skip tween allocation. Mousemove handlers that call
 * gsap.to create a new tween object on every event.
 */
export function Magnetic({
  children,
  strength = 0.35,
  padding = 24,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isTouch = useIsTouch();
  const reducedMotion = useReducedMotion();
  const enabled = !isTouch && !reducedMotion;

  useGSAP(
    () => {
      const node = ref.current;
      if (!node || !enabled) return;

      const xTo = gsap.quickTo(node, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(node, "y", { duration: 0.5, ease: "power3.out" });

      const onMove = (event: PointerEvent) => {
        const rect = node.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const withinX = Math.abs(event.clientX - cx) < rect.width / 2 + padding;
        const withinY = Math.abs(event.clientY - cy) < rect.height / 2 + padding;

        if (withinX && withinY) {
          xTo((event.clientX - cx) * strength);
          yTo((event.clientY - cy) * strength);
        } else {
          xTo(0);
          yTo(0);
        }
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: ref, dependencies: [enabled, strength, padding] }
  );

  return (
    <span ref={ref} className={cn("inline-block will-change-transform", className)}>
      {children}
    </span>
  );
}
