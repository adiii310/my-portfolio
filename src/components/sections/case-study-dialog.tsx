"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/data/projects";

/**
 * Case study in a modal. The same content is also reachable as a real page at
 * /projects/[slug] — the dialog is the fast path, the route is the shareable,
 * crawlable one.
 */
export function CaseStudyDialog({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-h-[88vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader className="text-left">
          <div className="mb-4 flex flex-wrap items-center gap-2">
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

          <DialogTitle className="font-heading text-3xl font-semibold tracking-tight">
            {project.name}
          </DialogTitle>
          <DialogDescription className="text-base">
            {project.subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-2 aspect-16/10 w-full overflow-hidden rounded-xl border border-border">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(max-width: 768px) 92vw, 48rem"
            className="object-cover"
          />
        </div>

        <div className="mt-6 flex flex-col gap-6">
          <CaseSection label="Problem" body={project.problem} />
          <CaseSection label="Solution" body={project.solution} />
          <CaseSection label="Impact" body={project.impact} accent />

          <section className="flex flex-col gap-3">
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              What I built
            </h4>
            <ul className="flex flex-col gap-2">
              {project.highlights.map((item) => (
                <li
                  key={item.slice(0, 40)}
                  className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.55rem] size-1 shrink-0 rounded-full"
                    style={{ background: "var(--brand)" }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              Stack
            </h4>
            <ul className="flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <li key={tech}>
                  <Badge
                    variant="outline"
                    className="font-mono text-[10px] font-normal"
                  >
                    {tech}
                  </Badge>
                </li>
              ))}
            </ul>
          </section>

          <Button asChild variant="ghost" className="glass h-11 gap-2 rounded-full">
            <Link href={`/projects/${project.slug}`}>
              Open full case study
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CaseSection({
  label,
  body,
  accent = false,
}: {
  label: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h4
        className="font-mono text-[10px] tracking-[0.2em] uppercase"
        style={{ color: accent ? "var(--brand)" : "var(--muted-foreground)" }}
      >
        {label}
      </h4>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </section>
  );
}
