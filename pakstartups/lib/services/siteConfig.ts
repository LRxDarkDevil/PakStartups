import { collection, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export type SiteFilters = {
  cities: string[];
  categories: string[];
};

export const DEFAULT_SITE_FILTERS: SiteFilters = {
  cities: [
    "Karachi",
    "Lahore",
    "Islamabad",
    "Faisalabad",
    "Sialkot",
    "Peshawar",
    "Rawalpindi",
    "Multan",
    "Hyderabad",
    "Gwadar",
  ],
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

export async function getSiteFilters(): Promise<SiteFilters> {
  const snap = await getDoc(FILTERS_DOC);
  if (!snap.exists()) return DEFAULT_SITE_FILTERS;

  const data = snap.data() as Partial<SiteFilters>;
  return {
    cities: Array.isArray(data.cities) && data.cities.length > 0 ? data.cities : DEFAULT_SITE_FILTERS.cities,
    categories: Array.isArray(data.categories) && data.categories.length > 0 ? data.categories : DEFAULT_SITE_FILTERS.categories,
  };
}

export async function saveSiteFilters(filters: SiteFilters) {
  await setDoc(
    FILTERS_DOC,
    {
      cities: filters.cities,
      categories: filters.categories,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}