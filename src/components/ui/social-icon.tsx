import { Mail, Phone } from "lucide-react";

import type { SocialLink } from "@/data/profile";

/**
 * Brand marks are inline SVG because lucide-react removed its brand icon set
 * (no Github / Linkedin exports in current versions). Two paths is cheaper
 * than pulling in a second icon package for them.
 */

function GithubMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.86 3.15 8.98 7.52 10.43.55.1.75-.24.75-.53v-1.86c-3.06.67-3.71-1.47-3.71-1.47-.5-1.28-1.22-1.62-1.22-1.62-1-.68.08-.67.08-.67 1.1.08 1.69 1.14 1.69 1.14.98 1.69 2.58 1.2 3.21.92.1-.72.39-1.2.7-1.48-2.44-.28-5.01-1.22-5.01-5.45 0-1.2.43-2.19 1.14-2.96-.11-.28-.49-1.4.11-2.92 0 0 .93-.3 3.04 1.13a10.5 10.5 0 0 1 5.54 0c2.11-1.43 3.03-1.13 3.03-1.13.61 1.52.23 2.64.12 2.92.71.77 1.14 1.76 1.14 2.96 0 4.24-2.58 5.17-5.03 5.44.4.34.75 1.01.75 2.04v3.03c0 .29.2.64.76.53a11.03 11.03 0 0 0 7.51-10.43C23.02 5.24 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedinMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function SocialIcon({
  name,
  className,
}: {
  name: SocialLink["icon"];
  className?: string;
}) {
  switch (name) {
    case "github":
      return <GithubMark className={className} />;
    case "linkedin":
      return <LinkedinMark className={className} />;
    case "phone":
      return <Phone aria-hidden="true" className={className} />;
    case "mail":
    default:
      return <Mail aria-hidden="true" className={className} />;
  }
}
