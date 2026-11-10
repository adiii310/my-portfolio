"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { Inspectable } from "@/components/inspect/inspectable";
import { buildNotes } from "@/data/how-built";
import { cn } from "@/lib/utils";

/**
 * The "show your working" section. Each card expands to the actual technique,
 * with a real snippet from this codebase rather than a generic illustration.
 */
export function HowBuilt() {
  const [expanded, setExpanded] = useState<string | null>(buildNotes[0].id);

  return (
    <Inspectable
      as="section"
      name="HowBuilt"
      props={{ cards: buildNotes.length, expandable: true }}
      tech={["React state", "CSS grid", "aria-expanded"]}
      note="Every snippet here is lifted from this repository, not written for the slide."
      className="relative"
    >
      <section
        id="process"
        aria-labelledby="process-heading"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32"
      >
        <SectionHeading
          eyebrow="05 — Process"
          title="How this site was built."
          description="The decisions behind the thing you're scrolling through, with the code that implements them."
        />

        <Reveal
          as="ul"
          stagger={0.07}
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {buildNotes.map((note) => {
            const isOpen = expanded === note.id;

            return (
              <li key={note.id} className="h-full">
                <GlassCard className="h-full">
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : note.id)}
                    aria-expanded={isOpen}
                    aria-controls={`build-note-${note.id}`}
                    className="flex w-full flex-col gap-3 p-6 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="font-mono text-[10px] tracking-[0.18em] uppercase"
                        style={{ color: "var(--brand)" }}
                      >
                        {note.tag}
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
                          isOpen && "rotate-180"
                        )}
                      />
                    </div>

                    <h3 className="font-heading text-lg leading-snug font-medium">
                      {note.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {note.description}
                    </p>
                  </button>

                  {/*
                    grid-template-rows 0fr -> 1fr animates a height change
                    without needing a measured pixel value, and unlike
                    max-height it has no "wrong guess" easing artefact.
                  */}
                  <div
                    id={`build-note-${note.id}`}
                    className="grid transition-[grid-template-rows] duration-400 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-3 px-6 pb-6">
                        <pre className="overflow-x-auto rounded-lg border border-border bg-background/50 p-3">
                          <code className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                            {note.snippet}
                          </code>
                        </pre>

                        <ul className="flex flex-wrap gap-1.5">
                          {note.stack.map((tech) => (
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
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </li>
            );
          })}
        </Reveal>
      </section>
    </Inspectable>
  );
}
