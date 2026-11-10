"use client";

import { ScanSearch } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useUIStore } from "@/store/use-ui-store";
import { cn } from "@/lib/utils";

export function InspectToggle() {
  const inspectMode = useUIStore((s) => s.inspectMode);
  const toggleInspect = useUIStore((s) => s.toggleInspect);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          onClick={toggleInspect}
          aria-pressed={inspectMode}
          aria-label="Toggle inspect mode"
          className={cn(
            "glass relative rounded-full transition-colors",
            inspectMode && "text-background"
          )}
          style={
            inspectMode
              ? { background: "var(--brand)", borderColor: "var(--brand)" }
              : undefined
          }
        >
          <ScanSearch className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="flex items-center gap-2">
        {inspectMode ? "Exit inspect mode" : "Inspect this site"}
        <kbd className="rounded border border-border px-1 font-mono text-[10px]">I</kbd>
      </TooltipContent>
    </Tooltip>
  );
}
