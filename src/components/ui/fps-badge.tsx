"use client";

import { Activity } from "lucide-react";

import { useFps } from "@/hooks/use-fps";
import { cn } from "@/lib/utils";

/**
 * Live frame-rate readout. Measures the real rAF cadence rather than claiming
 * a number — if the site drops frames, this says so.
 */
export function FpsBadge({ className }: { className?: string }) {
  const fps = useFps();

  // Most displays cap at 60; 120Hz panels legitimately report higher.
  const tier =
    fps === null ? "idle" : fps >= 55 ? "good" : fps >= 30 ? "fair" : "poor";

  const dotColor =
    tier === "good"
      ? "var(--brand-cyan)"
      : tier === "fair"
        ? "oklch(0.8 0.15 85)"
        : tier === "poor"
          ? "var(--destructive)"
          : "var(--muted-foreground)";

  return (
    <div
      className={cn(
        "glass inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5",
        "font-mono text-xs text-muted-foreground",
        className
      )}
    >
      <span className="relative flex size-2">
        {tier === "good" ? (
          <span
            aria-hidden="true"
            className="absolute inline-flex size-full rounded-full opacity-60"
            style={{ background: dotColor, animation: "pulse-ring 2s ease-out infinite" }}
          />
        ) : null}
        <span
          aria-hidden="true"
          className="relative inline-flex size-2 rounded-full"
          style={{ background: dotColor }}
        />
      </span>

      <Activity aria-hidden="true" className="size-3.5" />

      <span
        // Changes once a second; polite so it never interrupts a screen reader.
        aria-live="polite"
        aria-atomic="true"
        className="tabular-nums"
      >
        {fps === null ? "—" : fps} FPS
      </span>

      <span aria-hidden="true" className="h-3 w-px bg-border" />

      <span className="hidden sm:inline">Next.js 15</span>
    </div>
  );
}
