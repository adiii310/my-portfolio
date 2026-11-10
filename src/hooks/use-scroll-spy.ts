"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently occupying the viewport band.
 *
 * Uses IntersectionObserver with a rootMargin that ignores the top and bottom
 * thirds of the screen, so the "active" section is whatever sits in the middle
 * band rather than whatever merely touched the top edge.
 */
export function useScrollSpy(ids: string[], offset = 0): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }

        if (visible.size === 0) return;

        // Most-visible section wins; ties resolve to document order.
        let best: string | null = null;
        let bestRatio = -1;
        for (const id of ids) {
          const ratio = visible.get(id);
          if (ratio !== undefined && ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        setActiveId(best);
      },
      {
        rootMargin: `-${offset + 33}% 0px -33% 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, offset]);

  return activeId;
}
