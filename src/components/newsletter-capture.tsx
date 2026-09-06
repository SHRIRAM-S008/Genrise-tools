"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

export function NewsletterCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    // No backend yet — store locally so we can wire up later
    try {
      const existing = JSON.parse(localStorage.getItem("newsletter-signups") || "[]");
      existing.push({ email, date: new Date().toISOString() });
      localStorage.setItem("newsletter-signups", JSON.stringify(existing));
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <section className="py-8">
        <div className="flex flex-col items-center gap-3 rounded-[28px] border border-primary/20 bg-primary/5 p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check className="size-6" />
          </div>
          <h3 className="font-heading text-lg font-bold">You&rsquo;re in!</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            We&rsquo;ll let you know when new tools launch. No spam, unsubscribe
            anytime.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="relative overflow-hidden rounded-[28px] border border-border bg-card p-8 sm:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative flex flex-col items-center gap-5 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="size-6" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold sm:text-2xl">
              Get notified when we launch new tools
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Join the list — we email when new tools drop. No spam, no sales
              pitches, just tools.
            </p>
          </div>
          <form
            onSubmit={submit}
            className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-12 flex-1 rounded-xl border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="h-12 shrink-0 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {status === "loading" ? "Joining…" : "Notify me"}
            </button>
          </form>
          {status === "error" && (
            <p className="text-sm text-rose-500">
              Something went wrong. Please try again.
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Free forever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
