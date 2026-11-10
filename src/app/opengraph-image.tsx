import { ImageResponse } from "next/og";

import { profile } from "@/data/profile";

export const alt = `${profile.fullName} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated at build time by Satori.
 *
 * Satori supports only a subset of CSS — no backdrop-filter, no oklch, no CSS
 * variables — so this deliberately restates the brand colours as hex and fakes
 * the glass with flat translucent fills.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0a0a12",
          backgroundImage:
            "radial-gradient(circle at 18% 18%, rgba(168,85,247,0.38), transparent 46%), radial-gradient(circle at 82% 68%, rgba(34,211,238,0.26), transparent 48%)",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        {/* Status chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            alignSelf: "flex-start",
            padding: "10px 20px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.05)",
            fontSize: 20,
            color: "#c7c7d1",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "#22d3ee",
            }}
          />
          {profile.status}
        </div>

        {/* Name + role */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 108,
              fontWeight: 700,
              letterSpacing: -4,
              lineHeight: 1,
            }}
          >
            {profile.fullName}
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#a1a1aa" }}>
            {profile.title} — {profile.tagline}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            color: "#8b8b96",
          }}
        >
          <div style={{ display: "flex" }}>{profile.locationShort}</div>
          <div style={{ display: "flex" }}>{profile.email}</div>
        </div>
      </div>
    ),
    size
  );
}
