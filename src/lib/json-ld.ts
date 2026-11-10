import { profile, socials } from "@/data/profile";
import { experience } from "@/data/experience";
import { skillGroups } from "@/data/skills";
import { site, siteUrl } from "@/data/site";
import type { Project } from "@/data/projects";

/**
 * JSON-LD built from the same /data files the page renders, so the structured
 * data can never drift from the visible content.
 */

export function personJsonLd() {
  const currentRole = experience.find((e) => e.kind === "work" && e.endDate === null);
  const education = experience.find((e) => e.kind === "education");

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: profile.fullName,
    givenName: profile.firstName,
    familyName: profile.lastName,
    jobTitle: profile.title,
    description: profile.summary,
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    url: siteUrl,
    image: `${siteUrl}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ahmedabad",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    knowsLanguage: [...profile.languages],
    knowsAbout: skillGroups.flatMap((group) => group.skills),
    sameAs: socials
      .filter((s) => s.href.startsWith("http"))
      .map((s) => s.href),
    ...(currentRole
      ? {
          worksFor: {
            "@type": "Organization",
            name: currentRole.organization,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Ahmedabad",
              addressRegion: "Gujarat",
              addressCountry: "IN",
            },
          },
        }
      : {}),
    ...(education
      ? {
          alumniOf: {
            "@type": "CollegeOrUniversity",
            name: education.organization,
          },
        }
      : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: site.name,
    description: site.description,
    inLanguage: "en",
    publisher: { "@id": `${siteUrl}/#person` },
  };
}

export function projectJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${project.name} — ${project.subtitle}`,
    description: project.blurb,
    url: `${siteUrl}/projects/${project.slug}`,
    creator: { "@id": `${siteUrl}/#person` },
    dateCreated: project.year,
    keywords: project.stack.join(", "),
    ...(project.liveUrl ? { sameAs: [project.liveUrl] } : {}),
  };
}
