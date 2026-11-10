"use client";

import { useRef } from "react";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";

import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { useLenis } from "@/hooks/use-lenis";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { SplitTextReveal } from "@/components/ui/split-text";
import { MaskedText } from "@/components/ui/masked-text";
import { HeroVisual } from "@/components/three/hero-visual";
import { Inspectable } from "@/components/inspect/inspectable";
import { profile } from "@/data/profile";

export function Hero() {
  const container = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const mouse = useMousePosition();
  const { scrollTo } = useLenis();

  useGSAP(
    () => {
      if (reducedMotion) return;

      // --- Scroll parallax: three depth layers ------------------------------
      // Each layer moves a different distance for the same scroll delta, which
      // is what produces depth. yPercent keeps it on the compositor.
      const layers: Array<[string, number]> = [
        ["[data-parallax='back']", -8],
        ["[data-parallax='mid']", -20],
        ["[data-parallax='front']", -36],
      ];

      layers.forEach(([selector, distance]) => {
        gsap.to(selector, {
          yPercent: distance,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });

      // Hero content fades as it leaves, so the next section arrives clean.
      gsap.to("[data-hero-content]", {
        opacity: 0,
        scrollTrigger: {
          trigger: container.current,
          start: "40% top",
          end: "bottom top",
          scrub: 0.4,
        },
      });

      // --- Pointer parallax -------------------------------------------------
      // Reads the shared pointer ref inside the ticker instead of subscribing
      // to mousemove with setState.
      const backTo = gsap.quickTo("[data-pointer='back']", "x", { duration: 1.2 });
      const frontTo = gsap.quickTo("[data-pointer='front']", "x", { duration: 0.8 });
      const frontYTo = gsap.quickTo("[data-pointer='front']", "y", { duration: 0.8 });

      const update = () => {
        backTo(mouse.current.nx * 14);
        frontTo(mouse.current.nx * -26);
        frontYTo(mouse.current.ny * -14);
      };

      gsap.ticker.add(update);
      return () => gsap.ticker.remove(update);
    },
    { scope: container, dependencies: [reducedMotion] }
  );

  return (
    <Inspectable
      as="section"
      name="Hero"
      props={{
        name: profile.fullName,
        parallaxLayers: 3,
        scene: "MeshTransmissionMaterial",
      }}
      tech={["GSAP ScrollTrigger", "SplitText", "React Three Fiber", "drei"]}
      note="Three scroll-parallax depth layers plus a pointer-driven layer, all animating yPercent only."
      className="relative"
    >
      <section
        ref={container}
        id="hero"
        aria-label="Introduction"
        className="relative flex min-h-dvh items-center overflow-hidden"
      >
        {/* Depth layer 1 — the 3D object, furthest back.
            Offset into the right half on desktop so it frames the copy rather
            than sitting underneath it. */}
        <div
          data-parallax="back"
          data-pointer="back"
          className="absolute inset-0 -z-10 opacity-80 will-change-transform lg:left-[32%] lg:opacity-100"
        >
          <HeroVisual />
        </div>

        {/* Readability scrim: the knot is bright and the copy sits on top of
            it on narrow screens, where the two can't be separated spatially. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(100deg, var(--background) 8%, color-mix(in oklch, var(--background), transparent 35%) 42%, transparent 68%)",
          }}
        />

        {/* Depth layer 2 — a soft glow that trails the pointer */}
        <div
          data-parallax="mid"
          data-pointer="front"
          aria-hidden="true"
          className="absolute top-1/4 left-1/2 -z-10 size-[42vw] -translate-x-1/2 rounded-full blur-[100px] will-change-transform"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--brand) 55%, transparent), transparent 70%)",
          }}
        />

        {/* Depth layer 3 — content, moves most */}
        <div
          data-parallax="front"
          data-hero-content
          className="relative mx-auto w-full max-w-6xl px-4 will-change-transform sm:px-6"
        >
          <div className="flex max-w-3xl flex-col items-start gap-7">
            {/* Status chip */}
            <div className="glass inline-flex items-center gap-2.5 rounded-full py-2 pr-5 pl-3">
              <span className="relative flex size-2">
                <span
                  aria-hidden="true"
                  className="absolute inline-flex size-full rounded-full"
                  style={{
                    background: "var(--brand-cyan)",
                    animation: reducedMotion
                      ? "none"
                      : "pulse-ring 2.4s ease-out infinite",
                  }}
                />
                <span
                  aria-hidden="true"
                  className="relative inline-flex size-2 rounded-full"
                  style={{ background: "var(--brand-cyan)" }}
                />
              </span>
              <span className="font-mono text-xs tracking-wide text-muted-foreground">
                {profile.status}
              </span>
            </div>

            {/* Name */}
            <h1 className="flex flex-col text-[clamp(2.75rem,10vw,7.5rem)] leading-[0.92] font-bold tracking-[-0.03em]">
              <SplitTextReveal as="span" type="chars" immediate stagger={0.025}>
                {profile.firstName}
              </SplitTextReveal>
              {/* Masked rather than split: see components/ui/masked-text.tsx —
                  SplitText's per-character wrappers break background-clip. */}
              <MaskedText immediate delay={0.18} className="text-gradient animate-shimmer">
                {profile.lastName}
              </MaskedText>
            </h1>

            {/* Role */}
            <SplitTextReveal
              as="p"
              type="lines"
              immediate
              delay={0.35}
              className="max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              {`${profile.title} — ${profile.tagline}`}
            </SplitTextReveal>

            {/* CTAs */}
            <div
              data-hero-cta
              className="mt-2 flex flex-wrap items-center gap-3"
            >
              <Magnetic strength={0.4}>
                <Button
                  size="lg"
                  onClick={() => scrollTo("#work", { offset: -80 })}
                  data-cursor="view"
                  className="h-12 gap-2 rounded-full px-6 text-sm"
                  style={{
                    background:
                      "linear-gradient(120deg, var(--brand), var(--brand-cyan))",
                    color: "var(--primary-foreground)",
                  }}
                >
                  <Sparkles className="size-4" />
                  View work
                </Button>
              </Magnetic>

              <Magnetic strength={0.4}>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => scrollTo("#contact", { offset: -80 })}
                  className="glass h-12 gap-2 rounded-full px-6 text-sm"
                >
                  Contact me
                  <ArrowUpRight className="size-4" />
                </Button>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <button
          type="button"
          onClick={() => scrollTo("#about", { offset: -80 })}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Scroll to about section"
        >
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase">
            Scroll
          </span>
          <ArrowDown
            className="size-4"
            style={{
              animation: reducedMotion ? "none" : "bob 2.2s ease-in-out infinite",
            }}
          />
        </button>
      </section>
    </Inspectable>
  );
}
