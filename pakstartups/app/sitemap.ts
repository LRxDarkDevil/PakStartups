import type { MetadataRoute } from "next";
import { getPublicEventsForSitemap } from "@/lib/services/events";
import { getSanityPostSlugs } from "@/sanity/lib/queries";

const site = "https://pakstartups.io";

function asDate(value: unknown, fallback: Date) {
  if (value && typeof value === "object" && "toDate" in value && typeof (value as { toDate?: unknown }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate();
  }
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return fallback;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const generatedAt = new Date();
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
    lastModified: generatedAt,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const [blogPosts, events] = await Promise.all([
    getSanityPostSlugs().catch(() => []),
    getPublicEventsForSitemap().catch(() => []),
  ]);

  const blogRoutes = blogPosts.map((post) => ({
    url: `${site}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const eventRoutes = events.flatMap((event) => event.id ? [{
    url: `${site}/events/${encodeURIComponent(event.id)}`,
    lastModified: asDate(event.updatedAt, asDate(event.createdAt, generatedAt)),
    changeFrequency: "daily" as const,
    priority: event.isFeatured ? 0.9 : 0.8,
  }] : []);

  return [...staticRoutes, ...blogRoutes, ...eventRoutes];
}
