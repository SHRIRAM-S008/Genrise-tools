import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { kits, toolsByKit, type KitSlug } from "@/lib/tools";
import { categoryTileClass } from "@/lib/categoryStyles";
import { siteName, siteUrl } from "@/lib/toolSeo";

interface KitPageProps {
  slug: KitSlug;
}

export function KitPage({ slug }: KitPageProps) {
  const kit = kits.find((k) => k.slug === slug);
  if (!kit) throw new Error(`Unknown kit: ${slug}`);

  const kitTools = toolsByKit(slug);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-14">
      <Link
        href="/"
        className="mb-6 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        Back to all tools
      </Link>

      {/* Header */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div
            className={`inline-flex size-12 items-center justify-center rounded-lg ${kit.iconClass}`}
          >
            <kit.icon className="size-6" strokeWidth={2} />
          </div>
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {kit.title}
          </h1>
          <p className="mt-2 max-w-md text-base text-muted-foreground">
            {kit.description}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{kitTools.length}</span> tools
        </div>
      </div>

      {/* Tools grid */}
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {kitTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group flex flex-col gap-3 bg-card p-5 transition-colors hover:bg-accent/40"
          >
            <div
              className={`flex size-10 items-center justify-center rounded-lg ${categoryTileClass[tool.category]}`}
            >
              <tool.icon className="size-5" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-heading text-sm font-semibold leading-tight">
                {tool.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {tool.description}
              </p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-primary">
              Open
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}

export function kitMetadata(slug: KitSlug) {
  const kit = kits.find((k) => k.slug === slug);
  if (!kit) throw new Error(`Unknown kit: ${slug}`);
  const url = `${siteUrl}/${slug}`;
  return {
    title: `${kit.title} — Free ${kit.tagline} Tools`,
    description: kit.description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: `${kit.title} — Free ${kit.tagline} Tools`,
      description: kit.description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${kit.title} — Free ${siteName} Tools`,
      description: kit.description,
    },
  };
}
