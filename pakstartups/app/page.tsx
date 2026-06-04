import type { Metadata } from "next";
import HomePageClient from "@/components/home/HomePageClient";

export const metadata: Metadata = {
  title: "PakStartups — Where Pakistan's Founders Build Together",
  description:
    "Discover startups, find co-founders, access the B2B marketplace, and join Pakistan's most active startup community.",
};

export default function HomePage() {
  return <HomePageClient />;
}
