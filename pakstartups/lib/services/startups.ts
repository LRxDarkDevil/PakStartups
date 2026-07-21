// lib/services/startups.ts
import {
  collection, doc, getDocs, addDoc, updateDoc,
  query, where, orderBy, limit, serverTimestamp, increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  createCanonicalLocation,
  type CanonicalLocation,
  type RegionId,
} from "@/lib/location";

export type Startup = {
  id?: string;
  name: string;
  desc: string;
  stage: "Idea" | "MVP" | "Growth" | "Scaling";
  /** Preserved for existing detail pages and future city-level discovery. */
  city: string;
  /** Canonical region fields. Optional while historical records are migrated. */
  country?: CanonicalLocation["country"];
  countryCode?: CanonicalLocation["countryCode"];
  regionId?: RegionId;
  region?: string;
  category: string;
  slug: string;
  logo: string;
  website?: string;
  ownerId: string;
  ownerName: string;
  status: "pending" | "approved" | "rejected";
  views: number;
  createdAt?: unknown;
};

const COL = "startups";

type StartupDocument = Omit<Startup, "id">;
type StartupSubmission = Omit<Startup, "id" | "status" | "views" | "createdAt" | keyof CanonicalLocation> & {
  regionId?: RegionId;
};

function hydrateStartup(id: string, data: StartupDocument): Startup {
  const canonical = createCanonicalLocation({
    regionId: data.regionId,
    city: data.city,
  });

  return {
    id,
    ...data,
    country: data.country ?? canonical.country,
    countryCode: data.countryCode ?? canonical.countryCode,
    regionId: data.regionId ?? canonical.regionId,
    region: data.region ?? canonical.region,
  };
}

export async function getStartups(cat?: string, regionId?: RegionId): Promise<Startup[]> {
  let q = query(
    collection(db, COL),
    where("status", "==", "approved"),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  if (cat && cat !== "All") {
    q = query(
      collection(db, COL),
      where("status", "==", "approved"),
      where("category", "==", cat),
      orderBy("createdAt", "desc"),
      limit(50)
    );
  }
  const snaps = await getDocs(q);
  const startups = snaps.docs.map((d) => hydrateStartup(d.id, d.data() as StartupDocument));

  // Filter after hydration until the migration is complete so legacy city-only
  // records remain discoverable without requiring a temporary composite index.
  return regionId ? startups.filter((startup) => startup.regionId === regionId) : startups;
}

export async function getStartupBySlug(slug: string): Promise<Startup | null> {
  const q = query(collection(db, COL), where("slug", "==", slug), limit(1));
  const snaps = await getDocs(q);
  if (snaps.empty) return null;
  const d = snaps.docs[0];
  return hydrateStartup(d.id, d.data() as StartupDocument);
}

export async function submitStartup(data: StartupSubmission) {
  const location = createCanonicalLocation({
    regionId: data.regionId,
    city: data.city,
  });

  return addDoc(collection(db, COL), {
    ...data,
    ...location,
    status: "pending",
    views: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function incrementStartupViews(id: string) {
  await updateDoc(doc(db, COL, id), { views: increment(1) });
}
