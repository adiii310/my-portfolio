"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "./use-reduced-motion";

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

/**
 * Decides whether this device should render the WebGL hero at all.
 *
 * A refractive MeshTransmissionMaterial renders the scene to an extra
 * framebuffer every frame. That is fine on a laptop GPU and punishing on a
 * mid-range phone, so we bail out on any of:
 *
 *   - prefers-reduced-motion
 *   - coarse pointer (phones/tablets)
 *   - deviceMemory <= 4 GB
 *   - hardwareConcurrency <= 4 cores
 *   - Data Saver enabled
 *
 * Returns `null` until measured, so callers can hold the static fallback
 * rather than flashing a canvas and tearing it down.
 */
export function useCanRender3D(): boolean | null {
  const reducedMotion = useReducedMotion();
  const [capable, setCapable] = useState<boolean | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setCapable(false);
      return;
    }

    const evaluate = () => {
      const nav = navigator as NavigatorWithHints;

      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
      const lowCores =
        typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4;
      const saveData = nav.connection?.saveData === true;
      // Below this the knot is mostly hidden behind the copy anyway, so the
      // canvas is pure cost. Catches narrow desktop windows too, which a
      // pointer check alone would wave through.
      const tooNarrow = window.innerWidth < 1024;

      setCapable(
        !(coarsePointer || lowMemory || lowCores || saveData || tooNarrow)
      );
    };

    evaluate();

    // Re-evaluate on resize: a one-shot check made at 1440px would keep the
    // canvas alive after the window is dragged down to phone width.
    const onResize = () => evaluate();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [reducedMotion]);

  return capable;
}
