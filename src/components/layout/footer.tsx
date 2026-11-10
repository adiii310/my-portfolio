"use client";

import { ArrowUp } from "lucide-react";

import { FpsBadge } from "@/components/ui/fps-badge";
import { Magnetic } from "@/components/ui/magnetic";
import { SocialIcon } from "@/components/ui/social-icon";
import { Button } from "@/components/ui/button";
import { Inspectable } from "@/components/inspect/inspectable";
import { useLenis } from "@/hooks/use-lenis";
import { profile, socials } from "@/data/profile";

export function Footer() {
  const { scrollTo } = useLenis();
  const year = new Date().getFullYear();

  return (
    <Inspectable
      as="footer"
      name="Footer"
      props={{ liveFps: true, backToTop: "magnetic" }}
      tech={["requestAnimationFrame", "Lenis", "GSAP quickTo"]}
      note="The FPS figure is measured from real rAF cadence, sampled once a second."
      className="relative mt-32 border-t border-border/60"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          {/* Identity */}
          <div className="flex flex-col gap-3">
            <span className="font-heading text-2xl font-semibold tracking-tight">
              {profile.fullName}
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {profile.title} based in {profile.locationShort}. Currently{" "}
              {profile.available ? "open to new roles" : "not looking"}.
            </p>

            <div className="mt-2 flex items-center gap-2">
              {socials.map((social) => (
                <Button
                  key={social.label}
                  asChild
                  variant="ghost"
                  size="icon-lg"
                  className="glass rounded-full"
                >
                  <a
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={social.commandLabel}
                  >
                    <SocialIcon name={social.icon} className="size-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-col items-start gap-4 sm:items-end">
            <FpsBadge />

            <p className="font-mono text-xs text-muted-foreground">
              Built with Next.js · GSAP · Three.js
            </p>

            <Magnetic strength={0.3}>
              <Button
                variant="ghost"
                onClick={() => scrollTo(0)}
                className="glass h-10 gap-2 rounded-full px-4"
                aria-label="Back to top"
              >
                <ArrowUp className="size-4" />
                <span className="text-xs">Back to top</span>
              </Button>
            </Magnetic>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="rule-fade my-10 h-px"
        />

        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Designed &amp; built by {profile.firstName}. © {year}
          </p>
          <p className="font-mono">
            Press{" "}
            <kbd className="rounded border border-border px-1.5 py-0.5">I</kbd> to
            inspect this page
          </p>
        </div>
      </div>
    </Inspectable>
  );
}
