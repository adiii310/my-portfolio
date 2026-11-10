import type { Metadata, Viewport } from "next";

import "./globals.css";

import { AppProviders } from "@/components/providers/app-providers";
import { Aurora } from "@/components/ui/aurora";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Preloader } from "@/components/layout/preloader";
import { FloatingDock } from "@/components/layout/floating-dock";
import { CommandPalette } from "@/components/command/command-palette";
import { InspectOverlay } from "@/components/inspect/inspect-overlay";
import { Toaster } from "@/components/ui/sonner";
import { fontVariables } from "@/lib/fonts";
import { personJsonLd } from "@/lib/json-ld";
import { site, siteUrl } from "@/data/site";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.name,
    template: `%s — ${profile.fullName}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: profile.fullName, url: siteUrl }],
  creator: profile.fullName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: siteUrl,
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a12" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning is required by next-themes: it writes the theme
    // class onto <html> before React hydrates, which React would otherwise flag.
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <body className="min-h-dvh antialiased">
        <script
          type="application/ld+json"
          // Structured data must be a raw JSON string; it is generated from
          // our own typed data, never from user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />

        <AppProviders>
          {/* Skip link — first focusable element on the page */}
          <a
            href="#main"
            className="sr-only rounded-full px-4 py-2 focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-10001 focus:bg-primary focus:text-primary-foreground"
          >
            Skip to content
          </a>

          <Preloader />
          <Aurora />
          <CustomCursor />

          <Navbar />

          <main id="main">{children}</main>

          <Footer />

          <FloatingDock />
          <CommandPalette />
          <InspectOverlay />

          <Toaster position="bottom-center" richColors closeButton />
        </AppProviders>
      </body>
    </html>
  );
}
