"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/**
 * Server snapshot is `false` so the markup matches the common case and
 * hydration stays stable; the real value arrives on the first client tick.
 *
 * Treat a `true` result as "build no animation at all" rather than "build it
 * and set duration to 0" — an unbuilt ScrollTrigger costs nothing.
 */
function getServerSnapshot() {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
