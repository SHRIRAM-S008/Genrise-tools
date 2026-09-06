import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { siteUrl } from "@/lib/toolSeo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/studentkit`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/careerkit`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...toolRoutes];
}
