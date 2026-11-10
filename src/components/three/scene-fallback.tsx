/**
 * Static stand-in for the WebGL hero.
 *
 * Shown on phones, low-memory devices, Data Saver, reduced-motion, and while
 * the 3D chunk is still loading — so the hero never has an empty hole in it
 * and never shifts layout when the real scene arrives.
 *
 * Pure CSS: no canvas, no JS, no network.
 */
export function SceneFallback() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 grid place-items-center overflow-hidden"
    >
      <div className="relative aspect-square w-[min(68vw,30rem)]">
        {/* Core orb */}
        <div
          className="absolute inset-[18%] rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(circle at 34% 30%, var(--brand-cyan), var(--brand) 42%, transparent 72%)",
            opacity: 0.75,
          }}
        />
        {/* Refraction ring */}
        <div
          className="absolute inset-[6%] rounded-full border opacity-50"
          style={{
            borderColor: "color-mix(in oklch, var(--brand) 40%, transparent)",
          }}
        />
        <div
          className="absolute inset-[22%] rounded-full border opacity-30"
          style={{
            borderColor: "color-mix(in oklch, var(--brand-cyan) 50%, transparent)",
          }}
        />
        {/* Specular highlight */}
        <div
          className="absolute top-[26%] left-[30%] size-[14%] rounded-full blur-md"
          style={{ background: "oklch(1 0 0 / 55%)" }}
        />
      </div>
    </div>
  );
}
