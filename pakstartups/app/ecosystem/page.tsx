import type { Metadata } from "next";
import EcosystemDirectoryClient from "./EcosystemDirectoryClient";

export const metadata: Metadata = {
  title: "Ecosystem Directory — PakStartups",
  description: "Find the organizations that will help you grow. Our curated database connects founders with Pakistan's top-tier support systems.",
};

export default function EcosystemPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-[#d5fde2] py-20 px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-black text-[#002112] tracking-tight mb-4">Ecosystem Directory</h1>
        <p className="text-[#404943] text-lg max-w-2xl mx-auto">
          Find the organizations that will help you grow. Our curated database connects founders with Pakistan&apos;s top-tier support systems.
        </p>
      </section>

      <EcosystemDirectoryClient />
    </>
  );
}
