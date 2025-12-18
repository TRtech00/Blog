import { getAllPostSlugs } from "@/lib/content";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPostSlugs().map((slug) => ({
    url: `https://example.com/blog/${slug}`,
    lastModified: new Date()
  }));

  return [
    { url: "https://example.com/blog", lastModified: new Date() },
    ...posts
  ];
}
