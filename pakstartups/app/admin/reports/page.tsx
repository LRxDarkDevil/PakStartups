"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getCountFromServer, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { createCanonicalLocation, isRegionId } from "@/lib/location";

type MonthPoint = { month: string; startups: number; members: number };
type CategoryPoint = { label: string; count: number; pct: number };
type RegionPoint = { region: string; count: number; pct: number };

type Metric = { label: string; value: string; growth: string; icon: string };

function toDate(value: unknown): Date | null {
  if (!value || typeof value !== "object") return null;
  const maybeTimestamp = value as { toDate?: () => Date };
  if (typeof maybeTimestamp.toDate === "function") return maybeTimestamp.toDate();
  return null;
}

function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}

function pctDelta(prev: number, curr: number): string {
  if (prev <= 0 && curr > 0) return "+100%";
  if (prev <= 0) return "0%";
  const pct = Math.round(((curr - prev) / prev) * 100);
  return `${pct >= 0 ? "+" : ""}${pct}%`;
}

function monthLabel(date: Date): string {
  return date.toLocaleString("en-US", { month: "short" });
}

export default function ReportsManagementPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthPoint[]>([]);
  const [topCategories, setTopCategories] = useState<CategoryPoint[]>([]);
  const [regionDistribution, setRegionDistribution] = useState<RegionPoint[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const now = new Date();
        const firstMonthDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const months: Date[] = Array.from(
          { length: 6 },
          (_, index) => new Date(firstMonthDate.getFullYear(), firstMonthDate.getMonth() + index, 1)
        );
        const monthIndex = new Map(months.map((date, index) => [`${date.getFullYear()}-${date.getMonth()}`, index]));

        const [
          startupsCountSnap,
          usersCountSnap,
          matchesCountSnap,
          b2bCountSnap,
          startupsSnap,
          usersSnap,
        ] = await Promise.all([
          getCountFromServer(collection(db, "startups")),
          getCountFromServer(collection(db, "users")),
          getCountFromServer(collection(db, "matchProfiles")),
          getCountFromServer(collection(db, "b2bDemands")),
          getDocs(query(collection(db, "startups"), limit(3000))),
          getDocs(query(collection(db, "users"), limit(5000))),
        ]);

        const monthly: MonthPoint[] = months.map((date) => ({
          month: monthLabel(date),
          startups: 0,
          members: 0,
        }));
        const categoryCounts = new Map<string, number>();
        const regionCounts = new Map<string, number>();

        startupsSnap.docs.forEach((docSnap) => {
          const data = docSnap.data() as {
            createdAt?: unknown;
            category?: string;
            city?: string;
            regionId?: unknown;
          };
          const created = toDate(data.createdAt);
          if (created) {
            const index = monthIndex.get(`${created.getFullYear()}-${created.getMonth()}`);
            if (index !== undefined) monthly[index].startups += 1;
          }

          const category = (data.category || "Other").trim();
          categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);

          const location = createCanonicalLocation({
            regionId: isRegionId(data.regionId) ? data.regionId : undefined,
            city: data.city,
          });
          regionCounts.set(location.region, (regionCounts.get(location.region) ?? 0) + 1);
        });

        usersSnap.docs.forEach((docSnap) => {
          const data = docSnap.data() as { createdAt?: unknown };
          const created = toDate(data.createdAt);
          if (!created) return;
          const index = monthIndex.get(`${created.getFullYear()}-${created.getMonth()}`);
          if (index !== undefined) monthly[index].members += 1;
        });

        const totalCategories = Math.max(1, Array.from(categoryCounts.values()).reduce((a, b) => a + b, 0));
        const totalRegions = Math.max(1, Array.from(regionCounts.values()).reduce((a, b) => a + b, 0));

        const topCats = Array.from(categoryCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([label, count]) => ({ label, count, pct: Math.round((count / totalCategories) * 100) }));

        const topRegions = Array.from(regionCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([region, count]) => ({ region, count, pct: Math.round((count / totalRegions) * 100) }));

        const prevMonth = monthly[Math.max(0, monthly.length - 2)] ?? { startups: 0, members: 0 };
        const currMonth = monthly[Math.max(0, monthly.length - 1)] ?? { startups: 0, members: 0 };

        const metricData: Metric[] = [
          {
            label: "Total Startups Registered",
            value: formatCompact(startupsCountSnap.data().count),
            growth: pctDelta(prevMonth.startups, currMonth.startups),
            icon: "rocket_launch",
          },
          {
            label: "Active Co-Founder Matches",
            value: formatCompact(matchesCountSnap.data().count),
            growth: "LIVE",
            icon: "handshake",
          },
          {
            label: "B2B Demands Posted",
            value: formatCompact(b2bCountSnap.data().count),
            growth: "LIVE",
            icon: "storefront",
          },
          {
            label: "Community Members",
            value: formatCompact(usersCountSnap.data().count),
            growth: pctDelta(prevMonth.members, currMonth.members),
            icon: "group",
          },
        ];

        setMetrics(metricData);
        setMonthlyData(monthly);
        setTopCategories(topCats);
        setRegionDistribution(topRegions);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const maxStartups = useMemo(() => Math.max(1, ...monthlyData.map((data) => data.startups)), [monthlyData]);
  const maxMembers = useMemo(() => Math.max(1, ...monthlyData.map((data) => data.members)), [monthlyData]);

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold text-[#002112] tracking-tight">Platform Analytics</h2>
        <p className="text-[#404943] font-medium">Live ecosystem metrics from Firestore.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? [...Array(4)].map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-[#bfc9c1]/20 shadow-sm animate-pulse h-28" />
            ))
          : metrics.map((metric) => (
              <div key={metric.label} className="bg-white p-6 rounded-xl border border-[#bfc9c1]/20 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#404943]">{metric.label}</span>
                  <div className="w-8 h-8 bg-[#d5fde2] rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#0f5238] text-base">{metric.icon}</span>
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-black text-[#0f5238]">{metric.value}</span>
                  <span className="text-sm font-bold text-[#2d6a4f] bg-[#cff7dd] px-2 py-0.5 rounded-full mb-1">{metric.growth}</span>
                </div>
              </div>
            ))}
      </div>

      <div className="bg-white rounded-xl border border-[#bfc9c1]/20 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#002112]">Monthly Growth</h3>
            <p className="text-sm text-[#707973]">Startups registered and new community members</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-[#0f5238]" />
              <span className="text-[#404943]">Startups</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-[#b7f2a0]" />
              <span className="text-[#404943]">Members</span>
            </div>
          </div>
        </div>

        <div className="flex items-end gap-4 h-48 pt-4">
          {monthlyData.map((data) => (
            <div key={data.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end gap-1 h-40">
                <div className="flex-1 bg-[#0f5238] rounded-t-md transition-all hover:bg-[#2d6a4f]" style={{ height: `${(data.startups / maxStartups) * 100}%` }} title={`Startups: ${data.startups}`} />
                <div className="flex-1 bg-[#b7f2a0] rounded-t-md transition-all hover:bg-[#a3e88c]" style={{ height: `${(data.members / maxMembers) * 100}%` }} title={`Members: ${data.members}`} />
              </div>
              <span className="text-xs font-bold text-[#707973]">{data.month}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-3 pt-3 border-t border-[#e0e0e0]">
          {monthlyData.map((data) => (
            <div key={data.month} className="flex-1 text-center">
              <p className="text-xs font-bold text-[#0f5238]">+{data.startups}</p>
              <p className="text-[10px] text-[#707973]">+{data.members}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#bfc9c1]/20 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#002112] mb-5">Top Startup Categories</h3>
          <div className="space-y-3">
            {topCategories.map((category) => (
              <div key={category.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-[#002112]">{category.label}</span>
                  <span className="text-sm font-bold text-[#0f5238]">{category.count}</span>
                </div>
                <div className="w-full bg-[#f5faf6] rounded-full h-2">
                  <div className="bg-[#0f5238] h-2 rounded-full transition-all" style={{ width: `${category.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#bfc9c1]/20 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#002112] mb-5">Region Distribution</h3>
          <div className="space-y-3">
            {regionDistribution.map((item) => (
              <div key={item.region}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-[#002112]">{item.region}</span>
                  <span className="text-sm text-[#404943]">{item.count} <span className="text-[#707973]">({item.pct}%)</span></span>
                </div>
                <div className="w-full bg-[#f5faf6] rounded-full h-2">
                  <div className="bg-[#2d6a4f] h-2 rounded-full transition-all" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
