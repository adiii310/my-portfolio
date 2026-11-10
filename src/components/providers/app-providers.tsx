"use client";

import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

import { SmoothScrollProvider } from "@/hooks/use-lenis";

export function AppProviders({ children }: { children: React.ReactNode }) {
  // Created in state, not at module scope: a module-level client would be
  // shared across requests on the server and leak one visitor's cache to the next.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
        storageKey="portfolio-theme"
      >
        <TooltipProvider delayDuration={200} skipDelayDuration={400}>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
