"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { contactSchema, type ContactInput, type ContactResponse } from "@/lib/validations";

/**
 * Contact form.
 *
 * Validation runs against the same schema the route handler uses, so a payload
 * that passes here cannot fail server-side validation for a different reason.
 * The submit itself is a TanStack Query mutation purely for the lifecycle —
 * isPending, onError, onSuccess — rather than hand-rolled loading booleans.
 */
export function ContactForm() {
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", company: "" },
    mode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: async (values: ContactInput): Promise<ContactResponse> => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as ContactResponse;

      // A non-2xx with a parsed body still carries the useful message, so
      // throw with it rather than with the bare status code.
      if (!response.ok || !data.ok) {
        throw new Error(data.ok === false ? data.message : "Something went wrong.");
      }
      return data;
    },
    onSuccess: (data) => {
      toast.success("Message sent", {
        description: data.ok ? data.message : undefined,
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast.error("Couldn't send that", { description: error.message });
    },
  });

  const { errors } = form.formState;

  return (
    <form
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      noValidate
      className="flex flex-col gap-5"
    >
      {/*
        Honeypot. Hidden from sight and from the a11y tree, and removed from
        the tab order — a human cannot reach it, so anything that fills it in
        is a bot and gets rejected server-side.
      */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company" aria-hidden="true">
          Company (leave this empty)
        </label>
        <input
          id="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          // aria-hidden on the wrapper alone still leaves this exposed to some
          // AT tree walkers, so the field opts out explicitly too.
          aria-hidden="true"
          {...form.register("company")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...form.register("name")}
          />
          {errors.name ? (
            <FieldError id="name-error">{errors.name.message}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...form.register("email")}
          />
          {errors.email ? (
            <FieldError id="email-error">{errors.email.message}</FieldError>
          ) : null}
        </Field>
      </div>

      <Field data-invalid={!!errors.message}>
        <FieldLabel htmlFor="message">Message</FieldLabel>
        <Textarea
          id="message"
          rows={5}
          placeholder="What are you building, and where could I help?"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="resize-y"
          {...form.register("message")}
        />
        {errors.message ? (
          <FieldError id="message-error">{errors.message.message}</FieldError>
        ) : null}
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={mutation.isPending}
        className="h-12 gap-2 rounded-full text-sm"
        style={{
          background: "linear-gradient(120deg, var(--brand), var(--brand-cyan))",
          color: "var(--primary-foreground)",
        }}
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="size-4" />
            Send message
          </>
        )}
      </Button>

      {/* Status for assistive tech; the toast is visual-only. */}
      <p aria-live="polite" className="sr-only">
        {mutation.isPending
          ? "Sending your message."
          : mutation.isSuccess
            ? "Message sent."
            : mutation.isError
              ? `Failed to send: ${mutation.error.message}`
              : ""}
      </p>
    </form>
  );
}
