import { NextResponse } from "next/server";
import { Resend } from "resend";

import { contactSchema, type ContactResponse } from "@/lib/validations";
import { profile } from "@/data/profile";

/**
 * POST /api/contact
 *
 * Node runtime (not edge) because the Resend SDK expects it. Re-validates with
 * the same schema the client used — client-side validation is a UX feature,
 * never a trust boundary.
 */
export const runtime = "nodejs";

/**
 * Very small in-memory rate limit: 5 submissions per IP per 10 minutes.
 *
 * This resets when the lambda recycles and isn't shared across instances —
 * it is a speed bump for casual abuse, not a security control. Swap for
 * Upstash Redis if this ever needs to hold under real traffic.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the map can't grow unbounded.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request): Promise<NextResponse<ContactResponse>> {
  // --- Parse ---------------------------------------------------------------
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Malformed request body." },
      { status: 400 }
    );
  }

  // --- Validate ------------------------------------------------------------
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return NextResponse.json(
      { ok: false, message: "Please check the form and try again.", fieldErrors },
      { status: 422 }
    );
  }

  const { name, email, message, company } = parsed.data;

  // --- Honeypot ------------------------------------------------------------
  // Return 200 rather than an error: telling a bot it was detected just
  // teaches whoever wrote it to stop filling the field in.
  if (company) {
    return NextResponse.json({ ok: true, message: "Thanks — I'll be in touch." });
  }

  // --- Rate limit ----------------------------------------------------------
  if (isRateLimited(clientIp(request))) {
    return NextResponse.json(
      { ok: false, message: "Too many messages. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  // --- Send ----------------------------------------------------------------
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? profile.email;
  // Resend requires a verified sender domain. onboarding@resend.dev works
  // immediately but can only deliver to the account owner's address.
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set — message not sent.");
    return NextResponse.json(
      {
        ok: false,
        message: "Email isn't configured yet. Please reach me directly by email.",
      },
      { status: 503 }
    );
  }

  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from,
      to,
      // replyTo, so hitting reply in the inbox answers the sender, not Resend.
      replyTo: email,
      subject: `Portfolio enquiry from ${name}`,
      text: [
        `Name:    ${name}`,
        `Email:   ${email}`,
        "",
        message,
      ].join("\n"),
      html: `
        <div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.6;color:#18181b">
          <h2 style="margin:0 0 16px;font-size:18px">New portfolio enquiry</h2>
          <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p style="margin:0 0 16px"><strong>Email:</strong> ${escapeHtml(email)}</p>
          <div style="padding:16px;background:#f4f4f5;border-radius:8px;white-space:pre-wrap">${escapeHtml(message)}</div>
        </div>
      `,
    });

    if (error) {
      console.error("[contact] Resend rejected the message:", error);
      return NextResponse.json(
        { ok: false, message: "The email service rejected that. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Thanks — I'll get back to you soon.",
    });
  } catch (error) {
    console.error("[contact] Unexpected failure:", error);
    return NextResponse.json(
      { ok: false, message: "Something went wrong on my end. Please try again." },
      { status: 500 }
    );
  }
}

/** Minimal escaping for the HTML email body — the values are user-supplied. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
