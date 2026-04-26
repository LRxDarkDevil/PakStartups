import {
  collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc,
  query, where, orderBy, doc, serverTimestamp, limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export type EcosystemOrg = {
  id?: string;
  name: string;
  type: "Incubator" | "Accelerator" | "Co-Working" | "Venture Capital" | "Government" | "Innovation Hub";
  city: string;
  desc: string;
  tags: string[];
  icon: string;
  website?: string;
  email?: string;
  featured: boolean;
  approved: boolean;
  submittedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const COL = "ecosystemOrgs";

export async function getEcosystemOrgs(): Promise<EcosystemOrg[]> {
  const q = query(
    collection(db, COL),
    where("approved", "==", true),
    limit(100)
  );
  const snaps = await getDocs(q);
  return snaps.docs
    .map((d) => ({ id: d.id, ...d.data() }) as EcosystemOrg)
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
}

export async function getAllEcosystemOrgs(): Promise<EcosystemOrg[]> {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"), limit(100));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as EcosystemOrg);
}

export async function addEcosystemOrg(
  data: Omit<EcosystemOrg, "id" | "createdAt" | "updatedAt">,
  submittedBy?: string
) {
  return addDoc(collection(db, COL), {
    ...data,
    submittedBy: submittedBy ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateEcosystemOrg(id: string, data: Partial<EcosystemOrg>) {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteEcosystemOrg(id: string) {
  await deleteDoc(doc(db, COL, id));
}

export async function approveEcosystemOrg(id: string, approved: boolean) {
  await updateDoc(doc(db, COL, id), { approved, updatedAt: serverTimestamp() });
}

export async function featureEcosystemOrg(id: string, featured: boolean) {
  await updateDoc(doc(db, COL, id), { featured, updatedAt: serverTimestamp() });
}
