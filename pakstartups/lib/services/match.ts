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
  looking?: string;
  photoURL?: string;
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
  note?: string;
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

export async function getMatchProfiles(role?: string, locationFilter?: string): Promise<MatchProfile[]> {
  const q = query(
    collection(db, PROFILES_COL),
    where("openToConnect", "==", true),
    orderBy("createdAt", "desc"),
    limit(100),
  );
  const snaps = await getDocs(q);
  let results = snaps.docs.map((d) => hydrateMatchProfile(d.id, d.data() as Omit<MatchProfile, "id">));
  if (role) results = results.filter((p) => p.role === role);
  if (locationFilter && locationFilter !== "All Cities") {
    results = isRegionId(locationFilter)
      ? results.filter((p) => p.regionId === locationFilter)
      : results.filter((p) => p.city === locationFilter);
  }
  return results.slice(0, 30);
}

export async function getMatchProfilesByIds(ids: string[]): Promise<MatchProfile[]> {
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
  if (uniqueIds.length === 0) return [];
  
  const results: MatchProfile[] = [];
  const chunkSize = 10;

  for (let i = 0; i < uniqueIds.length; i += chunkSize) {
    const chunk = uniqueIds.slice(i, i + chunkSize);
    const snaps = await getDocs(query(collection(db, PROFILES_COL), where("uid", "in", chunk)));
    const foundUids = new Set<string>();

    snaps.docs.forEach((d) => {
      const data = d.data() as Omit<MatchProfile, "id">;
      foundUids.add(data.uid);
      results.push(hydrateMatchProfile(d.id, data));
    });

    const missingUids = chunk.filter((id) => !foundUids.has(id));
    for (const uid of missingUids) {
      try {
        const uSnap = await getDoc(doc(db, "users", uid));
        if (uSnap.exists()) {
          const uData = uSnap.data();
          results.push(
            hydrateMatchProfile(uSnap.id, {
              uid: uSnap.id,
              name: uData.fullName || uData.displayName || "Member",
              city: uData.city || "Pakistan",
              role: (uData.role as MatchProfile["role"]) || "Founder",
              looking: uData.looking || "",
              photoURL: uData.photoURL || undefined,
              skills: uData.skills || [],
              openToConnect: true,
            })
          );
        }
      } catch (err) {
        console.warn(`Failed to fetch fallback user profile for ${uid}`, err);
      }
    }
  }

  return results;
}

export async function getAcceptedConnections(uid: string): Promise<ConnectionRequest[]> {
  const qFrom = query(
    collection(db, CONNECTIONS_COL),
    where("fromUid", "==", uid),
    where("status", "==", "accepted")
  );
  const qTo = query(
    collection(db, CONNECTIONS_COL),
    where("toUid", "==", uid),
    where("status", "==", "accepted")
  );
  const [snapFrom, snapTo] = await Promise.all([getDocs(qFrom), getDocs(qTo)]);
  const list = [
    ...snapFrom.docs.map((d) => ({ id: d.id, ...d.data() }) as ConnectionRequest),
    ...snapTo.docs.map((d) => ({ id: d.id, ...d.data() }) as ConnectionRequest),
  ];
  const map = new Map<string, ConnectionRequest>();
  list.forEach((item) => { if (item.id) map.set(item.id, item); });
  return Array.from(map.values());
}

