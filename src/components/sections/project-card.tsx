"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SocialIcon } from "@/components/ui/social-icon";
import { Inspectable } from "@/components/inspect/inspectable";
import { cn } from "@/lib/utils";
import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  index: number;
  /** Desktop horizontal track vs. mobile stack */
  horizontal?: boolean;
  onOpen: (project: Project) => void;
};

export function ProjectCard({
  project,
  index,
  horizontal = false,
  onOpen,
}: ProjectCardProps) {
  return (
    <Inspectable
      name="ProjectCard"
      props={{ slug: project.slug, stack: project.stack.slice(0, 3), index }}
      tech={["next/image", "GSAP parallax", "shadcn Dialog"]}
      note="The image inside the card parallaxes independently of the card itself."
      // Full width in the mobile stack; a fixed-width slide once the track
      // turns horizontal at lg.
      className={
        horizontal
          ? "w-full lg:w-[min(82vw,52rem)] lg:shrink-0"
          : "w-full"
      }
    >
      <GlassCard
        as="article"
        data-project-card
        className="group/card flex h-full flex-col overflow-hidden"
        spotlightSize={560}
      >
        {/* Media — the inner image is oversized so it can translate without gaps */}
        <div
          data-project-media
          className={cn(
            "relative aspect-16/10 w-full overflow-hidden border-b border-border/60",
            // In the horizontal track the card is height-bounded, so the media
            // gives up its fixed ratio and absorbs whatever the body leaves.
            horizontal && "lg:aspect-auto lg:min-h-0 lg:flex-1"
          )}
        >
          <div
            data-project-image
            className="absolute inset-0 top-[-12%] h-[124%] will-change-transform"
          >
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes="(max-width: 768px) 92vw, (max-width: 1280px) 82vw, 52rem"
              className="object-cover transition-transform duration-700 group-hover/card:scale-[1.03]"
              priority={index === 0}
            />
          </div>

          {/* Index + context */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="glass rounded-full px-2.5 py-1 font-mono text-[10px] tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="glass rounded-full px-2.5 py-1 font-mono text-[10px]">
              {project.context}
            </span>
          </div>

          <span className="glass absolute top-4 right-4 rounded-full px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
            {project.year}
          </span>
        </div>

        {/* Body */}
        <div
          className={cn(
            "flex flex-1 flex-col gap-5 p-6 sm:p-8",
            horizontal && "lg:flex-none"
          )}
        >
          <header className="flex flex-col gap-2">
            <h3 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
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
            </h3>
            <p className="text-sm text-muted-foreground">{project.subtitle}</p>
          </header>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {project.blurb}
          </p>

          <ul className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, 6).map((tech) => (
              <li key={tech}>
                <Badge variant="outline" className="font-mono text-[10px] font-normal">
                  {tech}
                </Badge>
              </li>
            ))}
            {project.stack.length > 6 ? (
              <li>
                <Badge variant="secondary" className="font-mono text-[10px] font-normal">
                  +{project.stack.length - 6}
                </Badge>
              </li>
            ) : null}
          </ul>

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
            <Button
              size="lg"
              onClick={() => onOpen(project)}
              data-cursor="open"
              className="h-10 gap-2 rounded-full px-5 text-xs"
            >
              Case study
              <ArrowUpRight className="size-3.5" />
            </Button>

            <Button
              asChild
              variant="ghost"
              size="lg"
              className="glass h-10 gap-2 rounded-full px-5 text-xs"
            >
              <Link href={`/projects/${project.slug}`}>Full page</Link>
            </Button>

            {/*
              Live and source links are gated behind NDA for client work, so the
              buttons render disabled with an explanation rather than vanishing —
              their absence would otherwise read as "no links exist".
            */}
            <ExternalAction
              href={project.liveUrl}
              label="Live site"
              icon={<ArrowUpRight className="size-3.5" />}
            />
            <ExternalAction
              href={project.repoUrl}
              label="Source"
              icon={<SocialIcon name="github" className="size-3.5" />}
            />
          </div>
        </div>
      </GlassCard>
    </Inspectable>
  );
}

function ExternalAction({
  href,
  label,
  icon,
}: {
  href: string | null;
  label: string;
  icon: React.ReactNode;
}) {
  if (href) {
    return (
      <Button
        asChild
        variant="ghost"
        size="lg"
        className="glass h-10 gap-2 rounded-full px-5 text-xs"
      >
        <a href={href} target="_blank" rel="noopener noreferrer">
          {label}
          {icon}
        </a>
      </Button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} className="inline-flex rounded-full">
          <Button
            variant="ghost"
            size="lg"
            disabled
            aria-disabled="true"
            className="h-10 gap-2 rounded-full px-5 text-xs"
          >
            <Lock className="size-3" />
            {label}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>Private client work — link available on request.</TooltipContent>
    </Tooltip>
  );
}
