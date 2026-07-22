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

export type EventType = "WORKSHOP" | "MEETUP" | "DEMO" | "PITCHING" | "CONFERENCE" | "TALK";
export type EventStatus = "pending" | "approved" | "past" | "rejected";
export type EventUpdateState = "scheduled" | "updated" | "postponed" | "cancelled";
export type EventBookingMode = "internal-rsvp" | "external-booking";
export type EventPriceType = "free" | "paid";

export type EventSpeaker = {
  name: string;
  role?: string;
  organization?: string;
};

export type EventItem = {
  id?: string;
  title: string;
  desc: string;
  type: EventType;
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
  timezone?: string;
  agenda?: string[];
  speakers?: EventSpeaker[];
  capacity?: number;
  priceType?: EventPriceType;
  priceAmount?: number;
  currency?: string;
  registrationDeadlineTs?: Timestamp | null;
  accessibilityDetails?: string;
  updateState?: EventUpdateState;
  updateMessage?: string;
  bookingMode?: EventBookingMode;
  bookingUrl?: string;
  onlineAccessPolicy?: string;
  rsvpCount: number;
  status: EventStatus;
  isFeatured: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const COL = "events";

type EventInput = Omit<
  EventItem,
  | "id"
  | "status"
  | "isFeatured"
  | "rsvpCount"
  | "createdAt"
  | "updatedAt"
  | "country"
  | "countryCode"
  | "region"
> & { regionId?: RegionId };

function hydrateEvent(id: string, data: Omit<EventItem, "id">): EventItem {
  const city = data.city ?? (data.isOnline ? "Online" : data.location);
  const canonical = createCanonicalLocation({
    regionId: isRegionId(data.regionId) ? data.regionId : data.isOnline ? "remote-online" : undefined,
    city,
  });

  return {
    id,
    ...data,
    ...canonical,
    city: data.city,
    agenda: Array.isArray(data.agenda) ? data.agenda.filter(Boolean) : [],
    speakers: Array.isArray(data.speakers) ? data.speakers.filter((speaker) => speaker?.name) : [],
    priceType: data.priceType ?? "free",
    bookingMode: data.bookingMode ?? "internal-rsvp",
    updateState: data.updateState ?? "scheduled",
  };
}

export async function getEventById(eventId: string): Promise<EventItem | null> {
  const normalizedId = eventId.trim();
  if (!normalizedId) return null;

  const snapshot = await getDoc(doc(db, COL, normalizedId));
  if (!snapshot.exists()) return null;

  return hydrateEvent(snapshot.id, snapshot.data() as Omit<EventItem, "id">);
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
  return snaps.docs
    .map((d) => hydrateEvent(d.id, d.data() as Omit<EventItem, "id">))
    .filter((event) => event.updateState !== "cancelled");
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
  return snaps.docs
    .map((d) => hydrateEvent(d.id, d.data() as Omit<EventItem, "id">))
    .filter((event) => event.updateState !== "cancelled");
}

export async function getFeaturedEvent(): Promise<EventItem | null> {
  const q = query(collection(db, COL), where("status", "==", "approved"), limit(20));
  const snaps = await getDocs(q);
  const featured = snaps.docs.find((d) => d.data().isFeatured === true && d.data().updateState !== "cancelled");
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
    agenda: data.agenda?.map((item) => item.trim()).filter(Boolean) ?? [],
    speakers: data.speakers?.filter((speaker) => speaker.name.trim()).map((speaker) => ({
      name: speaker.name.trim(),
      role: speaker.role?.trim() || null,
      organization: speaker.organization?.trim() || null,
    })) ?? [],
    priceType: data.priceType ?? "free",
    priceAmount: data.priceType === "paid" ? data.priceAmount ?? null : null,
    currency: data.priceType === "paid" ? data.currency ?? "PKR" : null,
    bookingMode: data.bookingMode ?? "internal-rsvp",
    bookingUrl: data.bookingMode === "external-booking" ? data.bookingUrl ?? null : null,
    updateState: data.updateState ?? "scheduled",
    status: "pending",
    isFeatured: false,
    rsvpCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
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
