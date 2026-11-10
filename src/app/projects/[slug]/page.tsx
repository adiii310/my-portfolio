import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { SocialIcon } from "@/components/ui/social-icon";
import { projectJsonLd } from "@/lib/json-ld";
import { getProjectBySlug, projects } from "@/data/projects";

type Params = { params: Promise<{ slug: string }> };

/** Pre-renders every case study at build time. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return { title: "Project not found" };

  return {
    title: `${project.name} — ${project.subtitle}`,
    description: project.blurb,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} — ${project.subtitle}`,
      description: project.blurb,
      type: "article",
      url: `/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="mx-auto max-w-4xl px-4 pt-32 pb-24 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd(project)) }}
      />

      <Button asChild variant="ghost" className="glass mb-10 h-9 gap-2 rounded-full px-4 text-xs">
        <Link href="/#work">
          <ArrowLeft className="size-3.5" />
          All work
        </Link>
      </Button>

      <header className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-mono text-[10px] font-normal">
            {project.context}
          </Badge>
          <Badge variant="outline" className="font-mono text-[10px] font-normal">
            {project.year}
          </Badge>
          <Badge variant="outline" className="font-mono text-[10px] font-normal">
            {project.role}
          </Badge>
        </div>

        <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
          <span
            style={{
              backgroundImage: `linear-gradient(110deg, ${project.accent.from}, ${project.accent.to})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {project.name}
          </span>
        </h1>

        <p className="text-lg text-muted-foreground sm:text-xl">{project.subtitle}</p>
      </header>

      <div className="relative mt-12 aspect-16/10 w-full overflow-hidden rounded-2xl border border-border">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(max-width: 896px) 92vw, 56rem"
          className="object-cover"
          priority
        />
      </div>

      <div className="mt-14 flex flex-col gap-10">
        <Section label="Problem">{project.problem}</Section>
        <Section label="Solution">{project.solution}</Section>
        <Section label="Impact" accent>
          {project.impact}
        </Section>

        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
            What I built
          </h2>
          <ul className="flex flex-col gap-3">
            {project.highlights.map((item) => (
              <li
                key={item.slice(0, 40)}
                className="flex gap-3 leading-relaxed text-muted-foreground"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.6rem] size-1 shrink-0 rounded-full"
                  style={{ background: "var(--brand)" }}
                />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
            Stack
          </h2>
          <ul className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <li key={tech}>
                <Badge variant="outline" className="font-mono text-[10px] font-normal">
                  {tech}
                </Badge>
              </li>
            ))}
          </ul>
        </section>

        {/* Links */}
        <div className="flex flex-wrap gap-2">
          {project.liveUrl ? (
            <Button asChild className="h-11 gap-2 rounded-full px-5 text-xs">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                Visit live site
                <ArrowUpRight className="size-3.5" />
              </a>
            </Button>
          ) : (
            <span className="glass inline-flex h-11 items-center gap-2 rounded-full px-5 text-xs text-muted-foreground">
              <Lock className="size-3" />
              Private client work — link on request
            </span>
          )}

          {project.repoUrl ? (
            <Button
              asChild
              variant="ghost"
              className="glass h-11 gap-2 rounded-full px-5 text-xs"
            >
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                <SocialIcon name="github" className="size-3.5" />
                Source
              </a>
            </Button>
          ) : null}
        </div>
      </div>

      {/* Next project */}
      <GlassCard className="mt-20 p-8">
        <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          Next
        </span>
        <Link
          href={`/projects/${next.slug}`}
          className="mt-3 flex items-center justify-between gap-6"
        >
          <span className="flex flex-col gap-1">
            <span className="font-heading text-2xl font-semibold tracking-tight">
              {next.name}
            </span>
            <span className="text-sm text-muted-foreground">{next.subtitle}</span>
          </span>
          <ArrowUpRight className="size-5 shrink-0" style={{ color: "var(--brand)" }} />
        </Link>
      </GlassCard>
    </article>
  );
}

function Section({
  label,
  children,
  accent = false,
}: {
  label: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2
        className="font-mono text-[10px] tracking-[0.2em] uppercase"
        style={{ color: accent ? "var(--brand)" : "var(--muted-foreground)" }}
      >
        {label}
      </h2>
      <p className="text-lg leading-relaxed text-muted-foreground">{children}</p>
    </section>
  );
}
