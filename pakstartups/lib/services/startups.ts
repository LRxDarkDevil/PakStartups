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

export const STARTUP_RECORD_TYPES = [
  "verified",
  "community-submitted",
  "nominated",
  "testimonial-demo",
  "partner-sponsored",
] as const;

export type StartupRecordType = (typeof STARTUP_RECORD_TYPES)[number];

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
  /** Origin/trust classification. Missing values are treated as legacy records. */
  recordType?: StartupRecordType;
  /** Compatibility flag for fixtures created before recordType was introduced. */
  isDemo?: boolean;
  views: number;
  createdAt?: unknown;
};

const COL = "startups";

const PUBLIC_RECORD_TYPES = new Set<StartupRecordType>([
  "verified",
  "community-submitted",
  "nominated",
  "partner-sponsored",
]);

type StartupDocument = Omit<Startup, "id">;
type StartupSubmission = Omit<
  Startup,
  | "id"
  | "status"
  | "views"
  | "createdAt"
  | "country"
  | "countryCode"
  | "region"
  | "regionId"
  | "recordType"
  | "isDemo"
> & {
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

function isPublicDirectoryRecord(startup: Startup): boolean {
  if (startup.isDemo || startup.recordType === "testimonial-demo") return false;

  // Historical records predate origin metadata. Keep them visible until an
  // authorized production audit classifies them, rather than silently hiding
  // legitimate approved listings.
  return startup.recordType === undefined || PUBLIC_RECORD_TYPES.has(startup.recordType);
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
  const startups = snaps.docs
    .map((d) => hydrateStartup(d.id, d.data() as StartupDocument))
    .filter(isPublicDirectoryRecord);

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
    recordType: "community-submitted" satisfies StartupRecordType,
    isDemo: false,
    status: "pending",
    views: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function incrementStartupViews(id: string) {
  await updateDoc(doc(db, COL, id), { views: increment(1) });
}

export type StartupNomination = {
  id?: string;
  startupName: string;
  website: string;
  category: string;
  city: string;
  description: string;
  nominatorName: string;
  nominatorEmail: string;
  relationship: "Customer" | "Investor" | "Community Member" | "Employee" | "Other";
  evidenceUrl?: string;
  status: "pending_review" | "approved" | "rejected";
  createdAt?: unknown;
};

export async function nominateStartup(data: Omit<StartupNomination, "id" | "status" | "createdAt">) {
  return addDoc(collection(db, "startup_nominations"), {
    ...data,
    status: "pending_review",
    createdAt: serverTimestamp(),
  });
}
