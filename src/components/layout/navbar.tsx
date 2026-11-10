"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Magnetic } from "@/components/ui/magnetic";
import { ANCHOR_OFFSET, useLenis } from "@/hooks/use-lenis";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { useUIStore } from "@/store/use-ui-store";
import { navItems } from "@/data/site";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { scrollTo } = useLenis();
  const setCommandOpen = useUIStore((s) => s.setCommandOpen);

  const ids = useMemo(() => navItems.map((item) => item.id), []);
  const activeId = useScrollSpy(ids);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setSheetOpen(false);
    scrollTo(href, { offset: ANCHOR_OFFSET });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        {/* Wordmark */}
        <Magnetic strength={0.2}>
          <Link
            href="/"
            onClick={(event) => {
              event.preventDefault();
              scrollTo(0);
            }}
            className={cn(
              // Once the page scrolls, content passes behind the fixed header —
              // without its own backdrop the wordmark becomes unreadable.
              "group flex items-center gap-2.5 rounded-full transition-all duration-500",
              scrolled && "glass py-1.5 pr-4 pl-1.5"
            )}
            aria-label={`${profile.fullName} — back to top`}
          >
            <span
              aria-hidden="true"
              className="grid size-9 place-items-center rounded-full font-mono text-xs font-medium text-background"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand), var(--brand-cyan))",
              }}
            >
              {profile.initials}
            </span>
            <span className="hidden font-heading text-sm font-semibold tracking-tight sm:block">
              {profile.fullName}
            </span>
          </Link>
        </Magnetic>

        {/* Desktop links */}
        <div
          className={cn(
            "hidden items-center gap-1 rounded-full p-1.5 transition-all duration-500 lg:flex",
            scrolled && "glass"
          )}
        >
          {navItems.map((item) => {
            const active = activeId === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  go(item.href);
                }}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-sm transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "var(--brand-soft)" }}
                  />
                ) : null}
                <span className="relative">{item.label}</span>
              </a>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => setCommandOpen(true)}
            className="glass hidden h-9 gap-2 rounded-full pr-1.5 pl-3 text-muted-foreground sm:flex"
            aria-label="Open command palette"
          >
            <Search className="size-3.5" />
            <span className="text-xs">Search</span>
            <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">
              ⌘K
            </kbd>
          </Button>

          <ThemeToggle />

          {/* Mobile menu */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                className="glass rounded-full lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-strong w-[min(20rem,85vw)]">
              <SheetHeader>
                <SheetTitle className="font-heading">Navigate</SheetTitle>
                <SheetDescription>Jump to any section of the site.</SheetDescription>
              </SheetHeader>

              <nav className="mt-4 flex flex-col gap-1 px-4" aria-label="Mobile">
                {navItems.map((item, index) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(event) => {
                      event.preventDefault();
                      go(item.href);
                    }}
                    className="flex items-baseline gap-3 rounded-lg px-3 py-3 text-lg transition-colors hover:bg-accent"
                  >
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
