import {
  collection, addDoc, getDocs, updateDoc, deleteDoc,
  query, where, orderBy, doc, serverTimestamp, limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export type KnowledgeResourceType = "guide" | "tool" | "report" | "directory";

export type KnowledgeResource = {
  id?: string;
  resourceType: KnowledgeResourceType;
  category: string;
  title: string;
  desc: string;
  icon: string;
  format?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  tag?: string;
  tags?: string[];
  link?: string;
  href?: string;
  featured: boolean;
  readTime?: string;
  pages?: number;
  date?: string;
  sector?: string;
  org?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const COL = "knowledgeResources";

export async function getKnowledgeResources(resourceType: KnowledgeResourceType): Promise<KnowledgeResource[]> {
  const q = query(
    collection(db, COL),
    where("resourceType", "==", resourceType),
    limit(100)
  );
  const snaps = await getDocs(q);
  return snaps.docs
    .map((d) => ({ id: d.id, ...d.data() }) as KnowledgeResource)
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
}

export async function getAllKnowledgeResources(): Promise<KnowledgeResource[]> {
  const q = query(collection(db, COL), limit(200));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as KnowledgeResource);
}

export async function addKnowledgeResource(data: Omit<KnowledgeResource, "id" | "createdAt" | "updatedAt">) {
  return addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateKnowledgeResource(id: string, data: Partial<KnowledgeResource>) {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteKnowledgeResource(id: string) {
  await deleteDoc(doc(db, COL, id));
}
