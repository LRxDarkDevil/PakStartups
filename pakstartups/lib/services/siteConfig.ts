import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { createCanonicalLocation, REGIONS } from "@/lib/location";

export type SiteFilters = {
  regions: string[];
  categories: string[];
};

export const DEFAULT_SITE_FILTERS: SiteFilters = {
  regions: REGIONS.map((region) => region.label),
  categories: [
    "FinTech",
    "AgriTech",
    "HealthTech",
    "EdTech",
    "E-Commerce",
    "SaaS",
    "Cleantech",
    "Logistics & Mobility",
    "Social Impact / Sustainability",
  ],
};

const FILTERS_DOC = doc(db, "siteConfig", "filters");

function regionsFromLegacyCities(cities: unknown): string[] {
  if (!Array.isArray(cities)) return [];

  return Array.from(
    new Set(
      cities
        .filter((city): city is string => typeof city === "string" && city.trim().length > 0)
        .map((city) => createCanonicalLocation({ city }).region)
    )
  );
}

export async function getSiteFilters(): Promise<SiteFilters> {
  const snap = await getDoc(FILTERS_DOC);
  if (!snap.exists()) return DEFAULT_SITE_FILTERS;

  const data = snap.data() as { regions?: unknown; cities?: unknown; categories?: unknown };
  const configuredRegions = Array.isArray(data.regions)
    ? data.regions.filter((region): region is string => typeof region === "string" && region.trim().length > 0)
    : [];
  const legacyRegions = regionsFromLegacyCities(data.cities);
  const categories = Array.isArray(data.categories)
    ? data.categories.filter((category): category is string => typeof category === "string" && category.trim().length > 0)
    : [];

  return {
    regions:
      configuredRegions.length > 0
        ? configuredRegions
        : legacyRegions.length > 0
          ? legacyRegions
          : DEFAULT_SITE_FILTERS.regions,
    categories: categories.length > 0 ? categories : DEFAULT_SITE_FILTERS.categories,
  };
}

export async function saveSiteFilters(filters: SiteFilters) {
  await setDoc(
    FILTERS_DOC,
    {
      regions: filters.regions,
      categories: filters.categories,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
