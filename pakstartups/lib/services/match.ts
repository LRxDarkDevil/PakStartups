// lib/services/match.ts
import {
  collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp,
  doc, setDoc, deleteDoc, getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export type MatchProfile = {
  id?: string;
  uid: string;
  name: string;
  city: string;
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

export async function getMatchProfiles(role?: string, city?: string): Promise<MatchProfile[]> {
  const q = query(
    collection(db, PROFILES_COL),
    where("openToConnect", "==", true),
    orderBy("createdAt", "desc"),
    limit(100),
  );
  const snaps = await getDocs(q);
  let results = snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as MatchProfile);
  if (role) results = results.filter((p) => p.role === role);
  if (city && city !== "All Cities") results = results.filter((p) => p.city === city);
  return results.slice(0, 30);
}

export async function getMatchProfilesByIds(ids: string[]): Promise<MatchProfile[]> {
  if (ids.length === 0) return [];
  const snaps = await getDocs(query(collection(db, PROFILES_COL), where("uid", "in", ids.slice(0, 10))));
  return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as MatchProfile);
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

export async function sendConnectionRequest(from: { uid: string; name: string }, to: { uid: string; name: string }) {
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

export async function upsertMatchProfile(uid: string, data: Omit<MatchProfile, "id" | "createdAt">) {
  const ref = doc(db, PROFILES_COL, uid);
  const existing = await getDoc(ref);
  if (existing.exists()) {
    const { updateDoc } = await import("firebase/firestore");
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  } else {
    await setDoc(ref, { ...data, createdAt: serverTimestamp() });
  }
}
