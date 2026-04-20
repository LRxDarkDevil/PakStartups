// lib/services/events.ts
import {
  collection, addDoc, getDocs, doc, updateDoc, setDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp, getDoc, Timestamp, increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export type EventItem = {
  id?: string;
  title: string;
  desc: string;
  type: "WORKSHOP" | "MEETUP" | "DEMO" | "PITCHING" | "CONFERENCE" | "TALK";
  location: string;
  isOnline: boolean;
  organizerId: string;
  organizerName: string;
  dateTs: Timestamp | null; // Firestore Timestamp
  dateLabel: string;        // human-readable, e.g. "Friday, May 2 · 7:00 PM PKT"
  rsvpCount: number;
  status: "pending" | "approved" | "past";
  isFeatured: boolean;
  createdAt?: unknown;
};

const COL = "events";

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
  return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as EventItem);
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
  [...statusSnap.docs, ...approvedSnap.docs].forEach((d) => merged.set(d.id, { id: d.id, ...d.data() } as EventItem));
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
  return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as EventItem);
}

export async function getFeaturedEvent(): Promise<EventItem | null> {
  const q = query(
    collection(db, COL),
    where("status", "==", "approved"),
    where("isFeatured", "==", true),
    limit(1)
  );
  const snaps = await getDocs(q);
  if (snaps.empty) return null;
  return { id: snaps.docs[0].id, ...snaps.docs[0].data() } as EventItem;
}

export async function proposeEvent(data: Omit<EventItem, "id" | "status" | "isFeatured" | "rsvpCount" | "createdAt">) {
  return addDoc(collection(db, COL), {
    ...data,
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
    return false; // un-rsvp'd
  } else {
    await setDoc(rsvpRef, { uid, rsvpAt: serverTimestamp() });
    await updateDoc(doc(db, COL, eventId), { rsvpCount: increment(1) });
    return true; // rsvp'd
  }
}
