import type { MetadataRoute } from "next";
import { getAllPages } from "@/lib/content";
import siteConfig from "../../site.config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return getAllPages().map((p) => ({
    url: siteConfig.url + (p.slug === "/" ? "/" : p.slug),
    lastModified: new Date(),
    changeFrequency: p.slug === "/" ? "weekly" : "monthly",
    priority: p.slug === "/" ? 1 : p.type === "service" || p.type === "neighborhood" ? 0.8 : 0.6,
  }));
}
