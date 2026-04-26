import type { MetadataRoute } from "next";
import { getSanityPostSlugs } from "@/sanity/lib/queries";

const site = "https://pakstartups.io";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/blog",
    "/startups",
    "/knowledge",
    "/knowledge/guides",
    "/knowledge/toolkit",
    "/knowledge/reports",
    "/knowledge/directory",
    "/ecosystem",
    "/events",
    "/b2b",
    "/ideas",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${site}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const blogPosts = await getSanityPostSlugs();
  const blogRoutes = blogPosts.map((post) => ({
    url: `${site}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes];
}
