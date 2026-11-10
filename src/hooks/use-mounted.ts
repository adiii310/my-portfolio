"use client";

import { useEffect, useState } from "react";

/**
 * False during SSR and the first client render, true afterwards.
 *
 * Needed anywhere the rendered output depends on browser-only state — the
 * persisted Zustand store, the resolved theme — so the server HTML and the
 * first client render agree and React doesn't throw a hydration mismatch.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
