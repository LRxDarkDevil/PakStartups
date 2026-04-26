import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export type FAQItem = {
  id?: string;
  question: string;
  answer: string;
  order?: number;
  isPublished: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const COL = "faqs";

export async function getPublishedFaqs(): Promise<FAQItem[]> {
  const snaps = await getDocs(query(collection(db, COL), orderBy("order", "asc"), limit(100)));
  return snaps.docs
    .map((d) => ({ id: d.id, ...d.data() }) as FAQItem)
    .filter((item) => item.isPublished !== false);
}

export async function addFaq(data: Omit<FAQItem, "id" | "createdAt" | "updatedAt">) {
  return addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateFaq(id: string, data: Partial<FAQItem>) {
  await updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteFaq(id: string) {
  await deleteDoc(doc(db, COL, id));
}
