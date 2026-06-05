"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";
import { downvoteIdea, upvoteIdea, type Idea } from "@/lib/services/ideas";

type Comment = { id: string; body: string; authorName: string; createdAt?: { toDate?: () => Date } | string | null };

function IdeaViewContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  const id = params.get("id") ?? "";
  const [idea, setIdea] = useState<Idea | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const snap = await getDoc(doc(db, "ideas", id));
      if (snap.exists()) setIdea({ id: snap.id, ...snap.data() } as Idea);
      const commentsSnap = await getDocs(query(collection(db, "ideas", id, "comments"), orderBy("createdAt", "desc")));
      setComments(commentsSnap.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as Comment));
    })();
  }, [id]);

  const handleUpvoteClick = async () => {
    if (!id || !idea) return;
    if (hasUpvoted) return;
    let diff = 1;
    if (hasDownvoted) diff = 2;
    setIdea((prev) => (prev ? { ...prev, upvotes: (prev.upvotes ?? 0) + diff } : null));
    setHasUpvoted(true);
    setHasDownvoted(false);
    await upvoteIdea(id);
  };

  const handleDownvoteClick = async () => {
    if (!id || !idea) return;
    if (hasDownvoted) return;
    let diff = -1;
    if (hasUpvoted) diff = -2;
    setIdea((prev) => (prev ? { ...prev, upvotes: Math.max(0, (prev.upvotes ?? 0) + diff) } : null));
    setHasDownvoted(true);
    setHasUpvoted(false);
    await downvoteIdea(id);
  };

  const handleComment = async () => {
    if (!user) {
      router.push("/auth/signup");
      return;
    }
    if (!body.trim() || !id) return;
    await addDoc(collection(db, "ideas", id, "comments"), {
      body: body.trim(),
      authorId: user.uid,
      authorName: profile?.fullName || user.displayName || user.email || "Anonymous",
      createdAt: serverTimestamp(),
    });
    setBody("");
    const commentsSnap = await getDocs(query(collection(db, "ideas", id, "comments"), orderBy("createdAt", "desc")));
    setComments(commentsSnap.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as Comment));
  };

  return (
    <main className="max-w-4xl mx-auto px-8 py-16">
      <Link href="/ideas" className="text-[#0f5238] font-bold text-sm mb-6 inline-block">← Back to Ideas</Link>
      <div className="bg-white rounded-2xl p-8 border border-[#dbeee2] space-y-6">
        <h1 className="text-3xl font-black text-[#002112]">{String(idea?.title ?? "Idea details")}</h1>
        <p className="text-[#404943]">{String(idea?.desc ?? "Open the idea board to view more.")}</p>
        
        <div className="flex items-center gap-4 py-2">
          <div className="flex items-center gap-2 bg-[#f0fdf4] rounded-xl p-1 border border-[#bfc9c1]/20">
            <button
              onClick={() => void handleUpvoteClick()}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95 ${hasUpvoted ? "bg-[#0f5238] text-white shadow-md" : "bg-[#d5fde2] text-[#0f5238] hover:bg-[#b4ef9d]"}`}
            >
              <span className="material-symbols-outlined text-sm">arrow_upward</span>
              Upvote ({idea?.upvotes ?? 0})
            </button>
            <button
              onClick={() => void handleDownvoteClick()}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95 ${hasDownvoted ? "bg-[#7c1d1d] text-white shadow-md" : "bg-[#f5faf6] text-[#707973] hover:bg-red-50 hover:text-[#7c1d1d]"}`}
            >
              <span className="material-symbols-outlined text-sm">arrow_downward</span>
              Downvote
            </button>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#e0e0e0]">
          <h2 className="text-xl font-black text-[#002112]">Comments</h2>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full px-4 py-3 border rounded-lg min-h-32" placeholder="Add a constructive comment" />
          <button onClick={() => void handleComment()} className="px-5 py-3 rounded-lg bg-[#0f5238] text-white font-bold">Post Comment</button>
          <div className="space-y-3 pt-4">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-xl border border-[#e0e0e0] p-4">
                <p className="text-sm font-bold text-[#002112]">{comment.authorName}</p>
                <p className="text-[#404943] mt-1">{comment.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function IdeaViewPage() {
  return (
    <Suspense fallback={<main className="max-w-4xl mx-auto px-8 py-16 text-[#404943]">Loading idea...</main>}>
      <IdeaViewContent />
    </Suspense>
  );
}