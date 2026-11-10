"use client";

import { useEffect, useRef, useState } from "react";

import { useUIStore } from "@/store/use-ui-store";
import { formatJsx, type InspectProps } from "./inspectable";
import { cn } from "@/lib/utils";

type Target = {
  rect: DOMRect;
  margin: { top: number; right: number; bottom: number; left: number };
  name: string;
  props?: InspectProps;
  tech: string[];
  note?: string;
  tag: string;
};

/**
 * DevTools-style inspector.
 *
 * One delegated pointermove listener on the document resolves the nearest
 * [data-inspect-name] ancestor, so adding a new inspectable section costs
 * nothing at runtime. Reads are coalesced to one per animation frame because
 * getBoundingClientRect forces layout, and doing that per pointermove event
 * would be the one thing in this site that actually janks.
 */
export function InspectOverlay() {
  const inspectMode = useUIStore((s) => s.inspectMode);
  const setInspect = useUIStore((s) => s.setInspect);
  const [target, setTarget] = useState<Target | null>(null);
  const frame = useRef(0);

  // `I` toggles inspect mode; Escape exits. Ignored while typing.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const el = event.target as HTMLElement | null;
      const typing =
        el?.tagName === "INPUT" ||
        el?.tagName === "TEXTAREA" ||
        el?.isContentEditable;

      if (typing || event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key.toLowerCase() === "i") {
        event.preventDefault();
        useUIStore.getState().toggleInspect();
      }
      if (event.key === "Escape" && useUIStore.getState().inspectMode) {
        setInspect(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setInspect]);

  useEffect(() => {
    if (!inspectMode) {
      setTarget(null);
      return;
    }

    document.body.dataset.inspecting = "true";

    const measure = (clientX: number, clientY: number) => {
      const el = document
        .elementFromPoint(clientX, clientY)
        ?.closest<HTMLElement>("[data-inspect-name]");

      if (!el) {
        setTarget(null);
        return;
      }

      const styles = getComputedStyle(el);
      const rawProps = el.dataset.inspectProps;

      setTarget({
        rect: el.getBoundingClientRect(),
        margin: {
          top: parseFloat(styles.marginTop) || 0,
          right: parseFloat(styles.marginRight) || 0,
          bottom: parseFloat(styles.marginBottom) || 0,
          left: parseFloat(styles.marginLeft) || 0,
        },
        name: el.dataset.inspectName ?? "Unknown",
        props: rawProps ? (JSON.parse(rawProps) as InspectProps) : undefined,
        tech: el.dataset.inspectTech?.split("|").filter(Boolean) ?? [],
        note: el.dataset.inspectNote,
        tag: el.tagName.toLowerCase(),
      });
    };

    const onMove = (event: PointerEvent) => {
      if (frame.current) return;
      const { clientX, clientY } = event;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        measure(clientX, clientY);
      });
    };

    // Rects are viewport-relative, so a scroll invalidates them immediately.
    const onScroll = () => setTarget(null);

    document.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      delete document.body.dataset.inspecting;
      document.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, [inspectMode]);

  if (!inspectMode) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9000]">
      {/* Persistent hint so the mode never feels like a stuck state */}
      <div className="glass-strong absolute top-20 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] tracking-wide text-muted-foreground">
        <span
          className="inline-block size-1.5 rounded-full"
          style={{ background: "var(--brand)" }}
        />
        INSPECT MODE
        <span className="text-border">·</span>
        hover any section
        <span className="text-border">·</span>
        <kbd className="rounded border border-border px-1">I</kbd> to exit
      </div>

      {target ? <InspectHighlight target={target} /> : null}
    </div>
  );
}

function InspectHighlight({ target }: { target: Target }) {
  const { rect, margin, name, props, tech, note, tag } = target;

  /*
    Place the label above the element when there's room, otherwise below —
    then clamp into the viewport regardless. Without the clamp, an element
    taller than the screen (a pinned project card) pushes its own label off
    the bottom and the inspector appears to do nothing.
  */
  const LABEL_H = 190;
  const roomAbove = rect.top > LABEL_H + 16;
  const preferredTop = roomAbove ? rect.top - 12 - LABEL_H : rect.bottom + 28;

  const labelTop = Math.min(
    Math.max(preferredTop, 72), // clear the fixed navbar
    window.innerHeight - LABEL_H - 16
  );
  const labelLeft = Math.min(Math.max(rect.left, 12), window.innerWidth - 340);

  return (
    <>
      {/* Margin box — the orange band DevTools draws outside the border box */}
      {margin.top || margin.right || margin.bottom || margin.left ? (
        <div
          className="absolute border border-dashed"
          style={{
            top: rect.top - margin.top,
            left: rect.left - margin.left,
            width: rect.width + margin.left + margin.right,
            height: rect.height + margin.top + margin.bottom,
            borderColor: "color-mix(in oklch, var(--brand-cyan) 45%, transparent)",
            background: "color-mix(in oklch, var(--brand-cyan) 7%, transparent)",
          }}
        />
      ) : null}

      {/* Content box */}
      <div
        className="absolute border border-dashed transition-[top,left,width,height] duration-150 ease-out"
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderColor: "var(--brand)",
          background: "color-mix(in oklch, var(--brand) 8%, transparent)",
        }}
      >
        {/* Corner ticks */}
        {(["-top-px -left-px", "-top-px -right-px", "-bottom-px -left-px", "-bottom-px -right-px"] as const).map(
          (pos) => (
            <span
              key={pos}
              className={cn("absolute size-1.5", pos)}
              style={{ background: "var(--brand)" }}
            />
          )
        )}
      </div>

      {/* Dimension pill */}
      <div
        className="absolute rounded px-1.5 py-0.5 font-mono text-[10px] text-background"
        style={{
          top: rect.bottom + 4,
          left: rect.left,
          background: "var(--brand)",
        }}
      >
        {Math.round(rect.width)} × {Math.round(rect.height)}
      </div>

      {/* Source label */}
      <div
        className="glass-strong absolute max-w-[min(360px,90vw)] overflow-hidden rounded-lg p-3 shadow-2xl"
        style={{ top: labelTop, left: labelLeft, maxHeight: LABEL_H }}
      >
        <code className="block font-mono text-[11px] leading-relaxed break-words text-foreground">
          <span className="text-muted-foreground">{"<"}</span>
          <span style={{ color: "var(--brand)" }}>{name}</span>
          {props
            ? Object.entries(props).map(([key, value]) => (
                <span key={key}>
                  {" "}
                  <span style={{ color: "var(--brand-cyan)" }}>{key}</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="text-foreground/80">
                    {typeof value === "string"
                      ? `"${value}"`
                      : `{${JSON.stringify(value)}}`}
                  </span>
                </span>
              ))
            : null}
          <span className="text-muted-foreground"> {"/>"}</span>
        </code>

        {note ? (
          <p className="mt-2 text-[11px] leading-snug text-muted-foreground">{note}</p>
        ) : null}

        {tech.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {tech.map((item) => (
              <span
                key={item}
                className="rounded border border-border px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-2 border-t border-border pt-1.5 font-mono text-[9px] text-muted-foreground">
          renders {"<"}
          {tag}
          {">"} · {formatJsx(name, props).length} chars of source
        </div>
      </div>
    </>
  );
}
