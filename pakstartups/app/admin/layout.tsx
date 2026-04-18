"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminGuard from "@/components/admin/AdminGuard";
import { logout } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

const sideNav = [
  { label: "Overview / Queue", icon: "dashboard", href: "/admin" },
  { label: "User Management", icon: "group", href: "/admin/users" },
  { label: "Blog & Stories", icon: "article", href: "/admin/blog" },
  { label: "Events Mgt.", icon: "event", href: "/admin/events" },
  { label: "Volunteer Apps", icon: "volunteer_activism", href: "/admin/volunteers" },
  { label: "Reports", icon: "description", href: "/admin/reports" },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const router = useRouter();

  const displayName = profile?.fullName || user?.displayName || "Admin";
  const initials = displayName.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5fbf7]">
      {/* TopNavBar */}
      <header className="flex justify-between items-center h-16 px-8 sticky top-0 z-40 bg-[#dee4e0]/80 backdrop-blur-xl border-b border-[#bfc9c1]/20">
        <div className="flex-1 flex items-center gap-6">
          <Link href="/admin" className="font-bold text-[#0f5238] uppercase tracking-widest text-lg hover:opacity-80 transition-opacity">
            PakStartups Admin
          </Link>
          <div className="relative w-full max-w-md hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#404943] text-lg">search</span>
            <input
              className="w-full bg-[#dee4e0] border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-[#0f5238] outline-none placeholder:text-[#404943]/60"
              placeholder="Search startups, users..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 text-[#404943]">
          <Link href="/" className="text-[#0f5238] border border-[#0f5238]/20 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#b1f0ce] transition-colors">
            ← Public Site
          </Link>
          <button className="p-1 hover:bg-[#e3eae6] rounded-full transition-colors hidden sm:block">
            <span className="material-symbols-outlined hover:text-[#0f5238]">notifications</span>
          </button>
          {/* Admin avatar dropdown */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#0f5238] flex items-center justify-center text-white text-xs font-black ring-2 ring-[#f5fbf7]">
              {profile?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.photoURL} alt="Admin" className="w-full h-full rounded-full object-cover" />
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

      <div className="flex flex-1 max-w-[1440px] mx-auto w-full">
        {/* SideNavBar */}
        <aside className="w-64 border-r border-[#bfc9c1]/20 flex flex-col pt-8 pb-6 px-4 hidden lg:flex bg-white">
          <nav className="flex-1 space-y-1">
            {sideNav.map((item) => {
              const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
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
          <div className="mt-auto pt-6 border-t border-[#bfc9c1]/20">
            <div className="px-3 py-2">
              <p className="text-xs font-bold text-[#404943] uppercase tracking-widest mb-1">Logged in as</p>
              <p className="text-sm font-bold text-[#002112] truncate">{displayName}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-[#0f5238] text-white text-[10px] font-bold rounded-full uppercase tracking-widest">Admin</span>
            </div>
          </div>
        </aside>

        {/* Content Canvas */}
        <main className="flex-1 w-full bg-white relative">
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
