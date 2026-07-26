"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getStartups, type Startup } from "@/lib/services/startups";
import { DEFAULT_SITE_FILTERS, getSiteFilters } from "@/lib/services/siteConfig";
import { formatLocation, REGIONS, type RegionId } from "@/lib/location";

const stageColors: Record<string, string> = {
  Idea: "bg-[#b7f2a0] text-[#032100]",
  MVP: "bg-[#b7f2a0] text-[#032100]",
  Growth: "bg-[#b7f2a0] text-[#032100]",
  Scaling: "bg-[#b7f2a0] text-[#032100]",
};

const categoryLabels: Record<string, string> = {
  Cleantech: "Sustainability Related",
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e8f5ee] animate-pulse">
      <div className="h-48 bg-[#e0e0e0]" />
      <div className="p-6">
        <div className="h-5 w-20 bg-[#e0e0e0] rounded mb-3" />
        <div className="h-6 w-3/4 bg-[#e0e0e0] rounded mb-2" />
        <div className="h-4 w-full bg-[#e0e0e0] rounded mb-1" />
        <div className="h-4 w-2/3 bg-[#e0e0e0] rounded" />
      </div>
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
    <>
      <header className="bg-white py-16 px-8 border-b border-[#cff7dd]">
        <div className="max-w-8xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#002112] mb-4">
              Startup Directory
            </h1>
            <p className="text-[#404943] text-xl max-w-2xl">
              Discover Pakistan&apos;s most innovative startups and connect with
              the next generation of founders.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/startups/nominate"
              className="flex items-center gap-2 border-2 border-[#0f5238] text-[#0f5238] hover:bg-[#d5fde2] px-6 py-4 rounded-lg font-bold transition-all active:scale-95"
            >
              Nominate a Startup
              <span className="material-symbols-outlined">recommend</span>
            </Link>
            <Link
              href="/startups/submit"
              className="flex items-center gap-2 bg-[#0f5238] text-white px-8 py-4 rounded-lg font-bold shadow-[0_8px_24px_rgba(15,82,56,0.12)] hover:shadow-[0_12px_32px_rgba(15,82,56,0.2)] transition-all active:scale-95"
            >
              Submit Your Startup
              <span className="material-symbols-outlined">add</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-8xl mx-auto px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveFilter(tab);
                  updateUrlParams({ filter: tab });
                }}
                className={
                  activeFilter === tab
                    ? "px-6 py-2.5 rounded-full bg-[#0f5238] text-white font-bold transition-colors cursor-pointer"
                    : "px-6 py-2.5 rounded-full bg-[#cff7dd] text-[#002112] hover:bg-[#caf2d7] transition-colors font-semibold cursor-pointer"
                }
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="text-[#404943] font-medium">
            Showing{" "}
            <span className="text-[#002112] font-bold">
              {displayed.length}
            </span>{" "}
            startups
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <div className="sticky top-28 bg-[#d5fde2] rounded-xl p-8 shadow-sm">
              <div className="mb-8">
                <label
                  htmlFor="startup-search"
                  className="block text-sm font-bold uppercase tracking-wider text-[#404943] mb-3"
                >
                  Search
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#404943]">
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
                    placeholder="Startup name..."
                    className="w-full pl-10 pr-4 py-3 bg-white border-none rounded-lg focus:ring-2 focus:ring-[#0f5238]/40 text-[#002112] placeholder:text-[#707973] outline-none"
                  />
                </div>
                <div className="mt-4">
                  <h2 className="block text-xs font-bold uppercase tracking-wider text-[#404943] mb-2">
                    Stage
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {STAGES.map((stage) => (
                      <button
                        key={stage}
                        onClick={() => {
                          setActiveStage(stage);
                          updateUrlParams({ stage });
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${activeStage === stage ? "bg-[#0f5238] text-white" : "bg-white text-[#0f5238] hover:bg-[#d5fde2]"}`}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="font-bold text-[#002112] mb-4">Category</h2>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setActiveCategory("All");
                        updateUrlParams({ category: "All" });
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${activeCategory === "All" ? "bg-[#0f5238] text-white" : "bg-white text-[#0f5238] hover:bg-[#d5fde2]"}`}
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
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${activeCategory === category ? "bg-[#0f5238] text-white" : "bg-white text-[#0f5238] hover:bg-[#d5fde2]"}`}
                      >
                        {categoryLabels[category] ?? category}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="startup-region"
                    className="block font-bold text-[#002112] mb-4"
                  >
                    Region
                  </label>
                  <select
                    id="startup-region"
                    value={activeRegion}
                    onChange={(event) => {
                      const region = event.target.value as RegionFilter;
                      setActiveRegion(region);
                      updateUrlParams({ region });
                    }}
                    className="w-full py-3 px-3 bg-white border-none rounded-lg focus:ring-2 focus:ring-[#0f5238]/40 outline-none text-[#002112]"
                  >
                    <option value="all">All Regions</option>
                    {availableRegions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </aside>

          <div className="w-full lg:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : displayed.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-xl border border-[#e0e0e0]">
                <span className="material-symbols-outlined text-6xl text-[#bfc9c1] mb-4">
                  search_off
                </span>
                <h3 className="text-2xl font-bold text-[#002112]">
                  No startups found
                </h3>
                <p className="text-[#404943] mt-2">
                  Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayed.map((startup) => (
                  <Link
                    key={startup.id}
                    href={`/startups/${startup.slug}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e8f5ee] hover:shadow-xl hover:border-[#0f5238]/20 transition-all h-full">
                      <div className="h-48 bg-[#d5fde2] flex items-center justify-center relative overflow-hidden">
                        <Image
                          src={startup.logo}
                          alt={startup.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${stageColors[startup.stage] ?? "bg-gray-100"}`}
                          >
                            {startup.stage}
                          </span>
                          <span className="text-xs text-[#707973] text-right">
                            {formatLocation(startup)}
                          </span>
                        </div>
                        <h3 className="text-xl font-extrabold text-[#002112] mb-2 group-hover:text-[#0f5238] transition-colors">
                          {startup.name}
                        </h3>
                        <p className="text-[#404943] text-sm line-clamp-2 mb-4">
                          {startup.desc}
                        </p>
                        <span className="text-xs font-bold text-[#0f5238] bg-[#d5fde2] px-2.5 py-1 rounded-full">
                          {categoryLabels[startup.category] ?? startup.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function StartupsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-8xl mx-auto px-8 py-16 text-center text-[#404943]">
          <span className="inline-block w-8 h-8 border-4 border-[#0f5238]/20 border-t-[#0f5238] rounded-full animate-spin" />
        </div>
      }
    >
      <StartupsContent />
    </Suspense>
  );
}
