// lib/services/partners.ts
import {
  collection, addDoc, getDocs, updateDoc, deleteDoc,
  query, where, orderBy, doc, serverTimestamp, limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export type PartnerTier = "Headline Partner" | "Ecosystem Sponsor" | "Infrastructure Partner" | "Community Collaborator";

export type StrategicPartner = {
  id?: string;
  name: string;
  logo: string;
  tier: PartnerTier;
  description: string;
  website: string;
  isSponsored: boolean;
  disclosureText?: string;
  status: "active" | "paused" | "expired";
  placements: ("homepage" | "about" | "ecosystem" | "footer")[];
  order?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const COL = "strategic_partners";

export async function getStrategicPartners(): Promise<StrategicPartner[]> {
  try {
    const q = query(collection(db, COL), where("status", "==", "active"), limit(50));
    const snaps = await getDocs(q);
    if (snaps.empty) return [];
    return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as StrategicPartner);
  } catch (err) {
    console.warn("Failed to fetch partners from Firestore", err);
    return [];
  }
}

export async function addStrategicPartner(data: Omit<StrategicPartner, "id" | "createdAt" | "updatedAt">) {
  return addDoc(collection(db, COL), {
    ...data,
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
