// lib/services/ideas.ts
import {
  collection, doc, addDoc, getDocs, updateDoc,
  query, where, orderBy, limit, serverTimestamp, increment, getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export type Idea = {
  id?: string;
  title: string;
  desc: string;
  stage: "PROBLEM DEFINED" | "VALIDATION STAGE" | "SOLUTION MVP" | "SCALING";
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  ownerId: string;
  upvotes: number;
  comments: number;
  status: "active" | "archived";
  createdAt?: unknown;
};

const COL = "ideas";

export async function getIdeas(filter?: "Most Voted" | "Newest" | "Most Discussed"): Promise<Idea[]> {
  const sortField = filter === "Most Voted" ? "upvotes"
    : filter === "Most Discussed" ? "comments"
    : "createdAt";
  const q = query(
    collection(db, COL),
    where("status", "==", "active"),
    orderBy(sortField, "desc"),
    limit(20)
  );
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as Idea);
}

export async function getMyIdeas(uid: string): Promise<Idea[]> {
  const q = query(collection(db, COL), where("ownerId", "==", uid), orderBy("createdAt", "desc"));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as Idea);
}

export async function submitIdea(data: Omit<Idea, "id" | "upvotes" | "comments" | "status" | "createdAt">) {
  return addDoc(collection(db, COL), {
    ...data,
    upvotes: 0,
    comments: 0,
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function upvoteIdea(ideaId: string) {
  await updateDoc(doc(db, COL, ideaId), { upvotes: increment(1) });
}

export async function downvoteIdea(ideaId: string) {
  await updateDoc(doc(db, COL, ideaId), { upvotes: increment(-1) });
}
