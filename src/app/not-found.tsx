import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center gap-6 px-4 text-center">
      <span className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
        404
      </span>

      <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
        <span className="text-gradient">Nothing here.</span>
      </h1>

      <p className="max-w-md leading-relaxed text-muted-foreground">
        That page doesn&apos;t exist — or it moved. The work, the writing and the
        contact form are all still on the home page.
      </p>

      <Button asChild className="mt-2 h-11 gap-2 rounded-full px-5 text-sm">
        <Link href="/">
          <ArrowLeft className="size-4" />
          Back home
        </Link>
      </Button>
    </section>
  );
}
