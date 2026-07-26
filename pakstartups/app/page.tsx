import type { Metadata } from "next";
import HomePageClient from "@/components/home/HomePageClient";

export const metadata: Metadata = {
  title: "PakStartups — Pakistan's Primary Startup Directory & Ecosystem",
  description:
    "Explore Pakistan's #1 startup directory. Discover verified Pakistani startups, search local tech companies, and connect with founders.",
};

export default function HomePage() {
  return (
    <main>
      <HomePageClient />
    </main>
  );
}
