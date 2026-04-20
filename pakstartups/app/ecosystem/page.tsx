import type { Metadata } from "next";
import EcosystemDirectoryClient from "./EcosystemDirectoryClient";

export const metadata: Metadata = {
  title: "Ecosystem Directory — PakStartups",
  description: "Find the organizations that will help you grow. Our curated database connects founders with Pakistan's top-tier support systems.",
};

const orgs = [
  { name: "The Nest i/o", type: "Incubator", city: "Karachi", desc: "Pakistan's premier technology incubator providing state-of-the-art infrastructure...", tags: ["EARLY STAGE", "TECH FOCUS"], icon: "rocket_launch" },
  { name: "Plan9", type: "Accelerator", city: "Lahore", desc: "The first and largest tech incubator in Pakistan, empowering tech-based...", tags: ["SEED FUNDING", "SCALE UP"], icon: "trending_up" },
  { name: "Kickstart", type: "Co-Working", city: "Islamabad", desc: "Dynamic workspace designed for entrepreneurs and remote teams lookin...", tags: ["COMMUNITY", "WORKSPACE"], icon: "groups" },
  { name: "Lakson VC", type: "Venture Capital", city: "Karachi", desc: "Investing in the next generation of disruptive technology startups in Pakistan.", tags: ["SERIES A", "FUNDING"], icon: "payments" },
  { name: "NIC Pakistan", type: "Government", city: "Islamabad", desc: "A collaborative effort to build a thriving startup ecosystem and drive innovation.", tags: ["POLICY", "PUBLIC-PRIVATE"], icon: "account_balance" },
  { name: "Dawood Foundation", type: "Innovation Hub", city: "Karachi", desc: "Fostering learning and innovation through curated spaces and social impact...", tags: ["SOCIAL IMPACT", "PHILANTHROPY"], icon: "volunteer_activism" },
];

const typeColors: Record<string,string> = {
  "Incubator": "bg-[#0f5238] text-white",
  "Accelerator": "bg-[#2d6a4f] text-white",
  "Co-Working": "bg-[#376a28] text-white",
  "Venture Capital": "bg-[#1e5111] text-white",
  "Government": "bg-[#2d6a4f] text-white",
  "Innovation Hub": "bg-[#0f5238] text-white",
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

      {/* Category tabs */}
      <div className="bg-[#d5fde2] border-b border-[#bfc9c1]/30">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-6 overflow-x-auto py-2 no-scrollbar">
            {[
              "ALL",
              "INCUBATORS",
              "ACCELERATORS",
              "CO-WORKING SPACES",
              "VENTURE CAPITAL",
              "INNOVATION HUBS",
            ].map((tab, i) => (
              <button
                key={tab}
                className={`py-3 text-xs font-black uppercase tracking-widest whitespace-nowrap ${i === 0 ? "text-[#0f5238] border-b-2 border-[#0f5238]" : "text-[#404943] hover:text-[#0f5238] transition-colors"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Region filter + count */}
      <div className="max-w-7xl mx-auto px-8 py-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-[#002112] uppercase tracking-wider">Region:</span>
          {[
            "All",
            "Karachi",
            "Lahore",
            "Islamabad",
            "Rawalpindi",
            "Peshawar",
          ].map((city, i) => (
            <button
              key={city}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${i === 0 ? "bg-[#0f5238] text-white" : "border border-[#bfc9c1] text-[#404943] hover:border-[#0f5238] hover:text-[#0f5238]"}`}
            >
              {city}
            </button>
          ))}
        </div>
        <span className="text-sm text-[#404943]">Showing <b>{orgs.length}</b> organizations</span>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-20">
        <EcosystemDirectoryClient orgs={orgs} typeColors={typeColors} />
      </div>
    </>
  );
}
