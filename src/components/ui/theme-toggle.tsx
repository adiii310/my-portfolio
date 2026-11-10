"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMounted } from "@/hooks/use-mounted";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  // Before mount the resolved theme is unknown, so render a stable placeholder
  // of identical size rather than guessing an icon and flipping it on hydration.
  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="glass rounded-full"
        >
          {mounted ? (
            isDark ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )
          ) : (
            <span className="size-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{isDark ? "Light mode" : "Dark mode"}</TooltipContent>
    </Tooltip>
  );
}
