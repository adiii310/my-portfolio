/**
 * Everything about Aditya that the site renders.
 * Edit this file to change the site's copy — no component touches hardcoded text.
 */

export type SocialLink = {
  label: string;
  href: string;
  /** lucide-react icon name, resolved in components/ui/social-icon.tsx */
  icon: "github" | "linkedin" | "mail" | "phone";
  /** Shown in the command palette */
  commandLabel: string;
};

export type Stat = {
  label: string;
  value: number;
  /** Rendered after the animated number, e.g. "+" or "" */
  suffix?: string;
  description: string;
};

export const profile = {
  firstName: "Aditya",
  lastName: "Thakur",
  fullName: "Aditya Thakur",
  initials: "AT",

  /** Hero headline role line */
  title: "Frontend Engineer",
  /** Hero sub-line — rendered with the mono font */
  tagline: "React · Next.js · TypeScript · Vue 3",
  /** Status chip in the hero */
  status: "Open to frontend roles",
  available: true,

  email: "adityathakur6354@gmail.com",
  phone: "+91 6354703438",
  location: "Ahmedabad, Gujarat, India",
  locationShort: "Ahmedabad, India",

  experienceYears: "2.5+",
  education: {
    degree: "B.Tech, Computer Engineering",
    school: "Government Engineering College (GEC), Modasa",
    location: "Gujarat, India",
    year: "2024",
  },
  languages: ["Hindi", "Gujarati", "English"],

  /** Professional summary — verbatim from the resume. */
  summary:
    "Frontend Engineer with 2.5+ years building production, multi-tenant SaaS in React.js, Next.js and TypeScript, with Vue 3 experience. Shipped three platforms end to end — AI social media marketing, commission and payroll, and affiliate e-commerce — covering conversational AI, AI media pipelines and real-time WebSocket layers. Specialize in App Router architecture, performance optimization and reusable component libraries.",

  /** Story-style bio for the About section. Each string is a paragraph. */
  bio: [
    "I build the front end of products that have to hold up in production — multi-tenant dashboards, real-time feeds, and AI workflows where the UI is doing real work, not just rendering a list.",
    "Most of my last two and a half years went into shipping three platforms end to end at WebCodeGenie: an AI social-media marketing suite, a commission and payroll system, and an affiliate e-commerce storefront. That meant conversational AI builders, text-to-video pipelines, WebSocket layers that replaced polling, and admin panels with role-based access across 40+ CRUD modules.",
    "I care most about the parts people feel but rarely name: App Router architecture that stays legible as it grows, cache keys that invalidate exactly what changed, and animation that runs at 60fps because it only ever touches transform and opacity.",
  ],

  resumeUrl: "/resume.pdf",
  resumeFileName: "Aditya-Thakur-Frontend-Engineer.pdf",
} as const;

export const socials: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/adiii310",
    icon: "github",
    commandLabel: "Open GitHub profile",
  },
  {
    // [PLACEHOLDER] — replace with your real LinkedIn URL.
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/adityathakur",
    icon: "linkedin",
    commandLabel: "Open LinkedIn profile",
  },
  {
    label: "Email",
    href: `mailto:${profile.email}`,
    icon: "mail",
    commandLabel: "Send an email",
  },
];

export const stats: Stat[] = [
  {
    label: "Years of experience",
    value: 2.5,
    suffix: "+",
    description: "Building production React and Next.js since 2023",
  },
  {
    label: "Platforms shipped",
    value: 7,
    suffix: "",
    description: "End-to-end products across SaaS, e-commerce and data viz",
  },
  {
    label: "Technologies",
    value: 40,
    suffix: "+",
    description: "Across frontend, state, real-time, AI and backend",
  },
];
