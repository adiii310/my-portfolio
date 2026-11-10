"use client";

import { useEffect, useRef } from "react";

export type MousePosition = {
  /** Viewport pixels */
  x: number;
  y: number;
  /** Normalised to -1..1 with the origin at the viewport centre */
  nx: number;
  ny: number;
};

/**
 * Tracks the pointer in a ref rather than in state.
 *
 * A `useState` version would re-render the whole subtree on every mousemove —
 * at 120Hz that is 120 React renders a second. Consumers that need the value
 * per-frame (the 3D scene, the cursor) read `.current` inside their own rAF or
 * useFrame loop instead.
 */
export function useMousePosition() {
  const position = useRef<MousePosition>({ x: 0, y: 0, nx: 0, ny: 0 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      position.current = {
        x: event.clientX,
        y: event.clientY,
        nx: (event.clientX / w) * 2 - 1,
        ny: -((event.clientY / h) * 2 - 1),
      };
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return position;
}
