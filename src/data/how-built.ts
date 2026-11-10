/**
 * "How this site was built" — the interactive architecture card grid.
 * Keep this honest: every claim here is something the site actually does.
 */

export type BuildNote = {
  id: string;
  title: string;
  /** Mono-font label on the card */
  tag: string;
  description: string;
  /** Short code sample shown when the card expands */
  snippet: string;
  stack: string[];
};

export const buildNotes: BuildNote[] = [
  {
    id: "architecture",
    title: "App Router, server-first",
    tag: "architecture",
    description:
      "Every section is a server component until it needs state. Only the interactive leaves — cursor, 3D scene, palette, form — are client components, so the initial HTML ships without their JavaScript.",
    snippet: `// page.tsx — server component
import { Hero } from "@/components/sections/hero";

export default function Page() {
  return <Hero />; // client leaves opt in with "use client"
}`,
    stack: ["Next.js 15", "React 19", "Server Components"],
  },
  {
    id: "motion",
    title: "GSAP driven by one ticker",
    tag: "motion",
    description:
      "Lenis is driven from the GSAP ticker instead of its own requestAnimationFrame loop. Two loops means scrub-linked timelines drift by a frame; one loop keeps pinning, parallax and scrub in sync.",
    snippet: `gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
lenis.on("scroll", ScrollTrigger.update);`,
    stack: ["GSAP", "ScrollTrigger", "Lenis", "@gsap/react"],
  },
  {
    id: "cleanup",
    title: "Scoped animation cleanup",
    tag: "lifecycle",
    description:
      "Every timeline is created inside useGSAP with a scope ref. On unmount the context reverts each tween and kills its ScrollTriggers, so route changes never leak pinned spacers.",
    snippet: `useGSAP(() => {
  gsap.from(".reveal", { y: 40, opacity: 0, stagger: 0.08 });
}, { scope: container }); // auto-reverted on unmount`,
    stack: ["@gsap/react", "useGSAP", "gsap.context"],
  },
  {
    id: "three",
    title: "3D that knows when to quit",
    tag: "webgl",
    description:
      "The refractive hero object is lazy-loaded with next/dynamic and ssr: false, then skipped entirely on coarse pointers, low device-memory, reduced-motion or low core counts — replaced by a static gradient.",
    snippet: `const HeroScene = dynamic(() => import("./hero-scene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});`,
    stack: ["React Three Fiber", "drei", "next/dynamic"],
  },
  {
    id: "state",
    title: "Server state vs device state",
    tag: "state",
    description:
      "TanStack Query owns anything that came from the network; Zustand owns anything that belongs to this browser — theme, inspect mode, palette visibility. They never overlap.",
    snippet: `// device state only
const useUIStore = create<UIState>()((set) => ({
  inspectMode: false,
  toggleInspect: () => set((s) => ({ inspectMode: !s.inspectMode })),
}));`,
    stack: ["Zustand", "TanStack Query"],
  },
  {
    id: "forms",
    title: "One schema, both sides",
    tag: "validation",
    description:
      "The contact form's Zod schema is imported by the client form and by the route handler, so the browser and the server validate identically. A honeypot field catches naive bots before Resend is ever called.",
    snippet: `// lib/validations.ts — shared
export const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.email(),
  message: z.string().min(10).max(2000),
  company: z.string().max(0), // honeypot
});`,
    stack: ["Zod", "React Hook Form", "Resend"],
  },
  {
    id: "a11y",
    title: "Motion is a preference",
    tag: "accessibility",
    description:
      "prefers-reduced-motion is read once and threaded everywhere: smooth scroll is disabled, parallax collapses to zero, the 3D object stops rotating, and reveals become instant rather than animated.",
    snippet: `const reduced = useReducedMotion();
if (reduced) return; // no ScrollTrigger, no parallax
gsap.set(".reveal", { opacity: 1, y: 0 });`,
    stack: ["prefers-reduced-motion", "matchMedia", "ARIA"],
  },
  {
    id: "performance",
    title: "Transform and opacity only",
    tag: "performance",
    description:
      "Nothing animates a property that triggers layout. Parallax uses yPercent, reveals use transform plus opacity, and will-change is applied for the duration of a tween rather than left on permanently.",
    snippet: `gsap.to(layer, {
  yPercent: -18,          // compositor-only
  ease: "none",
  scrollTrigger: { scrub: true },
});`,
    stack: ["Core Web Vitals", "GPU compositing", "next/image"],
  },
];
