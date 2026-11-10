import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { SplitTextReveal } from "./split-text";

type SectionHeadingProps = {
  /** Mono eyebrow, e.g. "02 — Skills" */
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <Reveal>
        <span className="inline-flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          <span
            aria-hidden="true"
            className="inline-block h-px w-8"
            style={{ background: "var(--brand)" }}
          />
          {eyebrow}
        </span>
      </Reveal>

      <SplitTextReveal
        as="h2"
        type="lines"
        className="max-w-3xl text-4xl leading-[1.05] font-semibold text-balance sm:text-5xl lg:text-6xl"
      >
        {title}
      </SplitTextReveal>

      {description ? (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
