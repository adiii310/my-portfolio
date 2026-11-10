"use client";

import { useCallback, useRef } from "react";

import { gsap } from "@/lib/gsap";
import { useIsTouch } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type TiltCardProps = React.ComponentProps<"div"> & {
  /** Maximum rotation in degrees at the card's corners */
  max?: number;
  /** Perspective distance; lower is a more dramatic tilt */
  perspective?: number;
};

/**
 * 3D tilt toward the cursor.
 *
 * `transform-style: preserve-3d` on the card lets children opt into depth with
 * their own translateZ, which is what sells the effect — a flat plane rotating
 * just looks like a skew.
 */
export function TiltCard({
  className,
  children,
  max = 7,
  perspective = 900,
  ...props
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  const reducedMotion = useReducedMotion();
  const enabled = !isTouch && !reducedMotion;

  const handleMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const node = ref.current;
      if (!node || !enabled) return;

      const rect = node.getBoundingClientRect();
      // -0.5..0.5 relative to the card centre
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(node, {
        rotateY: px * max * 2,
        rotateX: -py * max * 2,
        duration: 0.6,
        ease: "power3.out",
        transformPerspective: perspective,
        transformOrigin: "center",
      });
    },
    [enabled, max, perspective]
  );

  const handleLeave = useCallback(() => {
    if (!ref.current || !enabled) return;
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.9,
      ease: "elastic.out(1, 0.6)",
    });
  }, [enabled]);

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn("[transform-style:preserve-3d] will-change-transform", className)}
      {...props}
    >
      {children}
    </div>
  );
}
