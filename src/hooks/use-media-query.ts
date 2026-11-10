"use client";

import { useSyncExternalStore } from "react";

/**
 * SSR-safe matchMedia. Returns `false` on the server and during the first
 * render so hydration never mismatches.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** True on devices without a precise pointer — phones, tablets. */
export function useIsTouch(): boolean {
  return useMediaQuery("(hover: none), (pointer: coarse)");
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}
