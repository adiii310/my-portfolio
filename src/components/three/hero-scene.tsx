"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";

import { GlassKnot } from "./glass-knot";

/**
 * WebGL hero scene. Loaded only via next/dynamic with ssr: false — three.js
 * has no business in the server bundle or the initial payload.
 *
 * Two guards keep it cheap:
 *   - frameloop pauses entirely when the canvas scrolls out of view, so an
 *     offscreen refractive material stops costing anything.
 *   - PerformanceMonitor drops the pixel ratio before it drops frames.
 */
export default function HeroScene() {
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(1.5);

  useEffect(() => {
    const node = wrapper.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapper} className="absolute inset-0">
      <Canvas
        // never = fully paused; the GPU goes idle rather than rendering
        // a hidden canvas behind the rest of the page.
        frameloop={visible ? "always" : "never"}
        dpr={dpr}
        camera={{ position: [0, 0, 7.4], fov: 38 }}
        gl={{
          antialias: false, // transmission already resolves edges; AA is wasted cost
          powerPreference: "high-performance",
          alpha: true,
        }}
        style={{ background: "transparent" }}
      >
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(1.5)}
        />

        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 6, 4]} intensity={1.1} />

        {/*
          Procedural environment. drei's `preset` values fetch an HDRI from a
          CDN at runtime; hand-placed Lightformers give comparable specular
          response with zero network cost and no CSP exceptions.
        */}
        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={2.6}
            position={[-3, 2, 2]}
            scale={[6, 6, 1]}
            color="#a855f7"
          />
          <Lightformer
            form="rect"
            intensity={2.2}
            position={[3, -1, 2]}
            scale={[6, 6, 1]}
            color="#22d3ee"
          />
          <Lightformer
            form="circle"
            intensity={3}
            position={[0, 4, -3]}
            scale={4}
            color="#ffffff"
          />
        </Environment>

        <GlassKnot />
      </Canvas>
    </div>
  );
}
