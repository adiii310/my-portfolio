/**
 * Skill groups — verbatim from the resume. No invented skills, no proficiency
 * percentages. The Skills section renders these as an orbiting constellation.
 */

export type SkillGroup = {
  id: string;
  title: string;
  /** One-line framing shown when the group is active */
  blurb: string;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "core",
    title: "Core",
    blurb: "The languages and frameworks I write every day.",
    skills: [
      "JavaScript (ES6+)",
      "TypeScript",
      "HTML5",
      "CSS3",
      "React.js 18 & 19",
      "Next.js 14 & 15",
      "App Router",
      "SSR / SSG / ISR",
      "Vue 3",
      "Composition API",
      "Pinia",
      "Vue Router",
      "Vuetify",
      "React Hook Form",
      "Zod",
      "Recharts",
    ],
  },
  {
    id: "state-data",
    title: "State & Data",
    blurb: "Keeping server state and device state honestly separated.",
    skills: [
      "Redux",
      "Zustand",
      "Context API",
      "TanStack Query",
      "TanStack Table",
      "REST APIs",
      "GraphQL",
    ],
  },
  {
    id: "ai",
    title: "AI Integration",
    blurb: "Shipping LLM and generative-media features into real products.",
    skills: [
      "AI campaign & content generation",
      "LLM prompt workflows",
      "Text-to-video (Veo, Sora, Runway)",
      "AI voice-over (ElevenLabs)",
      "OpenAI APIs",
      "AI chat interfaces",
    ],
  },
  {
    id: "styling",
    title: "Styling & UI",
    blurb: "Design systems that stay consistent as the surface area grows.",
    skills: [
      "Tailwind CSS",
      "shadcn/ui",
      "Radix UI",
      "Bootstrap",
      "Scroll-driven animation",
      "Parallax & micro-interactions",
      "Responsive design",
      "Accessibility",
      "Dark & light theming",
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    blurb: "Third-party systems, real-time transports and motion tooling.",
    skills: [
      "Ayrshare",
      "Stripe",
      "Socket.IO",
      "Laravel Echo & Reverb",
      "Pusher",
      "KafkaJS",
      "Twilio",
      "SendGrid",
      "Weglot",
      "Google Website Translator",
      "GSAP (ScrollTrigger)",
      "Lenis smooth scroll",
    ],
  },
  {
    id: "backend",
    title: "Backend & Architecture",
    blurb: "Enough backend to design the contract, not just consume it.",
    skills: [
      "Node.js",
      "Express",
      "Mongoose",
      "REST API design",
      "JWT & bcrypt auth",
      "Rate limiting",
      "Cloudinary uploads",
      "Multi-tenant SaaS",
      "Role-based access control",
      "MFA",
      "SSR & SEO optimization",
      "Core Web Vitals",
      "i18n",
    ],
  },
  {
    id: "tools",
    title: "Tools & Databases",
    blurb: "The build, ship and store side of the workflow.",
    skills: [
      "Git",
      "Docker",
      "AWS CodeBuild CI/CD",
      "Vite",
      "Webpack",
      "pnpm",
      "Jira",
      "Postman",
      "Agile & Kanban",
      "PostgreSQL",
      "MongoDB",
      "Redis",
    ],
  },
];

/** Flat list used by the scroll-velocity marquee between sections. */
export const marqueeTech: string[] = [
  "React",
  "Next.js",
  "TypeScript",
  "Vue 3",
  "Tailwind CSS",
  "shadcn/ui",
  "TanStack Query",
  "Zustand",
  "GSAP",
  "Lenis",
  "Three.js",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "Redis",
  "Docker",
  "GraphQL",
  "Socket.IO",
  "Stripe",
];
