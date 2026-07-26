// lib/services/startups.ts
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc,
  query, where, orderBy, limit, serverTimestamp, increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export type Startup = {
  id?: string;
  name: string;
  desc: string;
  stage: "Idea" | "MVP" | "Growth" | "Scaling";
  city: string;
  category: string;
  slug: string;
  logo: string;
  website?: string;
  ownerId: string;
  ownerName: string;
  status: "pending" | "approved" | "rejected";
  views: number;
  createdAt?: unknown;
};

const COL = "startups";

export async function getStartups(cat?: string): Promise<Startup[]> {
  let q = query(
    collection(db, COL),
    where("status", "==", "approved"),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  if (cat && cat !== "All") {
    q = query(
      collection(db, COL),
      where("status", "==", "approved"),
      where("category", "==", cat),
      orderBy("createdAt", "desc"),
      limit(50)
    );
  }
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as Startup);
}

export async function getStartupBySlug(slug: string): Promise<Startup | null> {
  const q = query(collection(db, COL), where("slug", "==", slug), limit(1));
  const snaps = await getDocs(q);
  if (snaps.empty) return null;
  const d = snaps.docs[0];
  return { id: d.id, ...d.data() } as Startup;
}

export async function submitStartup(data: Omit<Startup, "id" | "status" | "views" | "createdAt">) {
  return addDoc(collection(db, COL), {
    ...data,
    status: "pending",
    views: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function incrementStartupViews(id: string) {
  await updateDoc(doc(db, COL, id), { views: increment(1) });
}

export type StartupNomination = {
  id?: string;
  startupName: string;
  website: string;
  category: string;
  city: string;
  description: string;
  nominatorName: string;
  nominatorEmail: string;
  relationship: "Customer" | "Investor" | "Community Member" | "Employee" | "Other";
  evidenceUrl?: string;
  status: "pending_review" | "approved" | "rejected";
  createdAt?: unknown;
};

export async function nominateStartup(data: Omit<StartupNomination, "id" | "status" | "createdAt">) {
  return addDoc(collection(db, "startup_nominations"), {
    ...data,
    status: "pending_review",
    createdAt: serverTimestamp(),
  });
}