export async function getMyConnections(uid: string): Promise<ConnectionRequest[]> {
  const qFrom = query(
    collection(db, CONNECTIONS_COL),
    where("fromUid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const qToAccepted = query(
    collection(db, CONNECTIONS_COL),
    where("toUid", "==", uid),
    where("status", "==", "accepted"),
    orderBy("createdAt", "desc")
  );
  const [snapFrom, snapTo] = await Promise.all([getDocs(qFrom), getDocs(qToAccepted)]);
  const list = [
    ...snapFrom.docs.map((d) => ({ id: d.id, ...d.data() }) as ConnectionRequest),
    ...snapTo.docs.map((d) => ({ id: d.id, ...d.data() }) as ConnectionRequest),
  ];
  const map = new Map<string, ConnectionRequest>();
  list.forEach((item) => { if (item.id) map.set(item.id, item); });
  return Array.from(map.values());
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

export async function getConnectionRequest(fromUid: string, toUid: string): Promise<ConnectionRequest | null> {
  const q = query(
    collection(db, CONNECTIONS_COL),
    where("fromUid", "==", fromUid),
    where("toUid", "==", toUid),
    limit(1)
  );
  const snap = await getDocs(q);
  if (!snap.empty) {
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as ConnectionRequest;
  }
  const qRev = query(
    collection(db, CONNECTIONS_COL),
    where("fromUid", "==", toUid),
    where("toUid", "==", fromUid),
    limit(1)
  );
  const snapRev = await getDocs(qRev);
  if (!snapRev.empty) {
    return { id: snapRev.docs[0].id, ...snapRev.docs[0].data() } as ConnectionRequest;
  }
  return null;
}

export async function sendConnectionRequest(
  from: { uid: string; name: string },
  to: { uid: string; name: string },
  note?: string
) {
  if (from.uid === to.uid) return null;
  const exists = await checkConnectionExists(from.uid, to.uid);
  if (exists) return null;

  const payload: Record<string, unknown> = {
    fromUid: from.uid,
    fromName: from.name,
    toUid: to.uid,
    toName: to.name,
    status: "pending",
    createdAt: serverTimestamp(),
  };

  if (note && note.trim()) {
    payload.note = note.trim();
  }

  const connDoc = await addDoc(collection(db, CONNECTIONS_COL), payload);

  // Automatically create notification for the recipient
  try {
    const noteText = note && note.trim() ? `: "${note.trim()}"` : ".";
    await addDoc(collection(db, "notifications"), {
      fromUid: from.uid,
      toUid: to.uid,
      type: "connection",
      text: `${from.name} sent you a connection request${noteText}`,
      link: "/match?tab=Received+Requests",
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Failed to create connection notification", err);
  }

  return connDoc;
}

export async function updateConnectionStatus(
  connId: string,
  status: "accepted" | "declined",
  actor?: { uid: string; name: string }
) {
  const { updateDoc } = await import("firebase/firestore");
  const connRef = doc(db, CONNECTIONS_COL, connId);
  const connSnap = await getDoc(connRef);

  await updateDoc(connRef, { status, updatedAt: serverTimestamp() });

  if (connSnap.exists() && actor) {
    const connData = connSnap.data() as ConnectionRequest;
    const recipientUid = connData.fromUid === actor.uid ? connData.toUid : connData.fromUid;
    try {
      await addDoc(collection(db, "notifications"), {
        fromUid: actor.uid,
        toUid: recipientUid,
        type: "connection",
        text: `${actor.name} ${status} your connection request.`,
        link: "/match",
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Failed to create status update notification", err);
    }
  }
}

export async function cancelConnectionRequest(connId: string) {
  return deleteDoc(doc(db, CONNECTIONS_COL, connId));
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

export type CoFounderRequestStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "shortlisted"
  | "introduced"
  | "closed"
  | "rejected";

export type CoFounderRequest = {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  ventureName: string;
  ventureStage: "Idea" | "MVP" | "Growth" | "Scaling";
  desiredRole: "CTO / Technical Co-Founder" | "CEO / Business Co-Founder" | "CPO / Product Co-Founder" | "CMO / Growth Co-Founder";
  requiredSkills: string[];
  commitment: "Full-Time" | "Part-Time" | "Flexible";
  equityRange: string;
  regionPreference: string;
  contactConsent: boolean;
  status: CoFounderRequestStatus;
  adminNotes?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const REQUESTS_COL = "cofounder_requests";

export async function submitCoFounderRequest(data: Omit<CoFounderRequest, "id" | "status" | "createdAt" | "updatedAt">) {
  return addDoc(collection(db, REQUESTS_COL), {
    ...data,
    status: "submitted",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserCoFounderRequests(userId: string): Promise<CoFounderRequest[]> {
  try {
    const q = query(
      collection(db, REQUESTS_COL),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as CoFounderRequest);
  } catch (err) {
    console.warn("Failed to fetch user cofounder requests", err);
    return [];
  }
}

export async function getAllCoFounderRequests(): Promise<CoFounderRequest[]> {
  try {
    const q = query(collection(db, REQUESTS_COL), orderBy("createdAt", "desc"), limit(100));
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as CoFounderRequest);
  } catch (err) {
    console.warn("Failed to fetch all cofounder requests", err);
    return [];
  }
}

export async function updateCoFounderRequestStatus(requestId: string, status: CoFounderRequestStatus, adminNotes?: string) {
  const { updateDoc } = await import("firebase/firestore");
  await updateDoc(doc(db, REQUESTS_COL, requestId), {
    status,
    ...(adminNotes ? { adminNotes } : {}),
    updatedAt: serverTimestamp(),
  });
}
