"use client";

import { useRef } from "react";

import { gsap, useGSAP, ease } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type MaskedTextProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
};

/**
 * Slides a single element up from behind a mask.
 *
 * This exists specifically for gradient text. SplitText reveals look better,
 * but splitting breaks `background-clip: text`: the generated per-character
 * elements inherit `color: transparent` while the clipped background stays on
 * the parent, so every character paints as nothing and the text disappears.
 *
 * Animating one unmodified element sidesteps that entirely — the gradient
 * keeps its single, continuous paint across the whole word.
 */
export function MaskedText({
  children,
  className,
  delay = 0,
  immediate = false,
}: MaskedTextProps) {
  const wrapper = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const inner = wrapper.current?.firstElementChild;
      if (!inner || reducedMotion) return;

      gsap.from(inner, {
        yPercent: 115,
        duration: 1,
        delay,
        ease: ease.expo,
        ...(immediate
          ? {}
          : {
              scrollTrigger: {
                trigger: wrapper.current,
                start: "top 85%",
                once: true,
              },
            }),
      });
    },
    { scope: wrapper, dependencies: [reducedMotion, delay, immediate] }
  );

  return (
    <span ref={wrapper} className="block overflow-hidden pb-[0.08em]">
      <span className={cn("block will-change-transform", className)}>{children}</span>
    </span>
  );
}
