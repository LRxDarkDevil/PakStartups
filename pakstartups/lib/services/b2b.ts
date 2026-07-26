// lib/services/b2b.ts
import {
  collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export type B2BDemand = {
  id?: string;
  title: string;
  desc: string;
  category: string;
  tags: string[];
  budget: string;
  deadline: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  icon: string;
  status: "active" | "closed";
  createdAt?: unknown;
};

export type B2BSolution = {
  id?: string;
  title: string;
  desc: string;
  category: string;
  tags: string[];
  priceRange: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  icon: string;
  status: "active" | "inactive";
  createdAt?: unknown;
};

const DEMANDS_COL = "b2bDemands";
const SOLUTIONS_COL = "b2bSolutions";

export async function getB2BDemands(category?: string): Promise<B2BDemand[]> {
  let q = query(
    collection(db, DEMANDS_COL),
    where("status", "==", "active"),
    orderBy("createdAt", "desc"),
    limit(20)
  );
  if (category && category !== "All Categories") {
    q = query(
      collection(db, DEMANDS_COL),
      where("status", "==", "active"),
      where("category", "==", category),
      orderBy("createdAt", "desc"),
      limit(20)
    );
  }
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as B2BDemand);
}

export async function getB2BSolutions(category?: string): Promise<B2BSolution[]> {
  let q = query(
    collection(db, SOLUTIONS_COL),
    where("status", "==", "active"),
    orderBy("createdAt", "desc"),
    limit(20)
  );
  if (category && category !== "All Categories") {
    q = query(
      collection(db, SOLUTIONS_COL),
      where("status", "==", "active"),
      where("category", "==", category),
      orderBy("createdAt", "desc"),
      limit(20)
    );
  }
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as B2BSolution);
}

export async function postB2BDemand(data: Omit<B2BDemand, "id" | "status" | "createdAt">) {
  return addDoc(collection(db, DEMANDS_COL), {
    ...data,
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function listB2BSolution(data: Omit<B2BSolution, "id" | "status" | "createdAt">) {
  return addDoc(collection(db, SOLUTIONS_COL), {
    ...data,
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export type B2BRequestStatus =
  | "submitted"
  | "under_review"
  | "clarification_needed"
  | "shortlisted"
  | "introduced"
  | "closed"
  | "rejected";

export type B2BRequest = {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  orgName: string;
  type: "Need Service / Software" | "Offer Service / Solution" | "Perk Claim";
  category: string;
  title: string;
  description: string;
  budgetRange?: string;
  urgency: "Urgent (< 7 days)" | "Standard (1-4 weeks)" | "Exploratory";
  contactConsent: boolean;
  status: B2BRequestStatus;
  adminNotes?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const B2B_REQUESTS_COL = "b2b_requests";

export async function submitB2BRequest(data: Omit<B2BRequest, "id" | "status" | "createdAt" | "updatedAt">) {
  return addDoc(collection(db, B2B_REQUESTS_COL), {
    ...data,
    status: "submitted",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserB2BRequests(userId: string): Promise<B2BRequest[]> {
  try {
    const q = query(
      collection(db, B2B_REQUESTS_COL),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as B2BRequest);
  } catch (err) {
    console.warn("Failed to fetch user B2B requests", err);
    return [];
  }
}

export async function getAllB2BRequests(): Promise<B2BRequest[]> {
  try {
    const q = query(collection(db, B2B_REQUESTS_COL), orderBy("createdAt", "desc"), limit(100));
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as B2BRequest);
  } catch (err) {
    console.warn("Failed to fetch all B2B requests", err);
    return [];
  }
}

export async function updateB2BRequestStatus(requestId: string, status: B2BRequestStatus, adminNotes?: string) {
  const { doc, updateDoc } = await import("firebase/firestore");
  await updateDoc(doc(db, B2B_REQUESTS_COL, requestId), {
    status,
    ...(adminNotes ? { adminNotes } : {}),
    updatedAt: serverTimestamp(),
  });
}
