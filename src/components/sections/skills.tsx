"use client";

import { useState } from "react";

import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { GlassCard } from "@/components/ui/glass-card";
import { Inspectable } from "@/components/inspect/inspectable";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useIsDesktop } from "@/hooks/use-media-query";
import { skillGroups } from "@/data/skills";
import { cn } from "@/lib/utils";

/**
 * Skills as an orbiting constellation rather than progress bars.
 *
 * No proficiency percentages anywhere — they would be invented numbers, and
 * "React 85%" tells a recruiter nothing a project list doesn't tell better.
 *
 * Desktop gets the orbit; below lg and under reduced motion it degrades to a
 * plain grouped chip list, which is the same information without the geometry.
 */
export function Skills() {
  const [activeId, setActiveId] = useState(skillGroups[0].id);
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  const active = skillGroups.find((group) => group.id === activeId) ?? skillGroups[0];
  const useOrbit = isDesktop && !reducedMotion;

  return (
    <Inspectable
      as="section"
      name="Skills"
      props={{ groups: skillGroups.length, layout: useOrbit ? "orbit" : "list" }}
      tech={["CSS transforms", "counter-rotation", "matchMedia"]}
      note="Rings and chips animate in opposite directions at the same duration, so labels stay upright."
      className="relative"
    >
      <section
        id="skills"
        aria-labelledby="skills-heading"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32"
      >
        <SectionHeading
          eyebrow="02 — Stack"
          title="The tools I actually reach for."
          description="Grouped by what they do, not ranked by a number I'd have to make up."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-14">
          {/* Group selector */}
          <Reveal
            as="ul"
            stagger={0.06}
            className="flex flex-col gap-1.5"
            role="tablist"
            aria-label="Skill groups"
          >
            {skillGroups.map((group) => {
              const isActive = group.id === activeId;
              return (
                <li key={group.id}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`skills-panel-${group.id}`}
                    id={`skills-tab-${group.id}`}
                    onClick={() => setActiveId(group.id)}
                    onFocus={() => setActiveId(group.id)}
                    className={cn(
                      "group/tab relative flex w-full items-baseline gap-3 rounded-xl px-4 py-3 text-left transition-colors",
                      isActive ? "glass" : "hover:bg-accent/50"
                    )}
                  >
                    <span
                      className="font-mono text-[10px] tabular-nums"
                      style={{
                        color: isActive ? "var(--brand)" : "var(--muted-foreground)",
                      }}
                    >
                      {String(skillGroups.indexOf(group) + 1).padStart(2, "0")}
                    </span>

                    <span className="flex flex-col gap-0.5">
                      <span
                        className={cn(
                          "font-heading text-base font-medium transition-colors",
                          !isActive && "text-muted-foreground group-hover/tab:text-foreground"
                        )}
                      >
                        {group.title}
                      </span>
                      <span className="text-xs leading-snug text-muted-foreground">
                        {group.blurb}
                      </span>
                    </span>

                    <span className="ml-auto font-mono text-[10px] text-muted-foreground tabular-nums">
                      {group.skills.length}
                    </span>
                  </button>
                </li>
              );
            })}
          </Reveal>

          {/* Display */}
          <div
            id={`skills-panel-${active.id}`}
            role="tabpanel"
            aria-labelledby={`skills-tab-${active.id}`}
            tabIndex={0}
            className="min-h-96"
          >
            {useOrbit ? (
              <Orbit key={active.id} skills={active.skills} />
            ) : (
              <GlassCard className="p-6">
                <ul className="flex flex-wrap gap-2">
                  {active.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            )}
          </div>
        </div>
      </section>
    </Inspectable>
  );
}

/** Distributes skills across two counter-rotating rings. */
function Orbit({ skills }: { skills: string[] }) {
  // Inner ring takes roughly a third — keeps both rings from crowding.
  const splitAt = Math.ceil(skills.length / 3);
  // Radii are a fraction of the ring box, and each chip is centred on the
  // ring — so half a chip's width sits outside it. The wrapper's padding
  // below reserves that overhang; without it the widest labels get clipped.
  const rings = [
    { items: skills.slice(0, splitAt), radius: 28, duration: 44, reverse: false },
    { items: skills.slice(splitAt), radius: 42, duration: 64, reverse: true },
  ];

  return (
    // Outer wrapper does the insetting. Padding on the ring box itself would
    // not work: an absolutely positioned child resolves `inset` against the
    // padding box, so the rings would simply grow to fill it again.
    <div className="mx-auto w-full max-w-xl px-12 sm:px-20">
      <div className="relative aspect-square w-full">
      {/* Ring guides */}
      {rings.map((ring) => (
        <div
          key={`guide-${ring.radius}`}
          aria-hidden="true"
          className="absolute rounded-full border border-border/50"
          style={{
            inset: `${50 - ring.radius}%`,
          }}
        />
      ))}

      {/* Centre */}
      <div className="absolute inset-[34%] grid place-items-center">
        <div
          className="glass grid size-full place-items-center rounded-full text-center"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--brand) 22%, transparent), transparent 70%)",
          }}
        >
          <span className="font-heading text-3xl font-semibold tabular-nums">
            {skills.length}
          </span>
        </div>
      </div>

      {rings.map((ring) => {
        const spin = ring.reverse ? "orbit-counter" : "orbit-spin";
        const counter = ring.reverse ? "orbit-spin" : "orbit-counter";
        const timing = `${ring.duration}s linear infinite`;

        return (
          <div
            key={ring.radius}
            className="absolute inset-0"
            style={{ animation: `${spin} ${timing}` }}
          >
            {ring.items.map((skill, index) => {
              const angle = (index / ring.items.length) * 360;

              /*
                Four nested elements, each owning exactly one transform:
                  1. sized to the ring, rotated to this chip's angle
                  2. pinned to the ring's top edge and centred on it
                  3. undoes the placement rotation
                  4. undoes the ring's spin
                Collapsing any two would make the animation overwrite a static
                transform, which is what makes naive orbit layouts wobble.
              */
              return (
                <div
                  key={skill}
                  className="absolute"
                  style={{
                    inset: `${50 - ring.radius}%`,
                    rotate: `${angle}deg`,
                  }}
                >
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="block" style={{ rotate: `${-angle}deg` }}>
                      <span
                        className="block"
                        style={{ animation: `${counter} ${timing}` }}
                      >
                        <span className="glass block rounded-full px-3 py-1.5 font-mono text-[11px] whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground">
                          {skill}
                        </span>
                      </span>
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
      </div>
    </div>
  );
}
