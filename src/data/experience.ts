/**
 * Career timeline. Rendered as a vertical timeline with a scroll-drawn SVG line.
 * Dates and achievements come from the resume — nothing here is invented.
 */

export type TimelineEntry = {
  id: string;
  kind: "work" | "education";
  role: string;
  organization: string;
  location: string;
  /** Display string, e.g. "Apr 2024 — Present" */
  period: string;
  /** ISO start date, used for the JSON-LD and for sorting */
  startDate: string;
  /** ISO end date, or null when current */
  endDate: string | null;
  summary: string;
  highlights: string[];
  stack: string[];
};

export const experience: TimelineEntry[] = [
  {
    id: "webcodegenie",
    kind: "work",
    role: "React Developer",
    organization: "WebCodeGenie Technology Pvt. Ltd.",
    location: "Ahmedabad, Gujarat",
    period: "Apr 2024 — Present",
    startDate: "2024-04-01",
    endDate: null,
    summary:
      "Shipped three multi-tenant SaaS platforms end to end — AI social-media marketing, commission and payroll, and affiliate e-commerce — owning the frontend architecture across customer, admin and marketing surfaces.",
    highlights: [
      "Built three production Next.js 14 App Router applications in TypeScript — a customer control center, a multi-tenant Super Admin panel and a marketing site — spanning 90+ routes behind a shared reusable component library.",
      "Developed KLARA, a conversational AI campaign-generation agent with a guided multi-step builder, 15+ custom input types and live campaign scoring, reducing campaign setup from hours to minutes.",
      "Integrated Ayrshare to publish and analyze content across 12+ social platforms, classifying publish failures by cause so only customer-recoverable ones surfaced a one-click reconnect.",
      "Delivered AI media generation and editing for text-to-video (Veo, Sora, Runway), image and carousel generation and AI voice-over (ElevenLabs), including a full-screen video editor with scene timeline, overlays and undo/redo.",
      "Replaced polling with a Laravel Echo, Reverb and Pusher WebSocket layer for multi-minute AI generations, invalidating only the affected TanStack Query keys so finished media appeared without refetching unrelated data.",
      "Delivered a multi-tenant Super Admin panel with role-based access control, MFA, audit logs and 40+ CRUD modules, plus Stripe-backed subscription and plan builders with usage caps.",
      "Built two Next.js 14 App Router applications for PAYD — a super-admin portal for tenants, roles and finance, and a sales-rep portal for commissions, wallet, pay stubs and team management.",
      "Implemented cross-domain admin impersonation via a one-time Redis token handover, letting super admins assume tenant and branch admin sessions across separate root domains.",
      "Optimized performance and SEO through SSR, SSG and ISR, route-based code splitting and lazy-loaded editors; containerized with Docker and released via AWS CodeBuild CI/CD.",
    ],
    stack: [
      "React.js",
      "Next.js 14",
      "TypeScript",
      "Zustand",
      "TanStack Query",
      "Tailwind CSS",
      "shadcn/ui",
      "Ayrshare",
      "Stripe",
      "Laravel Reverb",
      "Docker",
    ],
  },
  {
    id: "gec-modasa",
    kind: "education",
    role: "B.Tech, Computer Engineering",
    organization: "Government Engineering College (GEC), Modasa",
    location: "Gujarat, India",
    period: "2024",
    startDate: "2020-08-01",
    endDate: "2024-05-31",
    summary:
      "Four-year Computer Engineering degree, graduating in 2024 and moving straight into frontend engineering.",
    highlights: [
      "Graduated in 2024 with a focus on web technologies and software engineering fundamentals.",
      "Languages: Hindi, Gujarati and English.",
    ],
    stack: ["JavaScript", "Data Structures", "Databases", "Web Technologies"],
  },
];
