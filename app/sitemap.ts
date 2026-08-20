import type { MetadataRoute } from "next";
import { SERIES } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://isset-togo.vercel.app";
  const pages = ["", "/a-propos", "/filieres", "/actualites", "/galerie", "/admission", "/contact"];
  const series = SERIES.map((s) => `/filieres/${s.filiereSlug}/${s.slug}`);
  return [...pages, ...series].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
