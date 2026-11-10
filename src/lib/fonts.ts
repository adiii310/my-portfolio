import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

/**
 * Three families, loaded through next/font so they are self-hosted,
 * preloaded, and never cause a layout shift (size-adjust fallbacks are
 * generated automatically).
 *
 * - Space Grotesk : display / headings
 * - Inter         : body
 * - JetBrains Mono: code-flavored details, labels, the inspect overlay
 */

export const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

export const fontSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-code",
  weight: ["400", "500"],
});

export const fontVariables = `${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`;
