"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getStartups, type Startup } from "@/lib/services/startups";
import { DEFAULT_SITE_FILTERS, getSiteFilters } from "@/lib/services/siteConfig";
import { formatLocation, REGIONS, type RegionId } from "@/lib/location";

const stageColors: Record<string, string> = {
  Idea: "bg-emerald-100 text-emerald-900 border border-emerald-300",
  MVP: "bg-[#d5fde2] text-[#0f5238] border border-[#0f5238]/30",
  Growth: "bg-emerald-900 text-white border border-emerald-700",
  Scaling: "bg-[#072a1d] text-emerald-300 border border-emerald-600",
};

const categoryLabels: Record<string, string> = {
  Cleantech: "Sustainability Related",
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#0f5238]/15 animate-pulse">
      <div className="h-40 bg-gray-100 rounded-2xl mb-4" />
      <div className="h-5 w-20 bg-gray-200 rounded-full mb-3" />
      <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-full bg-gray-100 rounded mb-1" />
      <div className="h-4 w-2/3 bg-gray-100 rounded mb-4" />
      <div className="h-4 w-1/3 bg-gray-200 rounded" />
    </div>
  );
}

const FILTERS = ["All Startups", "Recently Added", "Trending", "By Industry"];
const STAGES = ["All Stages", "Idea", "MVP", "Growth", "Scaling"];

type RegionFilter = "all" | RegionId;

function StartupsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState(
    searchParams.get("filter") ?? "All Startups",
  );
  const [activeStage, setActiveStage] = useState(
    searchParams.get("stage") ?? "All Stages",
  );
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") ?? "All",
  );
  const [activeRegion, setActiveRegion] = useState<RegionFilter>(() => {
    const region = searchParams.get("region");
    return REGIONS.some((item) => item.id === region)
      ? (region as RegionId)
      : "all";
  });
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") ?? "",
  );
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [configuredRegions, setConfiguredRegions] = useState<string[]>(
    DEFAULT_SITE_FILTERS.regions,
  );
  const [categories, setCategories] = useState<string[]>(
    DEFAULT_SITE_FILTERS.categories,
  );

  const updateUrlParams = (params: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(params).forEach(([key, value]) => {
      if (
        !value ||
        value === "All" ||
        value === "all" ||
        value === "All Startups" ||
        value === "All Stages"
      ) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });
    const query = current.toString();
    router.replace(query ? `/startups?${query}` : "/startups", {
      scroll: false,
    });
  };

  useEffect(() => {
    setSearchQuery(searchParams.get("search") ?? "");
    setActiveFilter(searchParams.get("filter") ?? "All Startups");
    setActiveStage(searchParams.get("stage") ?? "All Stages");
    setActiveCategory(searchParams.get("category") ?? "All");

    const region = searchParams.get("region");
    setActiveRegion(
      REGIONS.some((item) => item.id === region)
        ? (region as RegionId)
        : "all",
    );
  }, [searchParams]);

  useEffect(() => {
    getSiteFilters()
      .then((filters) => {
        setConfiguredRegions(filters.regions);
        setCategories(filters.categories);
      })
      .catch(() => {
        setConfiguredRegions(DEFAULT_SITE_FILTERS.regions);
        setCategories(DEFAULT_SITE_FILTERS.categories);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    getStartups()
      .then(setStartups)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const availableRegions = REGIONS.filter((region) =>
    configuredRegions.includes(region.label),
  );
  const displayed = startups
    .filter((startup) => {
      if (
        activeCategory !== "All" &&
        startup.category !== activeCategory
      ) {
        return false;
      }
      if (activeRegion !== "all" && startup.regionId !== activeRegion) {
        return false;
      }
      if (activeStage !== "All Stages" && startup.stage !== activeStage) {
        return false;
      }
      const query = searchQuery.trim().toLowerCase();
      if (
        query &&
        ![
          startup.name,
          startup.desc,
          startup.category,
          startup.city,
          startup.region,
          startup.stage,
          startup.ownerName,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (activeFilter === "Trending") {
        return (b.views || 0) - (a.views || 0);
      }
      if (activeFilter === "By Industry") {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });

  return (
    <div className="bg-[#f4faf6] min-h-screen">
      {/* Editorial Page Header */}
      <header className="bg-[#e4f9eb] py-16 px-6 lg:px-8 border-b border-[#0f5238]/15 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
          <div>
            <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-[#002112] mb-3">
              Startup Directory &amp; Dealflow
            </h1>
            <p className="text-[#304237] text-lg max-w-2xl font-medium">
              Discover Pakistan&apos;s verified startups, research founding teams, and access transparent ecosystem dealflow.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/startups/nominate"
              className="flex items-center gap-2 bg-white border-2 border-[#0f5238]/30 text-[#0f5238] hover:border-[#0f5238] hover:bg-[#d5fde2]/40 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-xs cursor-pointer"
            >
              <span>Nominate a Startup</span>
              <span className="material-symbols-outlined text-base">recommend</span>
            </Link>
            <Link
              href="/startups/submit"
              className="flex items-center gap-2 bg-[#0f5238] hover:bg-[#072a1d] text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>Submit Your Startup</span>
              <span className="material-symbols-outlined text-base">add_business</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Top Filters bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 border-b border-[#0f5238]/10 pb-6">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveFilter(tab);
                  updateUrlParams({ filter: tab });
                }}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === tab
                    ? "bg-[#0f5238] text-white shadow-md"
                    : "bg-white text-[#0f5238] hover:bg-[#d5fde2] border border-[#0f5238]/15"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="text-[#304237] font-semibold text-sm">
            Showing <span className="text-[#002112] font-black text-base">{displayed.length}</span> verified startups
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:w-1/4">
            <div className="sticky top-28 bg-white border border-[#0f5238]/15 rounded-3xl p-6 shadow-sm space-y-6">
              {/* Search Box */}
              <div>
                <label
                  htmlFor="startup-search"
                  className="block text-xs font-black uppercase tracking-wider text-[#0f5238] mb-2"
                >
                  Search Registry
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#0f5238]">
                    search
                  </span>
                  <input
                    id="startup-search"
                    type="text"
                    value={searchQuery}
                    onChange={(event) => {
                      const value = event.target.value;
                      setSearchQuery(value);
                      updateUrlParams({ search: value });
                    }}
                    placeholder="Startup name or industry..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f4faf6] border border-[#0f5238]/20 focus:border-[#0f5238] focus:ring-2 focus:ring-[#0f5238]/10 rounded-xl text-sm font-medium text-[#002112] outline-none"
                  />
                </div>
              </div>

              {/* Stage Filter */}
              <div>
                <span className="block text-xs font-black uppercase tracking-wider text-[#0f5238] mb-2">
                  Funding Stage
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {STAGES.map((stage) => (
                    <button
                      key={stage}
                      onClick={() => {
                        setActiveStage(stage);
                        updateUrlParams({ stage });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeStage === stage
                          ? "bg-[#0f5238] text-white"
                          : "bg-[#f4faf6] text-[#0f5238] hover:bg-[#d5fde2]"
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <span className="block text-xs font-black uppercase tracking-wider text-[#0f5238] mb-2">
                  Category &amp; Industry
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => {
                      setActiveCategory("All");
                      updateUrlParams({ category: "All" });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeCategory === "All"
                        ? "bg-[#0f5238] text-white"
                        : "bg-[#f4faf6] text-[#0f5238] hover:bg-[#d5fde2]"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setActiveCategory(category);
                        updateUrlParams({ category });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeCategory === category
                          ? "bg-[#0f5238] text-white"
                          : "bg-[#f4faf6] text-[#0f5238] hover:bg-[#d5fde2]"
                      }`}
                    >
                      {categoryLabels[category] ?? category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Region Filter */}
              <div>
                <label
                  htmlFor="startup-region"
                  className="block text-xs font-black uppercase tracking-wider text-[#0f5238] mb-2"
                >
                  Region / City Scope
                </label>
                <select
                  id="startup-region"
                  value={activeRegion}
                  onChange={(event) => {
                    const region = event.target.value as RegionFilter;
                    setActiveRegion(region);
                    updateUrlParams({ region });
                  }}
                  className="w-full py-2.5 px-3 bg-[#f4faf6] border border-[#0f5238]/20 focus:border-[#0f5238] rounded-xl outline-none text-xs font-bold text-[#002112]"
                >
                  <option value="all">All Pakistan Regions</option>
                  {availableRegions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* Startup Cards Grid */}
          <main className="w-full lg:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : displayed.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-[#0f5238]/15">
                <span className="material-symbols-outlined text-6xl text-[#0f5238]/40 mb-4">
                  search_off
                </span>
                <h3 className="text-2xl font-bold font-display text-[#002112]">
                  No matching startups found
                </h3>
                <p className="text-[#404943] text-sm mt-2">
                  Try adjusting your search criteria or category filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayed.map((startup) => (
                  <Link
                    key={startup.id || startup.slug}
                    href={`/startups/${startup.slug}`}
                    className="group block h-full"
                  >
                    <div className="bg-white rounded-3xl p-6 border border-[#0f5238]/15 hover:border-[#0f5238] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
                      <div>
                        {/* Header logo & stage pill */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-[#e8ffee] border border-[#0f5238]/20 flex items-center justify-center text-[#0f5238] font-bold text-xl overflow-hidden shrink-0">
                            {startup.logo && startup.logo.startsWith("/") ? (
                              <Image
                                src={startup.logo}
                                alt={startup.name}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              startup.name.slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <span
                            className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              stageColors[startup.stage] ?? "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {startup.stage}
                          </span>
                        </div>

                        {/* Startup Title */}
                        <h3 className="text-xl font-bold text-[#002112] group-hover:text-[#0f5238] transition-colors mb-1 font-display">
                          {startup.name}
                        </h3>

                        {/* Location & Category */}
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#606d64] mb-3">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-[#0f5238]">location_on</span>
                            {formatLocation(startup)}
                          </span>
                          <span>•</span>
                          <span>{categoryLabels[startup.category] ?? startup.category}</span>
                        </div>

                        {/* Description */}
                        <p className="text-[#404943] text-sm leading-relaxed line-clamp-3 mb-6 font-normal">
                          {startup.desc}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                        <span className="text-xs font-semibold text-[#606d64]">
                          Founder: {startup.ownerName}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0f5238] group-hover:translate-x-0.5 transition-transform">
                          <span>View Profile</span>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function StartupsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-8 py-24 text-center text-[#404943]">
          <span className="inline-block w-8 h-8 border-4 border-[#0f5238]/20 border-t-[#0f5238] rounded-full animate-spin" />
        </div>
      }
    >
      <StartupsContent />
    </Suspense>
  );
}
