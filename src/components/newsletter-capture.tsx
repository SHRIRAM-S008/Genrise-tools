"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export function NewsletterCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
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
      <section className="py-10">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Check className="size-5" />
          </div>
          <h3 className="font-heading text-lg font-bold">You&rsquo;re in.</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            We&rsquo;ll email when new tools launch. No spam, unsubscribe anytime.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="rounded-xl border border-border bg-card p-8 sm:p-10">
        <div className="flex flex-col items-center gap-5 text-center">
          <div>
            <h3 className="font-heading text-xl font-bold sm:text-2xl">
              New tools, in your inbox
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              We email when new tools drop. No spam, no sales pitches, just tools.
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
              className="h-11 flex-1 rounded-lg border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="h-11 shrink-0 rounded-lg bg-foreground px-6 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
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
