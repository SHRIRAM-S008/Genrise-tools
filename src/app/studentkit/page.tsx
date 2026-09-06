import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "StudentKit — Free Tools for College & Scholarship Applications",
  description:
    "Everything a student needs to prepare a college, scholarship, or exam application: photo resizing, signature tools, PDF merging, GPA calculator, and more — free and browser-based.",
  alternates: { canonical: "/studentkit" },
  openGraph: {
    title: "StudentKit — Free Tools for College & Scholarship Applications",
    description:
      "Everything a student needs to prepare a college, scholarship, or exam application — free and browser-based.",
    url: "/studentkit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudentKit — Free Student Application Tools",
    description:
      "Photo resizing, signature tools, PDF merging, GPA calculator, and more — free and browser-based.",
  },
};

const links = [
  { slug: "passport-photo", label: "Resize application photo" },
  { slug: "signature-optimizer", label: "Resize signature" },
  { slug: "compress-pdf", label: "Compress a document" },
  { slug: "merge-pdf", label: "Merge certificates" },
  { slug: "pdf-organizer", label: "Reorder/rotate PDF pages" },
  { slug: "application-pack", label: "Build application pack" },
  { slug: "gpa-calculator", label: "GPA calculator" },
  { slug: "text-tools", label: "Text & word-count tools" },
];

export default function StudentKitPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-14">
      <Link href="/" className="mb-6 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-3.5" />
        All tools
      </Link>
      <div className="flex size-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-600 dark:text-violet-400">
        <GraduationCap className="size-7" strokeWidth={2} />
      </div>
      <h1 className="mt-4 text-2xl font-semibold font-heading">StudentKit</h1>
      <p className="mt-2 text-muted-foreground">Everything a student needs to prepare a college, scholarship, or exam application.</p>

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
