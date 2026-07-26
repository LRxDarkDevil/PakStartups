// lib/services/reviews.ts
import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export type Review = {
  id?: string;
  startupId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  rating: number; // 1 to 5
  title: string;
  content: string;
  relationship: "Customer" | "Investor" | "Employee" | "Partner" | "Community";
  status: "pending" | "approved" | "rejected";
  createdAt?: unknown;
};

export type Endorsement = {
  id?: string;
  startupId: string;
  endorserId: string;
  endorserName: string;
  endorserRole: string;
  endorserAvatar?: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: unknown;
};

const REVIEWS_COL = "startup_reviews";
const ENDORSEMENTS_COL = "startup_endorsements";

// Public fetched approved reviews for a startup
export async function getApprovedStartupReviews(startupId: string): Promise<Review[]> {
  try {
    const q = query(
      collection(db, REVIEWS_COL),
      where("startupId", "==", startupId),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as Review);
  } catch (err) {
    console.warn("Failed to fetch reviews from Firestore, returning empty list", err);
    return [];
  }
}

// Public fetched approved endorsements for a startup
export async function getApprovedStartupEndorsements(startupId: string): Promise<Endorsement[]> {
  try {
    const q = query(
      collection(db, ENDORSEMENTS_COL),
      where("startupId", "==", startupId),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as Endorsement);
  } catch (err) {
    console.warn("Failed to fetch endorsements from Firestore, returning empty list", err);
    return [];
  }
}

// Submit a new review for moderation
export async function submitReview(data: Omit<Review, "id" | "status" | "createdAt">) {
  return addDoc(collection(db, REVIEWS_COL), {
    ...data,
    status: "approved", // Auto-approve for demo/MVP, configurable to pending
    createdAt: serverTimestamp(),
  });
}

// Submit a founder endorsement for moderation
export async function submitEndorsement(data: Omit<Endorsement, "id" | "status" | "createdAt">) {
  return addDoc(collection(db, ENDORSEMENTS_COL), {
    ...data,
    status: "approved",
    createdAt: serverTimestamp(),
  });
}

// Admin: Fetch all pending reviews
export async function getPendingReviews(): Promise<Review[]> {
  const q = query(
    collection(db, REVIEWS_COL),
    where("status", "==", "pending"),
    limit(100)
  );
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as Review);
}

// Admin: Moderate review
export async function moderateReview(reviewId: string, status: "approved" | "rejected") {
  await updateDoc(doc(db, REVIEWS_COL, reviewId), { status });
}

// Delete review
export async function deleteReview(reviewId: string) {
  await deleteDoc(doc(db, REVIEWS_COL, reviewId));
}
