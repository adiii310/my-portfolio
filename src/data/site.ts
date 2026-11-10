import { profile } from "./profile";

/**
 * Site-level config: canonical URL, nav sections, SEO defaults.
 * Set NEXT_PUBLIC_SITE_URL in production so OG images and the sitemap resolve.
 */

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://adityathakur.dev";

export type NavItem = {
  id: string;
  label: string;
  /** In-page anchor */
  href: string;
};

/** Order here drives the navbar, the scroll-spy and the command palette. */
export const navItems: NavItem[] = [
  { id: "about", label: "About", href: "#about" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "work", label: "Work", href: "#work" },
  { id: "process", label: "Process", href: "#process" },
  { id: "contact", label: "Contact", href: "#contact" },
];

export const site = {
  name: `${profile.fullName} — ${profile.title}`,
  shortName: profile.fullName,
  url: siteUrl,
  description:
    "Frontend Engineer with 2.5+ years building production multi-tenant SaaS in React, Next.js and TypeScript. App Router architecture, real-time UI and performance.",
  keywords: [
    "Frontend Engineer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Vue 3",
    "Ahmedabad",
    "Aditya Thakur",
    "App Router",
    "TanStack Query",
    "GSAP",
  ],
  locale: "en_IN",
  twitterHandle: undefined as string | undefined,
} as const;
