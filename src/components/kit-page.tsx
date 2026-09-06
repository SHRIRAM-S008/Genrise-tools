import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-14">
      <Link
        href="/"
        className="mb-6 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-3.5" />
        All tools
      </Link>
      <div
        className={`flex size-14 items-center justify-center rounded-2xl ${kit.iconClass}`}
      >
        <kit.icon className="size-7" strokeWidth={2} />
      </div>
      <h1 className="mt-4 text-2xl font-semibold font-heading">{kit.title}</h1>
      <p className="mt-2 text-muted-foreground">{kit.description}</p>

      <div className="mt-8 flex flex-col gap-3">
        {kitTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group flex items-center gap-3 rounded-xl border border-border px-4 py-3 transition-colors hover:border-primary/40 hover:bg-accent"
          >
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${categoryTileClass[tool.category]}`}
            >
              <tool.icon className="size-4" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{tool.title}</p>
              <p className="truncate text-sm text-muted-foreground">
                {tool.description}
              </p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
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
