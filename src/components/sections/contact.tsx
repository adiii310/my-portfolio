"use client";

import { useState } from "react";
import { Check, Copy, Download, MapPin } from "lucide-react";
import { toast } from "sonner";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ScrambleText } from "@/components/ui/scramble-text";
import { Magnetic } from "@/components/ui/magnetic";
import { SocialIcon } from "@/components/ui/social-icon";
import { Inspectable } from "@/components/inspect/inspectable";
import { ContactForm } from "./contact-form";
import { profile, socials } from "@/data/profile";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      toast.success("Email copied", { description: profile.email });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — here it is instead", {
        description: profile.email,
      });
    }
  };

  return (
    <Inspectable
      as="section"
      name="Contact"
      props={{ validation: "zod", honeypot: true, transport: "Resend" }}
      tech={["React Hook Form", "Zod", "TanStack Query", "Resend"]}
      note="One schema validates in the browser and again in the route handler."
      className="relative"
    >
      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32"
      >
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          {/* Pitch */}
          <div className="flex flex-col gap-8">
            <Reveal>
              <span className="inline-flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                <span
                  aria-hidden="true"
                  className="inline-block h-px w-8"
                  style={{ background: "var(--brand)" }}
                />
                06 — Contact
              </span>
            </Reveal>

            <h2
              id="contact-heading"
              className="text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl"
            >
              <ScrambleText as="span" className="block">
                Let&apos;s build
              </ScrambleText>
              <ScrambleText as="span" className="text-gradient block">
                something.
              </ScrambleText>
            </h2>

            <Reveal delay={0.1}>
              <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                I&apos;m {profile.available ? "open to frontend roles" : "not looking"}{" "}
                and happy to talk about React, Next.js, or a product you&apos;re
                trying to get off the ground.
              </p>
            </Reveal>

            <Reveal delay={0.15} className="flex flex-col gap-3">
              {/* Email with copy */}
              <button
                type="button"
                onClick={copyEmail}
                className="glass group flex items-center justify-between gap-4 rounded-xl px-5 py-4 text-left transition-colors hover:border-[color-mix(in_oklch,var(--brand),transparent_50%)]"
              >
                <span className="flex flex-col gap-0.5">
                  <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                    Email
                  </span>
                  <span className="text-sm break-all">{profile.email}</span>
                </span>
                {copied ? (
                  <Check className="size-4 shrink-0" style={{ color: "var(--brand-cyan)" }} />
                ) : (
                  <Copy className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                )}
              </button>

              {/* Location */}
              <div className="glass flex items-center gap-4 rounded-xl px-5 py-4">
                <MapPin className="size-4 shrink-0" style={{ color: "var(--brand)" }} />
                <span className="flex flex-col gap-0.5">
                  <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                    Based in
                  </span>
                  <span className="text-sm">{profile.location}</span>
                </span>
              </div>
            </Reveal>

            {/* Links */}
            <Reveal delay={0.2} className="flex flex-wrap items-center gap-2">
              {socials
                .filter((social) => social.href.startsWith("http"))
                .map((social) => (
                  <Button
                    key={social.label}
                    asChild
                    variant="ghost"
                    size="lg"
                    className="glass h-11 gap-2 rounded-full px-5 text-xs"
                  >
                    <a href={social.href} target="_blank" rel="noopener noreferrer">
                      <SocialIcon name={social.icon} className="size-4" />
                      {social.label}
                    </a>
                  </Button>
                ))}

              <Magnetic strength={0.3}>
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="glass h-11 gap-2 rounded-full px-5 text-xs"
                >
                  <a href={profile.resumeUrl} download={profile.resumeFileName}>
                    <Download className="size-4" />
                    Résumé
                  </a>
                </Button>
              </Magnetic>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={0.1}>
            <GlassCard className="p-6 sm:p-8" spotlightSize={520}>
              <ContactForm />
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </Inspectable>
  );
}
