import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "CareerKit — Free Resume & Job Application Tools",
  description:
    "Build your resume, optimize your photo, merge certificates, and pack your job application — free, browser-based tools with no sign-up required.",
  alternates: { canonical: "/careerkit" },
  openGraph: {
    title: "CareerKit — Free Resume & Job Application Tools",
    description:
      "Build your resume, optimize your photo, merge certificates, and pack your job application — free and browser-based.",
    url: "/careerkit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerKit — Free Job Application Tools",
    description:
      "Resume builder, photo optimizer, certificate merger, and application pack builder — free and browser-based.",
  },
};

const links = [
  { slug: "resume-builder", label: "Build resume" },
  { slug: "passport-photo", label: "Optimize photo" },
  { slug: "signature-optimizer", label: "Resize signature" },
  { slug: "merge-pdf", label: "Merge certificates" },
  { slug: "compress-pdf", label: "Compress documents" },
  { slug: "application-pack", label: "Build application pack" },
  { slug: "invoice-generator", label: "Invoice generator (freelancers)" },
];

export default function CareerKitPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-14">
      <Link href="/" className="mb-6 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-3.5" />
        All tools
      </Link>
      <div className="flex size-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-600 dark:text-orange-400">
        <Briefcase className="size-7" strokeWidth={2} />
      </div>
      <h1 className="mt-4 text-2xl font-semibold font-heading">CareerKit</h1>
      <p className="mt-2 text-muted-foreground">Build your resume, prepare documents, and pack your job application — all in one place.</p>

      <div className="mt-8 flex flex-col gap-3">
        {links.map((l) => (
          <Link
            key={l.slug}
            href={`/tools/${l.slug}`}
            className="group flex items-center justify-between rounded-xl border border-border px-4 py-3 transition-colors hover:border-primary/40 hover:bg-accent"
          >
            {l.label}
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </main>
  );
}
