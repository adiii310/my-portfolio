import { z } from "zod";

/**
 * One schema, imported by both the client form and the route handler, so the
 * browser and the server can never disagree about what counts as valid.
 */

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter at least 2 characters.")
    .max(80, "That's longer than 80 characters."),

  email: z.email("Please enter a valid email address."),

  message: z
    .string()
    .trim()
    .min(10, "Tell me a little more — at least 10 characters.")
    .max(2000, "Please keep it under 2000 characters."),

  /**
   * Honeypot. Hidden from real users and from screen readers, so anything
   * that fills it in is almost certainly a bot. Must stay empty.
   */
  company: z
    .string()
    .max(0, "Rejected.")
    .optional()
    .or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Shape returned by POST /api/contact, consumed by the form's mutation. */
export type ContactResponse =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };
