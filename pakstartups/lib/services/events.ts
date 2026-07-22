// lib/services/events.ts
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  getDoc,
  Timestamp,
  runTransaction,
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

export type EventInput = Omit<
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

export type EventAdminUpdate = Omit<EventInput, "organizerId"> & {
  organizerName: string;
};

function cleanOptionalString(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizeSpeakers(speakers: EventSpeaker[] | undefined) {
  return speakers
    ?.filter((speaker) => speaker.name.trim())
    .map((speaker) => {
      const role = cleanOptionalString(speaker.role);
      const organization = cleanOptionalString(speaker.organization);
      return {
        name: speaker.name.trim(),
        ...(role ? { role } : {}),
        ...(organization ? { organization } : {}),
      };
    }) ?? [];
}

function normalizeAgenda(agenda: string[] | undefined) {
  return agenda?.map((item) => item.trim()).filter(Boolean) ?? [];
}

function validateEventInput(data: EventInput | EventAdminUpdate) {
  if (data.title.trim().length < 5 || data.title.trim().length > 200) {
    throw new Error("Event title must be between 5 and 200 characters.");
  }
  if (data.desc.trim().length < 20 || data.desc.trim().length > 3000) {
    throw new Error("Event description must be between 20 and 3000 characters.");
  }
  if (!data.dateTs) throw new Error("Event start date and time are required.");
  if (!isRegionId(data.regionId)) throw new Error("A canonical event region is required.");
  if (data.capacity !== undefined && (!Number.isInteger(data.capacity) || data.capacity < 1)) {
    throw new Error("Capacity must be a whole number greater than zero.");
  }
  if (data.priceType === "paid" && (!data.priceAmount || data.priceAmount <= 0)) {
    throw new Error("Paid events require a positive price.");
  }
  if (data.registrationDeadlineTs && data.registrationDeadlineTs.toMillis() > data.dateTs.toMillis()) {
    throw new Error("Registration must close before the event starts.");
  }
  if (data.bookingMode === "external-booking") {
    try {
      if (new URL(data.bookingUrl ?? "").protocol !== "https:") throw new Error();
    } catch {
      throw new Error("External booking requires a valid HTTPS URL.");
    }
  }
}

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
    dateTs: data.dateTs ?? null,
    dateLabel: data.dateLabel ?? "",
    agenda: Array.isArray(data.agenda) ? data.agenda.filter(Boolean) : [],
    speakers: Array.isArray(data.speakers) ? data.speakers.filter((speaker) => speaker?.name) : [],
    capacity: typeof data.capacity === "number" && data.capacity > 0 ? data.capacity : undefined,
    rsvpCount: typeof data.rsvpCount === "number" ? Math.max(0, data.rsvpCount) : 0,
    priceType: data.priceType ?? "free",
    bookingMode: data.bookingMode ?? "internal-rsvp",
    updateState: data.updateState ?? "scheduled",
  };
}

function normalizedWriteData(data: EventInput | EventAdminUpdate) {
  const city = data.city ?? (data.isOnline ? "Online" : data.location);
  const canonical = createCanonicalLocation({
    regionId: data.regionId ?? (data.isOnline ? "remote-online" : undefined),
    city,
  });

  return {
    title: data.title.trim(),
    desc: data.desc.trim(),
    type: data.type,
    location: data.location.trim(),
    ...canonical,
    city: cleanOptionalString(data.city),
    isOnline: data.isOnline,
    organizerName: data.organizerName.trim(),
    dateTs: data.dateTs,
    dateLabel: data.dateLabel.trim(),
    timezone: cleanOptionalString(data.timezone) ?? "Asia/Karachi",
    agenda: normalizeAgenda(data.agenda),
    speakers: normalizeSpeakers(data.speakers),
    capacity: data.capacity ?? null,
    priceType: data.priceType ?? "free",
    priceAmount: data.priceType === "paid" ? data.priceAmount ?? null : null,
    currency: data.priceType === "paid" ? cleanOptionalString(data.currency) ?? "PKR" : null,
    registrationDeadlineTs: data.registrationDeadlineTs ?? null,
    accessibilityDetails: cleanOptionalString(data.accessibilityDetails),
    updateState: data.updateState ?? "scheduled",
    updateMessage: cleanOptionalString(data.updateMessage),
    bookingMode: data.bookingMode ?? "internal-rsvp",
    bookingUrl: data.bookingMode === "external-booking" ? cleanOptionalString(data.bookingUrl) : null,
    onlineAccessPolicy: data.isOnline ? cleanOptionalString(data.onlineAccessPolicy) : null,
  };
}

