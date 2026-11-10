"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { gsap, useGSAP, ease } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useUIStore } from "@/store/use-ui-store";
import { profile } from "@/data/profile";

/**
 * Sub-1.5s intro: a 0→100 counter with the initials, which then lifts away to
 * hand off to the hero.
 *
 * Shown once per *session*, not once per page view — the flag lives in
 * sessionStorage, so an internal navigation won't replay it but a visit
 * tomorrow will.
 *
 * Skippable by click, Escape, or the skip button. Under reduced motion it
 * never renders at all.
 */
export function Preloader() {
  const reducedMotion = useReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  const [done, setDone] = useState(false);

  // useLayoutEffect, not useEffect: the persisted "already played" flag is
  // only readable on the client, and checking it after paint would flash the
  // overlay on every internal navigation.
  useLayoutEffect(() => {
    if (useUIStore.getState().hasPlayedIntro || reducedMotion) {
      setDone(true);
    }
  }, [reducedMotion]);

  const finish = useCallback(() => {
    useUIStore.getState().markIntroPlayed();
    setDone(true);
    document.body.style.overflow = "";
  }, []);

  const skip = useCallback(() => {
    timeline.current?.progress(1);
  }, []);

  useGSAP(
    () => {
      if (done || reducedMotion) return;

      // Lock scrolling for the ~1.3s the intro owns the screen.
      document.body.style.overflow = "hidden";

      const progress = { value: 0 };

      const tl = gsap.timeline({ onComplete: finish });
      timeline.current = tl;

      tl.to(progress, {
        value: 100,
        duration: 1.05,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = Math.round(progress.value);
          if (counterRef.current) {
            counterRef.current.textContent = String(v).padStart(3, "0");
          }
          if (barRef.current) {
            barRef.current.style.transform = `scaleX(${progress.value / 100})`;
          }
        },
      })
        .to(".preloader-initials", {
          scale: 1.08,
          duration: 0.3,
          ease: ease.out,
        })
        .to(
          ".preloader-meta",
          { opacity: 0, y: -8, duration: 0.25, ease: ease.out },
          "<"
        )
        // Wipe upward to hand off to the hero.
        .to(container.current, {
          yPercent: -100,
          duration: 0.6,
          ease: "power4.inOut",
        });

      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape" || event.key === "Enter") skip();
      };
      window.addEventListener("keydown", onKey);

      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      };
    },
    { scope: container, dependencies: [done, reducedMotion] }
  );

  if (done) return null;

  return (
    <div
      ref={container}
      onClick={skip}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[10000] flex cursor-pointer flex-col items-center justify-center bg-background"
    >
      <span className="preloader-initials font-heading text-[18vw] leading-none font-bold tracking-tighter sm:text-[12rem]">
        <span className="text-gradient">{profile.initials}</span>
      </span>

      <div className="preloader-meta mt-8 flex w-[min(22rem,70vw)] flex-col items-center gap-4">
        <div className="h-px w-full overflow-hidden bg-border">
          <div
            ref={barRef}
            className="h-full w-full origin-left"
            style={{
              transform: "scaleX(0)",
              background: "linear-gradient(90deg, var(--brand), var(--brand-cyan))",
            }}
          />
        </div>

        <div className="flex w-full items-center justify-between font-mono text-xs text-muted-foreground">
          <span>{profile.title}</span>
          <span ref={counterRef} className="tabular-nums">
            000
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          skip();
        }}
        className="absolute bottom-10 font-mono text-[11px] tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        Skip intro
      </button>
    </div>
  );
}
