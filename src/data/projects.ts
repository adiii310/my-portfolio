/**
 * Project showcase. Problem / solution / impact is drawn from the resume.
 * Anything not evidenced there is marked [PLACEHOLDER] — no invented metrics.
 *
 * To add a project: append an object here. The horizontal showcase, the
 * /projects/[slug] case-study page and the command palette all read from this.
 */

export type Project = {
  slug: string;
  name: string;
  subtitle: string;
  /** Short line used on the card and in the palette */
  blurb: string;
  year: string;
  role: string;
  context: "Work" | "Side project";
  featured: boolean;
  problem: string;
  solution: string;
  /** Keep honest: qualitative unless the resume evidences a number. */
  impact: string;
  highlights: string[];
  stack: string[];
  /** Local placeholder art lives in /public/projects — swap for real screenshots. */
  image: string;
  imageAlt: string;
  /** null renders a disabled button with a "coming soon" tooltip */
  liveUrl: string | null;
  repoUrl: string | null;
  /** Tailwind-friendly accent pair used for the card glow, in oklch */
  accent: { from: string; to: string };
};

export const projects: Project[] = [
  {
    slug: "klozr",
    name: "KLOZR",
    subtitle: "AI Social Media Marketing & Sales Automation Platform",
    blurb:
      "A multi-tenant AI marketing suite — conversational campaign builder, generative media pipeline and real-time publishing across 12+ networks.",
    year: "2024 — 2025",
    role: "Frontend Engineer — architecture and delivery",
    context: "Work",
    featured: true,
    problem:
      "Marketing teams were assembling campaigns by hand across a dozen disconnected social tools, and long-running AI generations left the UI polling blindly with no idea which job had finished.",
    solution:
      "Three Next.js 14 App Router applications in TypeScript — a customer control center, a multi-tenant Super Admin panel and a marketing site — spanning 90+ routes behind a shared component library. KLARA, a conversational AI agent, guides campaign creation through a multi-step builder with 15+ custom input types and live scoring, while a Laravel Echo / Reverb / Pusher WebSocket layer replaced polling entirely.",
    impact:
      "Campaign setup dropped from hours to minutes. Finished AI media appeared the moment it was ready, because only the affected TanStack Query keys were invalidated rather than refetching unrelated data.",
    highlights: [
      "Built three production Next.js 14 App Router apps spanning 90+ routes with a shared reusable component library.",
      "Developed KLARA, a conversational AI campaign-generation agent with a guided multi-step builder and live campaign scoring.",
      "Integrated Ayrshare to publish and analyze across 12+ social platforms, classifying publish failures by cause so only customer-recoverable ones surfaced a one-click reconnect.",
      "Delivered text-to-video (Veo, Sora, Runway), image and carousel generation and ElevenLabs voice-over, with a full-screen video editor featuring scene timeline, overlays and undo/redo.",
      "Replaced polling with a WebSocket layer for multi-minute AI generations, invalidating only affected query keys.",
      "Built a content calendar, post editor, Recharts KPI dashboards and an AI-assisted direct message inbox.",
      "Shipped a multi-tenant Super Admin panel with RBAC, MFA, audit logs and 40+ CRUD modules, plus Stripe subscription and plan builders with usage caps.",
      "Optimized via SSR, SSG and ISR, route-based code splitting and lazy-loaded editors; containerized with Docker and released through AWS CodeBuild CI/CD.",
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
    image: "/projects/klozr.svg",
    imageAlt:
      "KLOZR campaign dashboard mockup showing an AI campaign builder and KPI charts",
    liveUrl: null,
    repoUrl: null,
    accent: { from: "oklch(0.72 0.19 300)", to: "oklch(0.78 0.15 220)" },
  },
  {
    slug: "klozr-retail",
    name: "KLOZR Retail",
    subtitle: "Marketing Website — Scroll-Driven Animation",
    blurb:
      "A single-page scroll-driven marketing experience: 19 GSAP ScrollTrigger timelines across 18 animated sections, frame-synced to Lenis.",
    year: "2025",
    role: "Frontend Engineer — motion and delivery",
    context: "Work",
    featured: true,
    problem:
      "The product needed a marketing site that demonstrated the platform's polish, where the narrative unfolded through scroll rather than sitting in static blocks — without the jank that usually follows.",
    solution:
      "A scroll-driven single-page experience built on 19 GSAP ScrollTrigger timelines across 18 sections, using scrubbed playback, pinning and staggered reveals. Lenis smooth scrolling was driven from the GSAP ticker rather than its own RAF loop, so scrub-linked timelines stayed frame-synced, with gsap.matchMedia for responsive variants and gsap.context for scoped cleanup.",
    impact:
      "Scroll, pin and parallax stayed frame-synced instead of fighting each other — the usual failure mode when a smooth-scroll library runs its own loop alongside ScrollTrigger.",
    highlights: [
      "Implemented 19 GSAP ScrollTrigger timelines across 18 animated sections with scrubbed playback, pinning and staggered reveals.",
      "Created parallax depth effects with yPercent transforms and scroll-snapped section transitions, with ScrollToPlugin powering smooth anchor navigation.",
      "Drove Lenis smooth scrolling from the GSAP ticker rather than its own loop, keeping scrub-linked timelines frame-synced.",
      "Used gsap.matchMedia for responsive variants and gsap.context for scoped cleanup.",
    ],
    stack: [
      "Next.js 14",
      "TypeScript",
      "GSAP",
      "ScrollTrigger",
      "ScrollToPlugin",
      "@gsap/react",
      "Lenis",
      "Tailwind CSS",
      "Zustand",
    ],
    image: "/projects/klozr-retail.svg",
    imageAlt:
      "KLOZR Retail marketing site mockup showing a pinned scroll-driven hero section",
    liveUrl: null,
    repoUrl: null,
    accent: { from: "oklch(0.75 0.17 330)", to: "oklch(0.74 0.18 285)" },
  },
  {
    slug: "payd",
    name: "PAYD",
    subtitle: "Multi-Tenant Commission & Payroll Platform",
    blurb:
      "Two App Router portals — super-admin and sales-rep — covering versioned commission plans, payout runs and cross-domain impersonation.",
    year: "2024 — 2025",
    role: "Frontend Engineer",
    context: "Work",
    featured: true,
    problem:
      "Commission structures changed constantly and had to stay auditable across tenants, while support staff needed to see exactly what a tenant admin saw — across separate root domains.",
    solution:
      "Two Next.js 14 App Router TypeScript applications: a super-admin portal for tenants, roles and finance, and a sales-rep portal for commissions, wallet, pay stubs, sales and team management. A commission plan builder supports versioned plans, SKU and tier rules, legend tiers and spiff rules alongside payout runs and tax-year reporting.",
    impact:
      "Super admins could assume tenant and branch admin sessions across separate root domains via a one-time Redis token handover, rather than maintaining parallel credentials.",
    highlights: [
      "Built two Next.js 14 App Router TypeScript applications: a super-admin portal and a sales-rep portal.",
      "Developed a commission plan builder supporting versioned plans, SKU and tier rules, legend tiers and spiff rules, alongside payout runs, pay-stub drawers and tax-year reporting views.",
      "Implemented cross-domain admin impersonation via a one-time Redis token handover across separate root domains.",
      "Built granular RBAC with OTP login, invite acceptance, audit logging and a QR-code referral join flow, plus PAYE AI chat panels and Laravel Echo real-time updates.",
    ],
    stack: [
      "Next.js 14",
      "React 18",
      "TypeScript",
      "TanStack Query",
      "Zustand",
      "Radix UI",
      "Zod",
      "Laravel Echo",
      "Pusher",
      "Docker",
    ],
    image: "/projects/payd.svg",
    imageAlt:
      "PAYD admin portal mockup showing a commission plan builder and payout tables",
    liveUrl: null,
    repoUrl: null,
    accent: { from: "oklch(0.76 0.16 200)", to: "oklch(0.74 0.17 265)" },
  },
  {
    slug: "hailstorm",
    name: "HailStorm",
    subtitle: "Weather Data Visualization Platform",
    blurb:
      "AccuWeather hailstorm data plotted on Google Maps, with drawing tools for annotating hail-affected regions and live Socket.IO updates.",
    year: "2024",
    role: "Frontend Developer",
    context: "Work",
    featured: true,
    problem:
      "Administrators needed to analyze where hailstorms had actually landed and mark affected regions, but the raw weather feed offered no spatial view and no way to annotate it.",
    solution:
      "A web application visualizing AccuWeather hailstorm data on Google Maps using the Maps API and Drawing Tools to plot and annotate hail-affected regions for administrator analysis, backed by GraphQL data with Socket.IO live updates and automated OpenAI, Twilio and SendGrid alerts.",
    impact:
      "Administrators could draw and annotate affected regions directly on the map, with live updates and automated alerting replacing manual monitoring.",
    highlights: [
      "Visualized AccuWeather hailstorm data on Google Maps using the Maps API and Drawing Tools.",
      "Enabled administrators to plot and annotate hail-affected regions for analysis.",
      "Backed the view with GraphQL data and Socket.IO live updates.",
      "Automated OpenAI, Twilio and SendGrid alerting.",
    ],
    stack: [
      "React.js",
      "Node.js",
      "MongoDB",
      "GraphQL",
      "Socket.IO",
      "Google Maps API",
      "OpenAI",
      "Twilio",
      "SendGrid",
    ],
    image: "/projects/hailstorm.svg",
    imageAlt:
      "HailStorm mockup showing hail data plotted and annotated over a map view",
    liveUrl: null,
    repoUrl: null,
    accent: { from: "oklch(0.78 0.14 195)", to: "oklch(0.72 0.16 240)" },
  },
  {
    slug: "sales-crm",
    name: "Sales CRM",
    subtitle: "Lead & Opportunity Management Platform",
    blurb:
      "Pipeline tracking, lead assignment and activity history with multi-channel communication across call, SMS, email, WhatsApp and video.",
    year: "2024",
    role: "Frontend Developer",
    context: "Work",
    featured: true,
    problem:
      "Sales conversations were scattered across channels with no shared pipeline view, so lead ownership and activity history were impossible to reconstruct.",
    solution:
      "A Sales CRM for lead and opportunity management with pipeline tracking, lead assignment, activity history and project-tracking modules, plus multi-channel communication across call, SMS, email, WhatsApp and video, backed by Socket.IO real-time messaging and KafkaJS event streaming.",
    impact:
      "Pipeline state, lead ownership and every channel of communication lived in one place with real-time updates.",
    highlights: [
      "Developed pipeline tracking, lead assignment, activity history and project-tracking modules.",
      "Built multi-channel communication across call, SMS, email, WhatsApp and video.",
      "Backed real-time messaging with Socket.IO and event streaming with KafkaJS.",
    ],
    stack: [
      "React.js",
      "Node.js",
      "Express",
      "MongoDB",
      "Redis",
      "KafkaJS",
      "Socket.IO",
      "NodeMailer",
    ],
    image: "/projects/sales-crm.svg",
    imageAlt:
      "Sales CRM mockup showing a kanban pipeline board and lead activity timeline",
    liveUrl: null,
    repoUrl: null,
    accent: { from: "oklch(0.8 0.15 160)", to: "oklch(0.76 0.15 205)" },
  },
  {
    slug: "orygn-onyx",
    name: "ORYGN / Onyx",
    subtitle: "Multi-Tenant E-Commerce & Affiliate Platform",
    blurb:
      "A Vue 3 storefront and affiliate hub — 20 pages, multi-tenant routing by header, CASL permissions and an AI shopping assistant.",
    year: "2024 — 2025",
    role: "Frontend Engineer",
    context: "Work",
    featured: true,
    problem:
      "One storefront codebase had to serve many tenants and sponsor subdomains, while affiliates needed their own permission-scoped hub rather than a bolt-on dashboard.",
    solution:
      "A Vue 3 and Vite storefront with file-based routing and layouts across 20 pages — shop, product detail, multi-step cart, checkout — made multi-tenant via X-Tenant and X-Storefront headers with sponsor-subdomain referral attribution. The affiliate hub was built in Vue 3 and Vuetify with CASL permission-based access control, ApexCharts dashboards, a TipTap editor, vue-i18n localization and Sentry monitoring.",
    impact:
      "A single storefront codebase served multiple tenants and sponsor subdomains, with referral attribution resolved from the subdomain rather than hand-managed links.",
    highlights: [
      "Built the ORYGN storefront in Vue 3 and Vite with file-based routing and layouts across 20 pages.",
      "Made it multi-tenant via X-Tenant and X-Storefront headers with sponsor-subdomain referral attribution.",
      "Developed the affiliate hub in Vue 3 and Vuetify with CASL permission-based access control, ApexCharts dashboards, a TipTap editor, vue-i18n localization and Sentry monitoring.",
      "Built a referral and rewards system with redeemable points and admin tooling for product and inventory management.",
      "Added an AI chat assistant delivering product details and personalized recommendations.",
    ],
    stack: [
      "Vue 3",
      "Pinia",
      "Vuetify",
      "Vite",
      "CASL",
      "ApexCharts",
      "TipTap",
      "PHP",
      "PostgreSQL",
      "Redis",
      "Docker",
    ],
    image: "/projects/orygn-onyx.svg",
    imageAlt:
      "ORYGN storefront mockup showing a product grid and affiliate analytics dashboard",
    liveUrl: null,
    repoUrl: null,
    accent: { from: "oklch(0.8 0.16 85)", to: "oklch(0.74 0.17 35)" },
  },
  {
    slug: "trustify-trips",
    name: "Trustify Trips",
    subtitle: "Verified Travel Marketplace",
    blurb:
      "A full-stack side project across three repos — a 20-route Next.js 15 customer site, an admin panel, and an Express REST API with 18 feature modules.",
    year: "2025",
    role: "Solo — full stack",
    context: "Side project",
    featured: true,
    problem:
      "Travel listings are easy to fake, and a marketplace only works if verification, auth and media handling are trustworthy end to end — which meant owning the whole stack, not just the UI.",
    solution:
      "Three repositories: a 20-route customer site and an admin panel on Next.js 15 App Router with React 19, TypeScript and Tailwind CSS v4, backed by an Express and Mongoose REST API spanning 18 feature modules with JWT and bcrypt authentication, Helmet, CORS, per-IP rate limiting and Cloudinary uploads.",
    impact:
      "Fetch was confined to one module that classifies network, HTTP and malformed responses into a single typed error — necessary because CORS rejections surface as status 0 rather than a real code. Server state went to TanStack Query and device state to Zustand, with hydration gating.",
    highlights: [
      "Built a full-stack travel marketplace across three repositories: a 20-route customer site and an admin panel on Next.js 15 App Router.",
      "Backed it with an Express and Mongoose REST API spanning 18 feature modules with JWT and bcrypt authentication, Helmet, CORS, per-IP rate limiting and Cloudinary uploads.",
      "Confined fetch to one module classifying network, HTTP and malformed responses into a single typed error, since CORS rejections surface as status 0 rather than a real code.",
      "Split server state into TanStack Query and device state into Zustand with hydration gating.",
    ],
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "TanStack Query",
      "Zustand",
      "Node.js",
      "Express",
      "MongoDB",
      "JWT",
    ],
    image: "/projects/trustify-trips.svg",
    imageAlt:
      "Trustify Trips mockup showing a verified travel listing grid and booking detail",
    liveUrl: null,
    repoUrl: null,
    accent: { from: "oklch(0.78 0.15 145)", to: "oklch(0.76 0.16 190)" },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
