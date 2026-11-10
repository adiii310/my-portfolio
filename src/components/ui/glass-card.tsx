"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = Omit<React.ComponentPropsWithoutRef<"div">, "ref"> & {
  /** Radius of the cursor-follow glow, in px */
  spotlightSize?: number;
  /** Set false for cards where the glow would compete with media */
  spotlight?: boolean;
  /** Rendered element — use "article"/"li" to keep the markup semantic */
  as?: React.ElementType;
};

/**
 * Frosted panel with a radial glow that tracks the cursor.
 *
 * The glow position is written straight to CSS custom properties on the node
 * rather than held in React state — a setState per mousemove would re-render
 * this subtree ~120 times a second for a purely visual effect.
 */
export function GlassCard({
  className,
  children,
  spotlightSize = 420,
  spotlight = true,
  as: Tag = "div",
  ...props
}: GlassCardProps) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef(0);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!spotlight) return;
      const node = ref.current;
      if (!node) return;

      // Coalesce to one write per frame; pointermove can outpace rAF.
      if (frame.current) return;
      const { clientX, clientY } = event;

      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const rect = node.getBoundingClientRect();
        node.style.setProperty("--mx", `${clientX - rect.left}px`);
        node.style.setProperty("--my", `${clientY - rect.top}px`);
      });
    },
    [spotlight]
  );

  const handlePointerLeave = useCallback(() => {
    ref.current?.style.setProperty("--spot-opacity", "0");
  }, []);

  const handlePointerEnter = useCallback(() => {
    ref.current?.style.setProperty("--spot-opacity", "1");
  }, []);

  return (
    <Tag
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "group/glass glass relative isolate overflow-hidden rounded-2xl",
        "transition-[border-color,box-shadow] duration-500",
        "hover:border-[color-mix(in_oklch,var(--brand),transparent_55%)]",
        className
      )}
      style={
        {
          "--spotlight-size": `${spotlightSize}px`,
          "--spot-opacity": "0",
        } as React.CSSProperties
      }
      {...props}
    >
      {children}

      {/*
        Painted last and blended additively, so it reads as light falling
        across the glass rather than a coloured disc sitting on top of it.
        Kept to --spotlight-strength (0.16 dark / 0.10 light) so body copy
        underneath never loses AA contrast.
      */}
      {spotlight ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            opacity: "calc(var(--spot-opacity, 0) * var(--spotlight-strength))",
            background:
              "radial-gradient(var(--spotlight-size) circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklch, var(--brand) 55%, var(--brand-cyan)) 0%, transparent 70%)",
            mixBlendMode: "plus-lighter",
          }}
        />
      ) : null}
    </Tag>
  );
}
