"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

/**
 * Single registration point for GSAP plugins.
 *
 * Importing this module anywhere in the client guarantees the plugins are
 * registered exactly once — registering twice is harmless but registering
 * zero times fails silently at tween time, which is worse.
 *
 * SplitText, DrawSVGPlugin and ScrollToPlugin became free in GSAP 3.13, so
 * these are the real plugins rather than hand-rolled approximations.
 */

let registered = false;

if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(
    ScrollTrigger,
    ScrollToPlugin,
    DrawSVGPlugin,
    SplitText,
    ScrambleTextPlugin,
    useGSAP
  );

  // ScrollTrigger recalculates on resize; on mobile the URL bar collapsing
  // fires resize constantly, so only refresh on a real orientation change.
  ScrollTrigger.config({ ignoreMobileResize: true });

  registered = true;
}

/** Shared easing so every section feels like the same hand drew it. */
export const ease = {
  out: "power3.out",
  inOut: "power2.inOut",
  expo: "expo.out",
  /** For anything that should feel physical rather than eased */
  soft: "sine.out",
} as const;

export const duration = {
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
} as const;

export {
  gsap,
  ScrollTrigger,
  ScrollToPlugin,
  DrawSVGPlugin,
  SplitText,
  ScrambleTextPlugin,
  useGSAP,
};
