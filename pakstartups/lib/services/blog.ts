// lib/services/blog.ts
import {
  collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export type BlogPost = {
  id?: string;
  title: string;
  excerpt: string;
  content?: string;
  category: "Founder Journey" | "Case Study" | "Lessons Learned";
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  cover?: string;
  readTime: string;
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
  createdAt?: unknown;
};

const COL = "blogPosts";

export async function getBlogPosts(category?: string): Promise<BlogPost[]> {
  let q = query(
    collection(db, COL),
    where("status", "==", "approved"),
    orderBy("createdAt", "desc"),
    limit(20)
  );
  if (category && category !== "All Posts") {
    const catMap: Record<string, string> = {
      "Founder Journeys": "Founder Journey",
      "Case Studies": "Case Study",
      "Lessons Learned": "Lessons Learned",
    };
    q = query(
      collection(db, COL),
      where("status", "==", "approved"),
      where("category", "==", catMap[category] ?? category),
      orderBy("createdAt", "desc"),
      limit(20)
    );
  }
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...d.data() }) as BlogPost);
}

export async function getFeaturedPost(): Promise<BlogPost | null> {
  const q = query(
    collection(db, COL),
    where("status", "==", "approved"),
    where("isFeatured", "==", true),
    limit(1)
  );
  const snaps = await getDocs(q);
  if (snaps.empty) return null;
  return { id: snaps.docs[0].id, ...snaps.docs[0].data() } as BlogPost;
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const { getDoc, doc } = await import("firebase/firestore");
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as BlogPost;
}

export async function submitPost(data: Omit<BlogPost, "id" | "status" | "isFeatured" | "createdAt">) {
  return addDoc(collection(db, COL), {
    ...data,
    status: "pending",
    isFeatured: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
