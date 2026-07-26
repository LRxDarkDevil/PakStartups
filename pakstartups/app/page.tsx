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
      <aside
        aria-label="Illustrative homepage content disclosure"
        className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-950"
      >
        The PayEasy, Zainab Raza, TaxFast PK, growth, match-score, and offer cards shown below are illustrative product mockups. They are not verified startup listings, real profiles, measured performance claims, approved partners, or live commercial offers.
      </aside>
      <HomePageClient />
    </main>
  );
}
