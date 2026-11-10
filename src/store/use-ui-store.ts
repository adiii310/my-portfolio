"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Device state only.
 *
 * Nothing here came from the network — that belongs to TanStack Query. This
 * store holds what is true about *this browser tab*: whether inspect mode is
 * on, whether the palette is open, whether the preloader has already played.
 */

type UIState = {
  /** DevTools-style overlay toggle (floating button, or the `I` shortcut) */
  inspectMode: boolean;
  toggleInspect: () => void;
  setInspect: (value: boolean) => void;

  /** ⌘K / Ctrl+K command palette */
  commandOpen: boolean;
  setCommandOpen: (value: boolean) => void;
  toggleCommand: () => void;

  /** Preloader plays once per session, not once per navigation. */
  hasPlayedIntro: boolean;
  markIntroPlayed: () => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      inspectMode: false,
      toggleInspect: () => set((state) => ({ inspectMode: !state.inspectMode })),
      setInspect: (value) => set({ inspectMode: value }),

      commandOpen: false,
      setCommandOpen: (value) => set({ commandOpen: value }),
      toggleCommand: () => set((state) => ({ commandOpen: !state.commandOpen })),

      hasPlayedIntro: false,
      markIntroPlayed: () => set({ hasPlayedIntro: true }),
    }),
    {
      name: "portfolio-ui",
      // sessionStorage, not localStorage: the intro should replay for a
      // returning visitor tomorrow, just not on every route change today.
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ hasPlayedIntro: state.hasPlayedIntro }),
    }
  )
);
