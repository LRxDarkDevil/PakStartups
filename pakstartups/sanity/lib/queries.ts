import { client } from "./client";
import type { TypedObject } from "@portabletext/types";

export type SanityBlogPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  body?: TypedObject[];
  mainImage?: string;
  authorName: string;
  authorAvatar?: string;
  category: "Founder Journey" | "Case Study" | "Lessons Learned";
  readTime: string;
  isFeatured: boolean;
  publishedAt: string;
  status: "draft" | "published";
};

const POST_FIELDS = `
  _id,
  title,
  slug,
  excerpt,
  category,
  authorName,
  "authorAvatar": authorAvatar.asset->url,
  readTime,
  isFeatured,
  publishedAt,
  status,
  "mainImage": mainImage.asset->url
`;

export async function getSanityPosts(category?: string): Promise<SanityBlogPost[]> {
  let filter = `_type == "blogPost" && status == "published"`;
  if (category && category !== "All Posts") {
    const catMap: Record<string, string> = {
      "Founder Journeys": "Founder Journey",
      "Case Studies": "Case Study",
      "Lessons Learned": "Lessons Learned",
    };
    const mapped = catMap[category] ?? category;
    filter += ` && category == "${mapped}"`;
  }
  return client.fetch<SanityBlogPost[]>(
    `*[${filter}] | order(publishedAt desc) [0..19] { ${POST_FIELDS} }`
  );
}

export async function getSanityFeaturedPost(): Promise<SanityBlogPost | null> {
  const result = await client.fetch<SanityBlogPost | null>(
    `*[_type == "blogPost" && status == "published" && isFeatured == true] | order(publishedAt desc) [0] { ${POST_FIELDS} }`
  );
  return result;
}

export async function getSanityPostById(id: string): Promise<SanityBlogPost | null> {
  const result = await client.fetch<SanityBlogPost | null>(
    `*[_type == "blogPost" && status == "published" && _id == $id] [0] { ${POST_FIELDS}, body }`,
    { id }
  );
  return result;
}

export async function getSanityPostBySlug(slug: string): Promise<SanityBlogPost | null> {
  const result = await client.fetch<SanityBlogPost | null>(
    `*[_type == "blogPost" && status == "published" && slug.current == $slug] [0] { ${POST_FIELDS}, body }`,
    { slug }
  );
  return result;
}

export async function getSanityPostSlugs(): Promise<Array<{ slug: string; updatedAt: string }>> {
  return client.fetch<Array<{ slug: string; updatedAt: string }>>(
    `*[_type == "blogPost" && status == "published" && defined(slug.current)] | order(publishedAt desc) {
      "slug": slug.current,
      "updatedAt": coalesce(_updatedAt, publishedAt)
    }`
  );
}
