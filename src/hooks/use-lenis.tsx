"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { usePathname } from "next/navigation";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * How far above a section to stop, so the fixed navbar does not cover its
 * heading. Shared by the navbar links and by post-navigation anchor restore —
 * two copies of this number would drift apart.
 */
export const ANCHOR_OFFSET = 50;

/**
 * How much of the trip stays animated after a teleport, as a fraction of the
 * viewport. Keeps the landing readable — the destination arrives from the right
 * direction instead of being cut to.
 */
const APPROACH_VIEWPORTS = 0.45;

/**
 * Does travelling between these two scroll positions pass through a pin?
 *
 * The Work track pins for ~6,500px and spends all of it translating sideways,
 * so a smooth tween from the navbar to #contact has to scrub the entire
 * horizontal timeline on the way down — every card strobes past. Crossing a pin
 * is the thing worth skipping; a long jump through ordinary sections is just a
 * long scroll and still looks fine tweened.
 */
function crossesPin(from: number, to: number) {
  const lo = Math.min(from, to);
  const hi = Math.max(from, to);

  return ScrollTrigger.getAll().some((trigger) => {
    if (!trigger.pin) return false;
    // Ignore a pin we merely touch at the edges — only a real traversal of the
    // pinned range produces the scrub-through artefact.
    return trigger.start < hi && trigger.end > lo;
  });
}

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
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const [instance, setInstance] = useState<Lenis | null>(null);

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
    setInstance(lenis); // publish the instance to consumers

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
      setInstance(null);
    };
  }, [reducedMotion]);

  /**
   * Re-measure after a client-side navigation.
   *
   * This provider sits in the root layout and never unmounts, so after a route
   * change ScrollTrigger's cached start/end offsets and Lenis' page dimensions
   * still describe the page we just left. Pins then engage at the wrong scroll
   * positions — the pinned Work track gets drawn over the sections above it.
   *
   * A `#hash` is worse: Next scrolls to the anchor while the pin-spacers have
   * not been created yet, so the moment ScrollTrigger inserts them (thousands
   * of px of extra height) the target slides out from under the viewport and
   * the user lands in whatever section happens to be at that offset.
   */
  useEffect(() => {
    if (reducedMotion) return;

    let frame = 0;

    const settle = () => {
      const lenis = lenisRef.current;

      lenis?.resize();
      ScrollTrigger.refresh();

      // Re-apply the anchor now that the real geometry exists.
      const id = window.location.hash.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (target) {
        lenis?.scrollTo(target, {
          offset: ANCHOR_OFFSET,
          immediate: true,
          force: true,
        });
      }
    };

    // Two frames: the first lets the incoming page's own mount effects create
    // their ScrollTriggers, the second lets that layout settle before we measure.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(settle);
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, reducedMotion]);

  const scrollTo = useCallback(
    (target: string | HTMLElement | number, opts: ScrollToOptions = {}) => {
      const { offset = 0, immediate = false } = opts;
      const lenis = lenisRef.current;

      // Resolve to an absolute Y up front. Pin-spacers keep every section's
      // document offset stable regardless of where the pins currently sit, so
      // this stays correct even when measured from inside the pinned track.
      const node =
        typeof target === "string"
          ? document.querySelector<HTMLElement>(target)
          : typeof target === "number"
            ? null
            : target;

      const destination =
        typeof target === "number"
          ? target
          : node
            ? node.getBoundingClientRect().top + window.scrollY + offset
            : 0;

      // Reduced-motion / pre-init path: jump natively.
      if (!lenis) {
        window.scrollTo({ top: destination, behavior: "auto" });
        return;
      }

      if (immediate) {
        lenis.scrollTo(destination, { immediate: true, force: true });
        return;
      }

      const current = window.scrollY;
      const delta = destination - current;
      const approach = window.innerHeight * APPROACH_VIEWPORTS;

      if (crossesPin(current, destination)) {
        // Cover the bulk of the distance instantly — ScrollTrigger settles the
        // pins at their new state without animating through them — then tween
        // the last stretch so the arrival still reads as a scroll.
        lenis.scrollTo(destination - Math.sign(delta) * approach, {
          immediate: true,
          force: true,
        });

        // Next frame, so Lenis has committed the teleport before the tween
        // reads its start position.
        requestAnimationFrame(() => {
          lenisRef.current?.scrollTo(destination, { duration: 0.7, force: true });
        });
        return;
      }

      lenis.scrollTo(destination, { duration: 1.1 });
    },
    []
  );

  const stop = useCallback(() => lenisRef.current?.stop(), []);
  const start = useCallback(() => lenisRef.current?.start(), []);

  // Stable identity: consumers run effects keyed on this value, and a fresh
  // object every render would stop/start Lenis on unrelated re-renders.
  const value = useMemo(
    () => ({ lenis: instance, scrollTo, stop, start }),
    [instance, scrollTo, stop, start]
  );

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
}

export function useLenis(): LenisContextValue {
  const ctx = useContext(LenisContext);
  if (!ctx) {
    throw new Error("useLenis must be used inside <SmoothScrollProvider>.");
  }
  return ctx;
}

/**
 * Same as useLenis, but returns null outside the provider instead of throwing.
 *
 * For shared UI primitives (dialogs, drawers) that must work in isolation —
 * Storybook, tests — yet still need to pause smooth scroll when they open.
 */
export function useLenisOptional(): LenisContextValue | null {
  return useContext(LenisContext);
}
