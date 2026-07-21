// lib/services/match.ts
import {
  collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp,
  doc, setDoc, deleteDoc, getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  createCanonicalLocation,
  isRegionId,
  type CanonicalLocation,
  type RegionId,
} from "@/lib/location";

export type MatchProfile = {
  id?: string;
  uid: string;
  name: string;
  city: string;
  country?: CanonicalLocation["country"];
  countryCode?: CanonicalLocation["countryCode"];
  regionId?: RegionId;
  region?: string;
  role: "Founder" | "Tech Lead" | "Student" | "Freelancer" | "Mentor";
  looking: string;
  skills: string[];
  openToConnect: boolean;
  createdAt?: unknown;
};

export type ConnectionRequest = {
  id?: string;
  fromUid: string;
  fromName: string;
  toUid: string;
  toName: string;
  status: "pending" | "accepted" | "declined";
  createdAt?: unknown;
};

const PROFILES_COL = "matchProfiles";
const CONNECTIONS_COL = "connections";

type MatchProfileInput = Omit<
  MatchProfile,
  "id" | "createdAt" | "country" | "countryCode" | "region"
> & { regionId?: RegionId };

function hydrateMatchProfile(id: string, data: Omit<MatchProfile, "id">): MatchProfile {
  const canonical = createCanonicalLocation({
    regionId: isRegionId(data.regionId) ? data.regionId : undefined,
    city: data.city,
  });

  return { id, ...data, ...canonical, city: data.city };
}

export async function getMatchProfiles(role?: string, regionId?: RegionId): Promise<MatchProfile[]> {
  const q = query(
    collection(db, PROFILES_COL),
    where("openToConnect", "==", true),
    orderBy("createdAt", "desc"),
    limit(100),
  );
  const snaps = await getDocs(q);
  let results = snaps.docs.map((d) => hydrateMatchProfile(d.id, d.data() as Omit<MatchProfile, "id">));
  if (role) results = results.filter((p) => p.role === role);
  if (regionId) results = results.filter((p) => p.regionId === regionId);
  return results.slice(0, 30);
}

export async function getMatchProfilesByIds(ids: string[]): Promise<MatchProfile[]> {
  if (ids.length === 0) return [];
  const snaps = await getDocs(query(collection(db, PROFILES_COL), where("uid", "in", ids.slice(0, 10))));
  return snaps.docs.map((d) => hydrateMatchProfile(d.id, d.data() as Omit<MatchProfile, "id">));
}

export async function getMyConnections(uid: string): Promise<ConnectionRequest[]> {
  const q = query(
    collection(db, CONNECTIONS_COL),
    where("fromUid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as ConnectionRequest);
}

export async function getReceivedRequests(uid: string): Promise<ConnectionRequest[]> {
  const q = query(
    collection(db, CONNECTIONS_COL),
    where("toUid", "==", uid),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as ConnectionRequest);
}

export async function checkConnectionExists(fromUid: string, toUid: string): Promise<boolean> {
  const q = query(
    collection(db, CONNECTIONS_COL),
    where("fromUid", "==", fromUid),
    where("toUid", "==", toUid),
    limit(1)
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function sendConnectionRequest(from: { uid: string; name: string }, to: { uid: string; name: string }) {
  const exists = await checkConnectionExists(from.uid, to.uid);
  if (exists) return null;
  return addDoc(collection(db, CONNECTIONS_COL), {
    fromUid: from.uid,
    fromName: from.name,
    toUid: to.uid,
    toName: to.name,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function updateConnectionStatus(connId: string, status: "accepted" | "declined") {
  await import("firebase/firestore").then(({ updateDoc }) =>
    updateDoc(doc(db, CONNECTIONS_COL, connId), { status, updatedAt: serverTimestamp() })
  );
}

export async function upsertMatchProfile(uid: string, data: MatchProfileInput) {
  const ref = doc(db, PROFILES_COL, uid);
  const existing = await getDoc(ref);
  const canonical = createCanonicalLocation({ regionId: data.regionId, city: data.city });
  const payload = { ...data, ...canonical, city: data.city };

  if (existing.exists()) {
    const { updateDoc } = await import("firebase/firestore");
    await updateDoc(ref, { ...payload, updatedAt: serverTimestamp() });
  } else {
    await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
  }
}