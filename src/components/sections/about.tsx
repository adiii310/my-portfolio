"use client";

import { GraduationCap, Languages, MapPin } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { TiltCard } from "@/components/ui/tilt-card";
import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/reveal";
import { Inspectable } from "@/components/inspect/inspectable";
import { profile, stats } from "@/data/profile";

export function About() {
  const facts = [
    { icon: MapPin, label: "Based in", value: profile.location },
    {
      icon: GraduationCap,
      label: "Education",
      value: `${profile.education.degree}, ${profile.education.year}`,
      detail: profile.education.school,
    },
    { icon: Languages, label: "Languages", value: profile.languages.join(" · ") },
  ];

  return (
    <Inspectable
      as="section"
      name="About"
      props={{ stats: stats.length, tilt: true }}
      tech={["GSAP", "TiltCard", "CountUp"]}
      note="The profile card tilts on pointer move; stat counters run once when scrolled into view."
      className="relative"
    >
      <section
        id="about"
        aria-labelledby="about-heading"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32"
      >
        <SectionHeading
          eyebrow="01 — About"
          title="I build front ends that hold up in production."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          {/* Story */}
          <div className="flex flex-col gap-6">
            <Reveal stagger={0.12} className="flex flex-col gap-6">
              {profile.bio.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-base leading-[1.75] text-muted-foreground sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </Reveal>

            {/* Stats */}
            <Reveal
              as="ul"
              stagger={0.1}
              className="mt-4 grid grid-cols-3 gap-4 sm:gap-6"
            >
              {stats.map((stat) => (
                <li key={stat.label} className="flex flex-col gap-1.5">
                  <span className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                    <span className="text-gradient">
                      <CountUp value={stat.value} suffix={stat.suffix} />
                    </span>
                  </span>
                  <span className="text-sm font-medium">{stat.label}</span>
                  <span className="text-xs leading-snug text-muted-foreground">
                    {stat.description}
                  </span>
                </li>
              ))}
            </Reveal>
          </div>

          {/* Profile card */}
          <Reveal>
            <TiltCard className="lg:sticky lg:top-28">
              <GlassCard className="p-7">
                {/* Depth: these lift off the card surface during the tilt */}
                <div
                  className="flex flex-col gap-6"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <div className="flex items-center gap-4">
                    <span
                      aria-hidden="true"
                      className="grid size-14 place-items-center rounded-2xl font-heading text-lg font-semibold text-background"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--brand), var(--brand-cyan))",
                      }}
                    >
                      {profile.initials}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-heading text-lg font-semibold">
                        {profile.fullName}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {profile.title}
                      </span>
                    </div>
                  </div>

                  <div aria-hidden="true" className="rule-fade h-px" />

                  <dl className="flex flex-col gap-5">
                    {facts.map((fact) => (
                      <div key={fact.label} className="flex items-start gap-3">
                        <fact.icon
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0"
                          style={{ color: "var(--brand)" }}
                        />
                        <div className="flex flex-col gap-0.5">
                          <dt className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                            {fact.label}
                          </dt>
                          <dd className="text-sm leading-snug">{fact.value}</dd>
                          {fact.detail ? (
                            <dd className="text-xs text-muted-foreground">
                              {fact.detail}
                            </dd>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </dl>

                  <div aria-hidden="true" className="rule-fade h-px" />

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {profile.experienceYears} years of professional experience,
                    currently at WebCodeGenie Technology Pvt. Ltd.
                  </p>
                </div>
              </GlassCard>
            </TiltCard>
          </Reveal>
        </div>
      </section>
    </Inspectable>
  );
}
