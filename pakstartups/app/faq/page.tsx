import type { Metadata } from "next";
import FAQPageClient from "./FAQPageClient";

export const metadata: Metadata = {
  title: "FAQ | PakStartups",
  description:
    "Find answers to common questions about PakStartups, startup submissions, matchmaking, and platform support.",
  alternates: {
    canonical: "https://pakstartups.io/faq",
  },
  openGraph: {
    title: "FAQ | PakStartups",
    description:
      "Find answers to common questions about PakStartups, startup submissions, matchmaking, and platform support.",
    url: "https://pakstartups.io/faq",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | PakStartups",
    description:
      "Find answers to common questions about PakStartups, startup submissions, matchmaking, and platform support.",
  },
};

export default function FAQPage() {
  return <FAQPageClient />;
}
