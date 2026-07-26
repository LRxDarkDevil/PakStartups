"use client";

import EditorialHero from "@/components/home/EditorialHero";
import ProofStatsBar from "@/components/home/ProofStatsBar";
import FeaturedStartupsGrid from "@/components/home/FeaturedStartupsGrid";
import EcosystemPillarsSection from "@/components/home/EcosystemPillarsSection";
import CoFounderHighlightSection from "@/components/home/CoFounderHighlightSection";
import FounderStoriesSection from "@/components/home/FounderStoriesSection";
import CommunityHubSection from "@/components/home/CommunityHubSection";

export default function HomePageClient() {
  return (
    <div className="bg-[#f4faf6] text-[#002112] min-h-screen selection:bg-[#b1f0ce] selection:text-[#002114] overflow-hidden">
      {/* 1. Editorial Hero Section */}
      <EditorialHero />

      {/* 2. Institutional Proof & Metrics Ticker Bar */}
      <ProofStatsBar />

      {/* 3. Featured Verified Startups Grid */}
      <FeaturedStartupsGrid />

      {/* 4. Core Ecosystem Pillars (Directory, Matchmaking, Knowledge Vault) */}
      <EcosystemPillarsSection />

      {/* 5. Active Co-Founder Matchmaking Spotlight */}
      <CoFounderHighlightSection />

      {/* 6. Founder Stories & Impact Section */}
      <div className="relative z-10 bg-[#e8ffee]/60">
        <FounderStoriesSection />
      </div>

      {/* 7. Community Hub Section (14k+ Reddit & Vetted Founder Group) */}
      <CommunityHubSection />
    </div>
  );
}
