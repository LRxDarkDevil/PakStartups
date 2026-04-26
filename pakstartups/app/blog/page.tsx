import type { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Blog & Founder Stories",
  description: "Founder journeys, case studies, and practical lessons from Pakistan's startup ecosystem.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "PakStartups Blog",
    description: "Real stories and startup playbooks from Pakistani founders.",
    url: "/blog",
    type: "website",
    images: [{ url: "/images/image-038.jpg", width: 1200, height: 630, alt: "PakStartups Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PakStartups Blog",
    description: "Real stories and startup playbooks from Pakistani founders.",
    images: ["/images/image-038.jpg"],
  },
};

export default function BlogPage() {
  const listSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "PakStartups Blog",
    description: "Founder journeys, case studies, and practical lessons from Pakistan's startup ecosystem.",
    url: "https://pakstartups.io/blog",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />
      <BlogPageClient />
    </>
  );
}
