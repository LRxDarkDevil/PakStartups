// lib/services/events.ts
import {
  collection, addDoc, getDocs, doc, updateDoc, setDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp, getDoc, Timestamp, increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  createCanonicalLocation,
  isRegionId,
  type CanonicalLocation,
  type RegionId,
} from "@/lib/location";

export type EventItem = {
  id?: string;
  title: string;
  desc: string;
  type: "WORKSHOP" | "MEETUP" | "DEMO" | "PITCHING" | "CONFERENCE" | "TALK";
  location: string;
  city?: string;
  country?: CanonicalLocation["country"];
  countryCode?: CanonicalLocation["countryCode"];
  regionId?: RegionId;
  region?: string;
  isOnline: boolean;
  organizerId: string;
  organizerName: string;
  dateTs: Timestamp | null;
  dateLabel: string;
  rsvpCount: number;
  status: "pending" | "approved" | "past";
  isFeatured: boolean;
  createdAt?: unknown;
};

const COL = "events";

type EventInput = Omit<
  EventItem,
  "id" | "status" | "isFeatured" | "rsvpCount" | "createdAt" | "country" | "countryCode" | "region"
> & { regionId?: RegionId };

function hydrateEvent(id: string, data: Omit<EventItem, "id">): EventItem {
  const city = data.city ?? (data.isOnline ? "Online" : data.location);
  const canonical = createCanonicalLocation({
    regionId: isRegionId(data.regionId) ? data.regionId : data.isOnline ? "remote-online" : undefined,
    city,
  });

  return { id, ...data, ...canonical, city: data.city };
}

export async function getUpcomingEvents(): Promise<EventItem[]> {
  const now = Timestamp.now();
  const q = query(
    collection(db, COL),
    where("status", "==", "approved"),
    where("dateTs", ">=", now),
    orderBy("dateTs", "asc"),
    limit(20)
  );
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => hydrateEvent(d.id, d.data() as Omit<EventItem, "id">));
}

export async function getPastEvents(): Promise<EventItem[]> {
  const now = Timestamp.now();
  const pastStatus = query(
    collection(db, COL),
    where("status", "==", "past"),
    orderBy("dateTs", "desc"),
    limit(20)
  );
  const approvedPast = query(
    collection(db, COL),
    where("status", "==", "approved"),
    where("dateTs", "<", now),
    orderBy("dateTs", "desc"),
    limit(20)
  );

  const [statusSnap, approvedSnap] = await Promise.all([getDocs(pastStatus), getDocs(approvedPast)]);
  const merged = new Map<string, EventItem>();
  [...statusSnap.docs, ...approvedSnap.docs].forEach((d) =>
    merged.set(d.id, hydrateEvent(d.id, d.data() as Omit<EventItem, "id">))
  );
  return [...merged.values()].sort((a, b) => {
    const aDate = a.dateTs ? a.dateTs.toMillis() : 0;
    const bDate = b.dateTs ? b.dateTs.toMillis() : 0;
    return bDate - aDate;
  });
}

export async function getWeeklyMeetups(): Promise<EventItem[]> {
  const q = query(
    collection(db, COL),
    where("status", "==", "approved"),
    where("type", "==", "MEETUP"),
    orderBy("dateTs", "asc"),
    limit(10)
  );
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => hydrateEvent(d.id, d.data() as Omit<EventItem, "id">));
}

export async function getFeaturedEvent(): Promise<EventItem | null> {
  const q = query(collection(db, COL), where("status", "==", "approved"), limit(20));
  const snaps = await getDocs(q);
  const featured = snaps.docs.find((d) => d.data().isFeatured === true);
  if (!featured) return null;
  return hydrateEvent(featured.id, featured.data() as Omit<EventItem, "id">);
}

export async function proposeEvent(data: EventInput) {
  const city = data.city ?? (data.isOnline ? "Online" : data.location);
  const canonical = createCanonicalLocation({
    regionId: data.regionId ?? (data.isOnline ? "remote-online" : undefined),
    city,
  });
  return addDoc(collection(db, COL), {
    ...data,
    ...canonical,
    city: data.city ?? null,
    status: "pending",
    isFeatured: false,
    rsvpCount: 0,
    createdAt: serverTimestamp(),
  });
}

export async function rsvpEvent(eventId: string, uid: string) {
  const rsvpRef = doc(db, COL, eventId, "rsvps", uid);
  const existing = await getDoc(rsvpRef);
  if (existing.exists()) {
    await deleteDoc(rsvpRef);
    await updateDoc(doc(db, COL, eventId), { rsvpCount: increment(-1) });
    return false;
  }

  await setDoc(rsvpRef, { uid, rsvpAt: serverTimestamp() });
  await updateDoc(doc(db, COL, eventId), { rsvpCount: increment(1) });
  return true;
}