/**
 * Ambient background: three slowly drifting gradient blobs plus a grain
 * overlay. Server component — it has no interactivity, so it ships no JS.
 *
 * The blobs animate with CSS keyframes on `transform` only, so they stay on
 * the compositor and never trigger layout. `prefers-reduced-motion` freezes
 * them via globals.css.
 */

const NOISE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;

export function Aurora() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Base wash so the blobs have something to sit against */}
      <div className="absolute inset-0 bg-background" />

      {/* Violet — top left */}
      <div
        className="aurora-layer absolute -top-[22%] -left-[14%] size-[max(420px,58vw)] rounded-full opacity-[0.55] blur-[110px] will-change-transform dark:opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--brand), transparent 68%)",
          animation: "aurora-drift-a 22s ease-in-out infinite",
        }}
      />

      {/* Cyan — right, slightly below centre */}
      <div
        className="aurora-layer absolute top-[18%] -right-[18%] size-[52vw] rounded-full opacity-40 blur-[120px] will-change-transform dark:opacity-45"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--brand-cyan), transparent 70%)",
          animation: "aurora-drift-b 28s ease-in-out infinite",
        }}
      />

      {/* Deep indigo — bottom, anchors the fold */}
      <div
        className="aurora-layer absolute -bottom-[26%] left-[22%] size-[62vw] rounded-full opacity-30 blur-[130px] will-change-transform dark:opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.55 0.2 275), transparent 72%)",
          animation: "aurora-drift-c 34s ease-in-out infinite",
        }}
      />

      {/* Grain — breaks up the gradient banding that flat blurs produce */}
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          opacity: "var(--noise-opacity)",
          backgroundImage: `url("data:image/svg+xml,${NOISE_SVG}")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Vignette so content in the centre keeps contrast against the blobs */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 0%, transparent 40%, color-mix(in oklch, var(--background), transparent 35%) 100%)",
        }}
      />
    </div>
  );
}
