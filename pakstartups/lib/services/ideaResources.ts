import {
  collection, addDoc, getDocs, updateDoc, deleteDoc,
  query, orderBy, doc, serverTimestamp, limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export type IdeaResource = {
  id?: string;
  tab: "Templates" | "Playbooks" | "Tools" | "Reading";
  title: string;
  desc: string;
  icon: string;
  format: string;
  tag?: string;
  href?: string;
  featured: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const COL = "ideaResources";

export async function getIdeaResources(): Promise<IdeaResource[]> {
  const q = query(collection(db, COL), limit(100));
  const snaps = await getDocs(q);
  return snaps.docs
    .map((d) => ({ id: d.id, ...d.data() }) as IdeaResource)
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
}

export async function addIdeaResource(data: Omit<IdeaResource, "id" | "createdAt" | "updatedAt">) {
  return addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateIdeaResource(id: string, data: Partial<IdeaResource>) {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteIdeaResource(id: string) {
  await deleteDoc(doc(db, COL, id));
}
