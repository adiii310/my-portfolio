"use client";

import dynamic from "next/dynamic";

import { useCanRender3D } from "@/hooks/use-device-capability";
import { SceneFallback } from "./scene-fallback";

/**
 * Decides between the WebGL scene and the static gradient, and makes sure the
 * three.js bundle is never downloaded when the answer is "static".
 *
 * ssr: false is mandatory here — three.js touches `window` at module scope, so
 * importing it on the server throws rather than merely wasting bytes.
 */
const HeroScene = dynamic(() => import("./hero-scene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

export function HeroVisual() {
  const canRender3D = useCanRender3D();

  // null = still measuring. Hold the fallback rather than mounting a canvas
  // we might immediately tear down.
  if (canRender3D !== true) return <SceneFallback />;

  return <HeroScene />;
}
