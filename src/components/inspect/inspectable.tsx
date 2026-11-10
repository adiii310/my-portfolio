import { cn } from "@/lib/utils";

export type InspectProps = Record<string, string | number | boolean | string[]>;

type InspectableProps = {
  /** Component name shown in the overlay, e.g. "ProjectCard" */
  name: string;
  /** Rendered as JSX attributes in the overlay label */
  props?: InspectProps;
  /** Tech badges listed under the label */
  tech?: string[];
  /** One-line explanation of what this piece does */
  note?: string;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

/**
 * Marks a subtree as inspectable.
 *
 * Deliberately *not* a client component — it only writes data attributes, so
 * it costs zero JavaScript. A single client overlay (inspect-overlay.tsx)
 * reads these attributes via event delegation and does all the rendering,
 * instead of every wrapped section shipping its own listener.
 */
export function Inspectable({
  name,
  props,
  tech,
  note,
  children,
  className,
  as: Tag = "div",
}: InspectableProps) {
  return (
    <Tag
      data-inspect-name={name}
      data-inspect-props={props ? JSON.stringify(props) : undefined}
      data-inspect-tech={tech?.join("|")}
      data-inspect-note={note}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}

/**
 * Formats a component + props pair the way it would appear in source,
 * e.g. `<ProjectCard stack={["Next.js"]} featured />`.
 */
export function formatJsx(name: string, props?: InspectProps): string {
  if (!props || Object.keys(props).length === 0) return `<${name} />`;

  const attrs = Object.entries(props).map(([key, value]) => {
    if (typeof value === "boolean") return value ? key : `${key}={false}`;
    if (typeof value === "number") return `${key}={${value}}`;
    if (Array.isArray(value)) return `${key}={${JSON.stringify(value)}}`;
    return `${key}="${value}"`;
  });

  return `<${name} ${attrs.join(" ")} />`;
}
