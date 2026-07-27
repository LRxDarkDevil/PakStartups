"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminGuard from "@/components/admin/AdminGuard";
import { logout } from "@/lib/firebase/auth";

const sideNav = [
  { label: "Overview / Queue", icon: "dashboard", href: "/admin" },
  { label: "User Management", icon: "group", href: "/admin/users" },
  { label: "Blog & Stories", icon: "article", href: "/admin/blog" },
  { label: "Events Mgt.", icon: "event", href: "/admin/events" },
  { label: "Event Banner", icon: "campaign", href: "/admin/events/announcement" },
  { label: "Volunteer Apps", icon: "volunteer_activism", href: "/admin/volunteers" },
  { label: "Reports", icon: "description", href: "/admin/reports" },
  { label: "Site Config", icon: "tune", href: "/admin/settings" },
];

function isNavItemActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  if (href === "/admin/events") return pathname === "/admin/events";
  return pathname.startsWith(href);
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const router = useRouter();
  const [adminSearch, setAdminSearch] = useState("");
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const displayName = profile?.fullName || user?.displayName || "Admin";
  const initials = displayName.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

  useEffect(() => {
    if (!mobileNavOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileNavOpen]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  const renderNavLinks = (onNavigate?: () => void) => (
    <nav className="flex-1 space-y-1" aria-label="Admin navigation">
      {sideNav.map((item) => {
        const isActive = isNavItemActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold tracking-tight transition-colors ${
              isActive
                ? "bg-[#0f5238] text-white"
                : "text-[#404943] hover:text-[#0f5238] hover:bg-[#e3eae6]"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const adminIdentity = (
    <div className="px-3 py-2">
      <p className="text-xs font-bold text-[#404943] uppercase tracking-widest mb-1">Logged in as</p>
      <p className="text-sm font-bold text-[#002112] truncate">{displayName}</p>
      <span className="inline-block mt-1 px-2 py-0.5 bg-[#0f5238] text-white text-[10px] font-bold rounded-full uppercase tracking-widest">Admin</span>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f5fbf7]">
      {/* TopNavBar */}
      <header className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8 sticky top-0 z-40 bg-[#dee4e0]/80 backdrop-blur-xl border-b border-[#bfc9c1]/20">
        <div className="flex-1 flex items-center gap-3 sm:gap-6 min-w-0">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="lg:hidden shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#0f5238] hover:bg-[#e3eae6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5238]"
            aria-label="Open admin sidebar"
            aria-controls="admin-mobile-sidebar"
            aria-expanded={mobileNavOpen}
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
          <Link href="/admin" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
            <Image
              src="/logo.png"
              alt="PakStartups Logo"
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg"
            />
            <span className="font-bold text-[#0f5238] uppercase tracking-widest text-lg">Admin</span>
          </Link>
          <div className="relative w-full max-w-md hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#404943] text-lg">search</span>
            <input
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && adminSearch.trim()) {
                  router.push(`/admin/users?search=${encodeURIComponent(adminSearch.trim())}`);
                }
              }}
              className="w-full bg-[#dee4e0] border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-[#0f5238] outline-none placeholder:text-[#404943]/60"
              placeholder="Search users..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 text-[#404943] shrink-0">
          <Link href="/" className="text-[#0f5238] border border-[#0f5238]/20 px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#b1f0ce] transition-colors whitespace-nowrap">
            ← Public Site
          </Link>
          <div className="relative">
            <button onClick={() => setShowNotifMenu(!showNotifMenu)} className="p-1 hover:bg-[#e3eae6] rounded-full transition-colors hidden sm:block relative">
              <span className="material-symbols-outlined hover:text-[#0f5238]">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>
            {showNotifMenu && (
              <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-2xl border border-[#e0e0e0] overflow-hidden z-50 py-2">
                <p className="px-4 py-2 text-xs font-bold text-[#002112] border-b border-[#f0f0f0]">Admin Alerts</p>
                <div className="divide-y divide-[#f0f0f0] max-h-60 overflow-y-auto">
                  <div className="p-3 hover:bg-[#f5faf6] transition-colors">
                    <p className="text-xs text-[#002112] font-semibold">New Startup Submission pending review</p>
                    <p className="text-[10px] text-[#707973] mt-0.5">2 hours ago</p>
                  </div>
                  <div className="p-3 hover:bg-[#f5faf6] transition-colors">
                    <p className="text-xs text-[#002112] font-semibold">New Volunteer Application submitted</p>
                    <p className="text-[10px] text-[#707973] mt-0.5">5 hours ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Admin avatar dropdown */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#0f5238] flex items-center justify-center text-white text-xs font-black ring-2 ring-[#f5fbf7]">
              {profile?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.photoURL} alt="Admin" referrerPolicy="no-referrer" className="w-full h-full rounded-full object-cover" />
              ) : initials}
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-red-500 font-bold hover:underline hidden sm:block"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin sidebar">
          <button
            type="button"
            aria-label="Close admin sidebar"
            className="absolute inset-0 bg-[#002112]/45 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside
            id="admin-mobile-sidebar"
            className="relative flex h-full w-[min(20rem,88vw)] flex-col bg-white px-4 pb-6 pt-4 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between border-b border-[#bfc9c1]/20 pb-4">
              <Link href="/admin" onClick={() => setMobileNavOpen(false)} className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="PakStartups Logo"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-lg"
                />
                <span className="font-bold text-[#0f5238] uppercase tracking-widest text-lg">Admin</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#404943] hover:bg-[#e3eae6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5238]"
                aria-label="Close admin sidebar"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {renderNavLinks(() => setMobileNavOpen(false))}
            </div>

            <div className="mt-6 space-y-3 border-t border-[#bfc9c1]/20 pt-4">
              {adminIdentity}
              <Link
                href="/"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#0f5238]/20 px-4 py-2.5 text-sm font-bold text-[#0f5238] hover:bg-[#d5fde2]"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Public Site
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex flex-1 max-w-[1440px] mx-auto w-full">
        {/* Desktop SideNavBar */}
        <aside className="w-64 border-r border-[#bfc9c1]/20 flex-col pt-8 pb-6 px-4 hidden lg:flex bg-white">
          {renderNavLinks()}
          <div className="mt-auto pt-6 border-t border-[#bfc9c1]/20">
            {adminIdentity}
          </div>
        </aside>

        {/* Content Canvas */}
        <main className="flex-1 w-full min-w-0 bg-white relative">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminGuard>
  );
}
