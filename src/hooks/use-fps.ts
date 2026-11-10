"use client";

import { useEffect, useState } from "react";

/**
 * Real frame rate, sampled once per second.
 *
 * Deliberately only setState once a second — a per-frame setState would itself
 * become the thing slowing the page down, which would make the badge a liar.
 * Pauses while the tab is hidden, since rAF is throttled there and would
 * report a misleading 0-ish value on return.
 */
export function useFps(): number | null {
  const [fps, setFps] = useState<number | null>(null);

  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    let raf = 0;
    let running = true;

    const loop = () => {
      if (!running) return;
      frames += 1;
      const now = performance.now();
      const elapsed = now - last;

      if (elapsed >= 1000) {
        setFps(Math.round((frames * 1000) / elapsed));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else {
        running = true;
        frames = 0;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    raf = requestAnimationFrame(loop);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return fps;
}