export async function getEventById(eventId: string): Promise<EventItem | null> {
  const normalizedId = eventId.trim();
  if (!normalizedId) return null;
  const snapshot = await getDoc(doc(db, COL, normalizedId));
  if (!snapshot.exists()) return null;
  return hydrateEvent(snapshot.id, snapshot.data() as Omit<EventItem, "id">);
}

export async function getPublicEventById(eventId: string): Promise<EventItem | null> {
  const event = await getEventById(eventId);
  if (!event || !["approved", "past"].includes(event.status)) return null;
  return event;
}

export async function getUpcomingEvents(): Promise<EventItem[]> {
  const now = Timestamp.now();
  const eventsQuery = query(
    collection(db, COL),
    where("status", "==", "approved"),
    where("dateTs", ">=", now),
    orderBy("dateTs", "asc"),
    limit(20),
  );
  const snapshots = await getDocs(eventsQuery);
  return snapshots.docs
    .map((snapshot) => hydrateEvent(snapshot.id, snapshot.data() as Omit<EventItem, "id">))
    .filter((event) => event.updateState !== "cancelled");
}

export async function getPastEvents(): Promise<EventItem[]> {
  const now = Timestamp.now();
  const pastStatus = query(collection(db, COL), where("status", "==", "past"), orderBy("dateTs", "desc"), limit(20));
  const approvedPast = query(collection(db, COL), where("status", "==", "approved"), where("dateTs", "<", now), orderBy("dateTs", "desc"), limit(20));
  const [statusSnapshot, approvedSnapshot] = await Promise.all([getDocs(pastStatus), getDocs(approvedPast)]);
  const merged = new Map<string, EventItem>();
  [...statusSnapshot.docs, ...approvedSnapshot.docs].forEach((snapshot) =>
    merged.set(snapshot.id, hydrateEvent(snapshot.id, snapshot.data() as Omit<EventItem, "id">)),
  );
  return [...merged.values()].sort((left, right) => (right.dateTs?.toMillis() ?? 0) - (left.dateTs?.toMillis() ?? 0));
}

export async function getWeeklyMeetups(): Promise<EventItem[]> {
  const eventsQuery = query(collection(db, COL), where("status", "==", "approved"), where("type", "==", "MEETUP"), orderBy("dateTs", "asc"), limit(10));
  const snapshots = await getDocs(eventsQuery);
  return snapshots.docs
    .map((snapshot) => hydrateEvent(snapshot.id, snapshot.data() as Omit<EventItem, "id">))
    .filter((event) => event.updateState !== "cancelled");
}

export async function getFeaturedEvent(): Promise<EventItem | null> {
  const eventsQuery = query(collection(db, COL), where("status", "==", "approved"), limit(20));
  const snapshots = await getDocs(eventsQuery);
  const featured = snapshots.docs.find((snapshot) => snapshot.data().isFeatured === true && snapshot.data().updateState !== "cancelled");
  if (!featured) return null;
  return hydrateEvent(featured.id, featured.data() as Omit<EventItem, "id">);
}

export async function getRelatedEvents(event: EventItem, resultLimit = 3): Promise<EventItem[]> {
  const eventsQuery = query(collection(db, COL), where("status", "==", "approved"), limit(60));
  const snapshots = await getDocs(eventsQuery);
  const now = Timestamp.now().toMillis();
  return snapshots.docs
    .map((snapshot) => hydrateEvent(snapshot.id, snapshot.data() as Omit<EventItem, "id">))
    .filter((candidate) => candidate.id !== event.id && candidate.updateState !== "cancelled" && Boolean(candidate.dateTs && candidate.dateTs.toMillis() >= now))
    .map((candidate) => ({
      candidate,
      score: (candidate.type === event.type ? 4 : 0) + (candidate.regionId === event.regionId ? 2 : 0) + (candidate.organizerId === event.organizerId ? 1 : 0),
    }))
    .sort((left, right) => right.score - left.score || (left.candidate.dateTs?.toMillis() ?? Number.MAX_SAFE_INTEGER) - (right.candidate.dateTs?.toMillis() ?? Number.MAX_SAFE_INTEGER))
    .slice(0, resultLimit)
    .map(({ candidate }) => candidate);
}

export async function getPublicEventsForSitemap(): Promise<EventItem[]> {
  const eventsQuery = query(collection(db, COL), where("status", "==", "approved"), limit(200));
  const snapshots = await getDocs(eventsQuery);
  return snapshots.docs
    .map((snapshot) => hydrateEvent(snapshot.id, snapshot.data() as Omit<EventItem, "id">))
    .filter((event) => event.updateState !== "cancelled" && Boolean(event.id));
}

export async function proposeEvent(data: EventInput) {
  validateEventInput(data);
  return addDoc(collection(db, COL), {
    ...normalizedWriteData(data),
    organizerId: data.organizerId,
    status: "pending",
    isFeatured: false,
    rsvpCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function createEventByAdmin(data: EventAdminUpdate, organizerId: string) {
  const normalizedOrganizerId = organizerId.trim();
  if (!normalizedOrganizerId) throw new Error("Organizer ID is required.");
  validateEventInput(data);
  return addDoc(collection(db, COL), {
    ...normalizedWriteData(data),
    organizerId: normalizedOrganizerId,
    status: "pending",
    isFeatured: false,
    rsvpCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateEventByAdmin(eventId: string, data: EventAdminUpdate) {
  const normalizedId = eventId.trim();
  if (!normalizedId) throw new Error("Event ID is required.");
  validateEventInput(data);
  await updateDoc(doc(db, COL, normalizedId), {
    ...normalizedWriteData(data),
    updatedAt: serverTimestamp(),
  });
}

export async function hasUserRsvped(eventId: string, uid: string) {
  if (!eventId.trim() || !uid.trim()) return false;
  const snapshot = await getDoc(doc(db, COL, eventId, "rsvps", uid));
  return snapshot.exists();
}

export async function rsvpEvent(eventId: string, uid: string) {
  const normalizedEventId = eventId.trim();
  const normalizedUid = uid.trim();
  if (!normalizedEventId || !normalizedUid) throw new Error("Event and user are required.");
  const eventRef = doc(db, COL, normalizedEventId);
  const rsvpRef = doc(db, COL, normalizedEventId, "rsvps", normalizedUid);

  return runTransaction(db, async (transaction) => {
    const [eventSnapshot, rsvpSnapshot] = await Promise.all([transaction.get(eventRef), transaction.get(rsvpRef)]);
    if (!eventSnapshot.exists()) throw new Error("Event not found.");
    const event = hydrateEvent(eventSnapshot.id, eventSnapshot.data() as Omit<EventItem, "id">);
    const now = Timestamp.now().toMillis();
    const isPast = event.status === "past" || Boolean(event.dateTs && event.dateTs.toMillis() < now);
    const registrationClosed = Boolean(event.registrationDeadlineTs && event.registrationDeadlineTs.toMillis() < now);

    if (event.status !== "approved" || event.updateState === "cancelled" || isPast || registrationClosed) {
      throw new Error("Registration is closed for this event.");
    }
    if (event.bookingMode === "external-booking") throw new Error("This event uses external booking.");

    if (rsvpSnapshot.exists()) {
      transaction.delete(rsvpRef);
      transaction.update(eventRef, { rsvpCount: Math.max(0, event.rsvpCount - 1) });
      return false;
    }
    if (event.capacity && event.rsvpCount >= event.capacity) throw new Error("This event has reached capacity.");
    transaction.set(rsvpRef, { uid: normalizedUid, rsvpAt: serverTimestamp() });
    transaction.update(eventRef, { rsvpCount: event.rsvpCount + 1 });
    return true;
  });
}
