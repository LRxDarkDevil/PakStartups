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

const MOCK_PARTNERS: StrategicPartner[] = [
  {
    id: "p1",
    name: "AWS for Startups",
    logo: "/images/image-004.jpg",
    tier: "Infrastructure Partner",
    description: "Cloud credit grants, technical architecture support, and incubation perks for Pakistani founders.",
    website: "https://aws.amazon.com/startups/",
    isSponsored: true,
    disclosureText: "Official Infrastructure Partner",
    status: "active",
    placements: ["homepage", "about", "ecosystem"],
  },
  {
    id: "p2",
    name: "NIC Pakistan",
    logo: "/images/image-045.jpg",
    tier: "Headline Partner",
    description: "National Incubation Center network accelerating pre-seed and seed stage startups nationwide.",
    website: "https://nicpakistan.pk",
    isSponsored: false,
    disclosureText: "Ecosystem Innovation Partner",
    status: "active",
    placements: ["homepage", "about"],
  },
];

export async function getStrategicPartners(): Promise<StrategicPartner[]> {
  try {
    const q = query(collection(db, COL), where("status", "==", "active"), limit(50));
    const snaps = await getDocs(q);
    if (snaps.empty) return MOCK_PARTNERS;
    return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as StrategicPartner);
  } catch (err) {
    console.warn("Failed to fetch partners from Firestore, returning defaults", err);
    return MOCK_PARTNERS;
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
