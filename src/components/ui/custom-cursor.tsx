"use client";

import { useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { useIsTouch } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, [data-cursor]';

/**
 * Two-part cursor: a dot that tracks exactly, and a ring that lags behind.
 *
 * The lag is the whole effect — identical durations would just look like one
 * thick cursor. The ring grows and inverts over interactive elements.
 *
 * Never rendered on touch devices or under reduced motion, and the native
 * cursor is only hidden once this is actually mounted, so a keyboard or
 * touch user is never left without a pointer.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  const isTouch = useIsTouch();
  const reducedMotion = useReducedMotion();
  const mounted = useMounted();
  const enabled = mounted && !isTouch && !reducedMotion;

  useGSAP(
    () => {
      if (!enabled) return;
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) return;

      document.documentElement.style.cursor = "none";

      gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

      // Dot is near-instant; ring trails by ~0.45s. That gap is the character.
      const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
      const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

      let revealed = false;
      const onMove = (event: PointerEvent) => {
        if (!revealed) {
          revealed = true;
          gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
        }
        dotX(event.clientX);
        dotY(event.clientY);
        ringX(event.clientX);
        ringY(event.clientY);
      };

      const onOver = (event: PointerEvent) => {
        const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
          INTERACTIVE
        );
        if (!target) return;
        setLabel(target.dataset.cursor ?? null);
        gsap.to(ring, {
          scale: target.dataset.cursor ? 2.6 : 1.9,
          borderColor: "transparent",
          backgroundColor: "color-mix(in oklch, var(--brand) 22%, transparent)",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(dot, { scale: 0.4, duration: 0.35, ease: "power3.out" });
      };

      const onOut = (event: PointerEvent) => {
        if ((event.target as HTMLElement | null)?.closest(INTERACTIVE) == null) return;
        setLabel(null);
        gsap.to(ring, {
          scale: 1,
          borderColor: "color-mix(in oklch, var(--brand) 70%, transparent)",
          backgroundColor: "transparent",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(dot, { scale: 1, duration: 0.35, ease: "power3.out" });
      };

      // Hide while the pointer is outside the window entirely.
      const onLeaveWindow = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
      const onEnterWindow = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 });

      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver);
      document.addEventListener("pointerout", onOut);
      document.addEventListener("pointerleave", onLeaveWindow);
      document.addEventListener("pointerenter", onEnterWindow);

      return () => {
        document.documentElement.style.cursor = "";
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        document.removeEventListener("pointerout", onOut);
        document.removeEventListener("pointerleave", onLeaveWindow);
        document.removeEventListener("pointerenter", onEnterWindow);
      };
    },
    { dependencies: [enabled] }
  );

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999]">
      <div
        ref={ringRef}
        className="absolute top-0 left-0 grid size-9 place-items-center rounded-full border will-change-transform"
        style={{
          borderColor: "color-mix(in oklch, var(--brand) 70%, transparent)",
          backdropFilter: "invert(0.06)",
        }}
      >
        {label ? (
          <span className="font-mono text-[9px] tracking-widest text-foreground uppercase">
            {label}
          </span>
        ) : null}
      </div>
      <div
        ref={dotRef}
        className="absolute top-0 left-0 size-1.5 rounded-full will-change-transform"
        style={{ background: "var(--brand)" }}
      />
    </div>
  );
}
