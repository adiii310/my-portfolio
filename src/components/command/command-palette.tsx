"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  ArrowRight,
  Copy,
  Download,
  FileText,
  Moon,
  ScanSearch,
  Sun,
} from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { SocialIcon } from "@/components/ui/social-icon";
import { useUIStore } from "@/store/use-ui-store";
import { useLenis } from "@/hooks/use-lenis";
import { navItems } from "@/data/site";
import { profile, socials } from "@/data/profile";
import { projects } from "@/data/projects";

/**
 * ⌘K / Ctrl+K palette.
 *
 * Open state lives in the Zustand UI store rather than locally, so the footer
 * button, the floating dock and the keyboard shortcut all drive the same
 * instance instead of each rendering their own dialog.
 */
export function CommandPalette() {
  const open = useUIStore((s) => s.commandOpen);
  const setOpen = useUIStore((s) => s.setCommandOpen);
  const toggleInspect = useUIStore((s) => s.toggleInspect);
  const { scrollTo } = useLenis();
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        useUIStore.getState().toggleCommand();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /** Close first, then act — otherwise the dialog's focus trap fights the scroll. */
  const run = (action: () => void) => {
    setOpen(false);
    requestAnimationFrame(action);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      toast.success("Email copied", { description: profile.email });
    } catch {
      toast.error("Couldn't copy", { description: profile.email });
    }
  };

  return (
    /*
      Composed from Dialog + Command directly rather than using the registry's
      <CommandDialog>, which renders DialogTitle/DialogDescription as siblings
      of DialogContent. Radix requires them *inside* the content — outside, the
      title has no content context to register against and the dialog throws on
      open, taking the page down with it.
    */
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="glass-strong top-1/4 translate-y-0 overflow-hidden p-0 sm:max-w-xl"
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <DialogDescription className="sr-only">
          Jump to a section, copy contact details, or change the theme.
        </DialogDescription>

        <Command className="bg-transparent">
          <CommandInput placeholder="Type a command or search…" />
      <CommandList className="max-h-[60vh]">
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigate">
          {navItems.map((item) => (
            <CommandItem
              key={item.id}
              value={`go to ${item.label}`}
              onSelect={() => run(() => scrollTo(item.href, { offset: -80 }))}
            >
              <ArrowRight />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Case studies">
          {projects.map((project) => (
            <CommandItem
              key={project.slug}
              value={`project ${project.name} ${project.subtitle}`}
              onSelect={() => run(() => router.push(`/projects/${project.slug}`))}
            >
              <FileText />
              <span>{project.name}</span>
              <span className="ml-auto truncate text-xs text-muted-foreground">
                {project.subtitle}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Contact">
          <CommandItem value="copy email address" onSelect={() => run(copyEmail)}>
            <Copy />
            <span>Copy email</span>
            <CommandShortcut>{profile.email}</CommandShortcut>
          </CommandItem>

          {socials.map((social) => (
            <CommandItem
              key={social.label}
              value={social.commandLabel}
              onSelect={() =>
                run(() => window.open(social.href, "_blank", "noopener,noreferrer"))
              }
            >
              <SocialIcon name={social.icon} className="size-4" />
              <span>{social.commandLabel}</span>
            </CommandItem>
          ))}

          <CommandItem
            value="download resume cv"
            onSelect={() =>
              run(() => {
                const link = document.createElement("a");
                link.href = profile.resumeUrl;
                link.download = profile.resumeFileName;
                link.click();
              })
            }
          >
            <Download />
            <span>Download résumé</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="This site">
          <CommandItem
            value="toggle inspect mode devtools"
            onSelect={() => run(toggleInspect)}
          >
            <ScanSearch />
            <span>Toggle inspect mode</span>
            <CommandShortcut>I</CommandShortcut>
          </CommandItem>

          <CommandItem
            value="toggle theme dark light"
            onSelect={() =>
              run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))
            }
          >
            {resolvedTheme === "dark" ? <Sun /> : <Moon />}
            <span>Switch to {resolvedTheme === "dark" ? "light" : "dark"} mode</span>
          </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
