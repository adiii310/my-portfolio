"use client";

import { Command } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InspectToggle } from "@/components/inspect/inspect-toggle";
import { useUIStore } from "@/store/use-ui-store";

/**
 * Persistent bottom-right controls. Kept out of the navbar so they stay
 * reachable without scrolling back to the top.
 */
export function FloatingDock() {
  const setCommandOpen = useUIStore((s) => s.setCommandOpen);

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2 sm:right-6 sm:bottom-6">
      <InspectToggle />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={() => setCommandOpen(true)}
            aria-label="Open command palette"
            className="glass rounded-full"
          >
            <Command className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="flex items-center gap-2">
          Command palette
          <kbd className="rounded border border-border px-1 font-mono text-[10px]">
            ⌘K
          </kbd>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
