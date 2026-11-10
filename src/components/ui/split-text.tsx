"use client";

import { useRef } from "react";

import { gsap, useGSAP, SplitText, ease } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type SplitTextRevealProps = {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** Split granularity. "lines" masks each line; "chars" reveals letter by letter. */
  type?: "lines" | "words" | "chars";
  className?: string;
  delay?: number;
  stagger?: number;
  /** Play on mount instead of waiting for the element to scroll into view */
  immediate?: boolean;
};

/**
 * Masked reveal built on GSAP's SplitText.
 *
 * Two details that are easy to get wrong:
 *
 *  1. Splitting before webfonts load measures the fallback font, so the line
 *     breaks are wrong and the mask clips mid-glyph. We await document.fonts.ready.
 *  2. The split must be reverted on cleanup, or a re-render leaves the DOM full
 *     of orphaned wrapper divs and the text gets split twice.
 *
 * Under reduced motion no split happens at all — the text just renders.
 *
 * Do NOT use this on gradient text. Splitting moves the glyphs into child
 * elements that inherit `color: transparent` without inheriting the clipped
 * background, so `background-clip: text` paints nothing and the text vanishes.
 * Use <MaskedText> for those.
 */
export function SplitTextReveal({
  children,
  as: Tag = "span",
  type = "lines",
  className,
  delay = 0,
  stagger = 0.08,
  immediate = false,
}: SplitTextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const node = ref.current;
      if (!node || reducedMotion) return;

      let split: SplitText | null = null;
      let cancelled = false;

      gsap.set(node, { opacity: 0 });

      document.fonts.ready.then(() => {
        if (cancelled || !ref.current) return;

        split = SplitText.create(node, {
          type,
          // Wrapping each line in a mask is what makes text slide up from
          // behind an invisible edge instead of just fading.
          mask: type === "lines" ? "lines" : undefined,
          linesClass: "split-line",
          autoSplit: true,
        });

        const targets =
          type === "chars" ? split.chars : type === "words" ? split.words : split.lines;

        gsap.set(node, { opacity: 1 });

        gsap.from(targets, {
          yPercent: 115,
          opacity: 0,
          duration: 0.9,
          ease: ease.expo,
          stagger,
          delay,
          ...(immediate
            ? {}
            : {
                scrollTrigger: {
                  trigger: node,
                  start: "top 85%",
                  once: true,
                },
              }),
        });
      });

      return () => {
        cancelled = true;
        split?.revert();
      };
    },
    { scope: ref, dependencies: [reducedMotion, type, immediate] }
  );

  return (
    // @ts-expect-error -- polymorphic ref across the five allowed tags
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
