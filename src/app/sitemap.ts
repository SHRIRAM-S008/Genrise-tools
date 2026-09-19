import type { MetadataRoute } from "next";
import { kits, tools } from "@/lib/tools";
import { siteUrl } from "@/lib/toolSeo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  const kitRoutes: MetadataRoute.Sitemap = kits.map((kit) => ({
    url: `${siteUrl}/${kit.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...kitRoutes, ...toolRoutes];
}
