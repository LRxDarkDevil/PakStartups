"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

/**
 * AdminGuard — wraps admin pages.
 * Redirects unauthenticated users → /auth/login
 * Redirects authenticated non-admins → /dashboard
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/auth/login"); return; }
    if (profile && profile.role !== "admin") { router.replace("/dashboard"); return; }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5fbf7]">
        <div className="flex flex-col items-center gap-4">
          <span className="inline-block w-10 h-10 border-4 border-[#0f5238]/20 border-t-[#0f5238] rounded-full animate-spin" />
          <p className="text-[#404943] font-medium text-sm">Verifying admin access…</p>
        </div>
      </div>
    );
  }

  // While profile loads but user is authenticated, wait
  if (user && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5fbf7]">
        <span className="inline-block w-10 h-10 border-4 border-[#0f5238]/20 border-t-[#0f5238] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || profile?.role !== "admin") return null;

  return <>{children}</>;
}
