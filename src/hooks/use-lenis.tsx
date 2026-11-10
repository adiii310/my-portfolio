"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "./use-reduced-motion";

type ScrollToOptions = {
  offset?: number;
  immediate?: boolean;
};

type LenisContextValue = {
  lenis: Lenis | null;
  /** Accepts a selector, an element, or an absolute Y offset. */
  scrollTo: (target: string | HTMLElement | number, opts?: ScrollToOptions) => void;
  stop: () => void;
  start: () => void;
};

const LenisContext = createContext<LenisContextValue | null>(null);

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const [, forceRender] = useState(0);

  useEffect(() => {
    // Reduced motion: never instantiate Lenis. Native scrolling is already
    // accessible, and a disabled-but-present instance still hijacks wheel events.
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Exponential ease-out: fast handoff from the wheel, long gentle tail.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      // Never smooth touch. It fights the OS scroller and feels broken.
      syncTouch: false,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;
    forceRender((n) => n + 1); // publish the instance to consumers

    // --- The important part -------------------------------------------------
    // Lenis ships its own requestAnimationFrame loop. Running it alongside
    // GSAP's ticker means two loops race each frame and scrub-linked timelines
    // drift. Driving lenis.raf from the ticker collapses them into one.
    const update = (time: number) => lenis.raf(time * 1000); // ticker is seconds
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger's cached positions in step with Lenis' virtual scroll.
    lenis.on("scroll", ScrollTrigger.update);

    // Let ScrollTrigger ask Lenis for scroll position instead of reading
    // window.scrollY, which lags behind during a smooth tween.
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(update);
      ScrollTrigger.scrollerProxy(document.documentElement, {});
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  const scrollTo = useCallback(
    (target: string | HTMLElement | number, opts: ScrollToOptions = {}) => {
      const { offset = 0, immediate = false } = opts;
      const lenis = lenisRef.current;

      if (lenis) {
        lenis.scrollTo(target, {
          offset,
          immediate,
          duration: immediate ? 0 : 1.1,
        });
        return;
      }

      // Reduced-motion / pre-init path: jump natively.
      const node =
        typeof target === "string"
          ? document.querySelector<HTMLElement>(target)
          : typeof target === "number"
            ? null
            : target;

      const top =
        typeof target === "number"
          ? target
          : node
            ? node.getBoundingClientRect().top + window.scrollY + offset
            : 0;

      window.scrollTo({ top, behavior: "auto" });
    },
    []
  );

  const stop = useCallback(() => lenisRef.current?.stop(), []);
  const start = useCallback(() => lenisRef.current?.start(), []);

  return (
    <LenisContext.Provider
      value={{ lenis: lenisRef.current, scrollTo, stop, start }}
    >
      {children}
    </LenisContext.Provider>
  );
}

export function useLenis(): LenisContextValue {
  const ctx = useContext(LenisContext);
  if (!ctx) {
    throw new Error("useLenis must be used inside <SmoothScrollProvider>.");
  }
  return ctx;
}
