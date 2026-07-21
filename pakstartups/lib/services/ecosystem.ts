import {
  collection, addDoc, getDocs, updateDoc, deleteDoc,
  query, where, orderBy, doc, serverTimestamp, limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  createCanonicalLocation,
  isRegionId,
  type CanonicalLocation,
  type RegionId,
} from "@/lib/location";

export type EcosystemOrg = {
  id?: string;
  name: string;
  type: "Incubator" | "Accelerator" | "Co-Working" | "Venture Capital" | "Government" | "Innovation Hub";
  city: string;
  country?: CanonicalLocation["country"];
  countryCode?: CanonicalLocation["countryCode"];
  regionId?: RegionId;
  region?: string;
  desc: string;
  tags: string[];
  icon: string;
  website?: string;
  email?: string;
  featured: boolean;
  approved: boolean;
  submittedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const COL = "ecosystemOrgs";

type EcosystemOrgInput = Omit<
  EcosystemOrg,
  "id" | "createdAt" | "updatedAt" | "country" | "countryCode" | "region"
> & { regionId?: RegionId };

function hydrateEcosystemOrg(id: string, data: Omit<EcosystemOrg, "id">): EcosystemOrg {
  const canonical = createCanonicalLocation({
    regionId: isRegionId(data.regionId) ? data.regionId : undefined,
    city: data.city,
  });

  return { id, ...data, ...canonical, city: data.city };
}

export async function getEcosystemOrgs(): Promise<EcosystemOrg[]> {
  const q = query(
    collection(db, COL),
    where("approved", "==", true),
    limit(100)
  );
  const snaps = await getDocs(q);
  return snaps.docs
    .map((d) => hydrateEcosystemOrg(d.id, d.data() as Omit<EcosystemOrg, "id">))
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
}

export async function getAllEcosystemOrgs(): Promise<EcosystemOrg[]> {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"), limit(100));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => hydrateEcosystemOrg(d.id, d.data() as Omit<EcosystemOrg, "id">));
}

export async function addEcosystemOrg(data: EcosystemOrgInput, submittedBy?: string) {
  const canonical = createCanonicalLocation({ regionId: data.regionId, city: data.city });
  return addDoc(collection(db, COL), {
    ...data,
    ...canonical,
    city: data.city,
    submittedBy: submittedBy ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateEcosystemOrg(id: string, data: Partial<EcosystemOrgInput>) {
  const canonical = data.city !== undefined || data.regionId !== undefined
    ? createCanonicalLocation({ regionId: data.regionId, city: data.city })
    : null;
  await updateDoc(doc(db, COL, id), {
    ...data,
    ...(canonical ?? {}),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteEcosystemOrg(id: string) {
  await deleteDoc(doc(db, COL, id));
}

export async function approveEcosystemOrg(id: string, approved: boolean) {
  await updateDoc(doc(db, COL, id), { approved, updatedAt: serverTimestamp() });
}

export async function featureEcosystemOrg(id: string, featured: boolean) {
  await updateDoc(doc(db, COL, id), { featured, updatedAt: serverTimestamp() });
}