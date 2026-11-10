"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import type { Mesh } from "three";
import { MathUtils } from "three";

type GlassKnotProps = {
  /** Scales rotation + drift response to the pointer */
  responsiveness?: number;
};

/**
 * The refractive hero object.
 *
 * MeshTransmissionMaterial re-renders the scene into a buffer each frame to
 * fake refraction, so the two knobs that matter for cost are `samples` and
 * `resolution` — both kept low here. The torus knot's own geometry is cheap
 * by comparison.
 */
export function GlassKnot({ responsiveness = 0.35 }: GlassKnotProps) {
  const mesh = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const node = mesh.current;
    if (!node) return;

    // Constant slow spin, independent of frame rate.
    node.rotation.y += delta * 0.18;
    node.rotation.z += delta * 0.05;

    // Ease toward the pointer rather than snapping — lerp factor is clamped
    // against delta so the feel is the same at 60 and 120Hz.
    const t = 1 - Math.pow(0.001, delta);
    node.rotation.x = MathUtils.lerp(
      node.rotation.x,
      state.pointer.y * responsiveness,
      t
    );
    node.position.x = MathUtils.lerp(
      node.position.x,
      state.pointer.x * 0.35,
      t * 0.6
    );
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.7}>
      {/* Sized to sit behind the hero copy, not compete with it. */}
      <mesh ref={mesh} scale={0.92}>
        <torusKnotGeometry args={[1, 0.33, 180, 32]} />
        <MeshTransmissionMaterial
          // Refraction quality. 4 samples is the floor where banding stops
          // being obvious on a shape this curved.
          samples={4}
          resolution={512}
          transmission={1}
          roughness={0.08}
          thickness={1.6}
          ior={1.45}
          chromaticAberration={0.28}
          anisotropy={0.3}
          distortion={0.25}
          distortionScale={0.4}
          temporalDistortion={0.08}
          clearcoat={1}
          attenuationDistance={1.4}
          attenuationColor="#b478ff"
          color="#e9e2ff"
          background={undefined}
        />
      </mesh>
    </Float>
  );
}
