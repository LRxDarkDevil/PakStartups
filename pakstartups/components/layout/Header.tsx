"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { logout } from "@/lib/firebase/auth";

const navLinks = [
  { label: "Directory", href: "/startups" },
  { label: "Ecosystem", href: "/ecosystem" },
  { label: "Matchmaking", href: "/match" },
  { label: "B2B", href: "/b2b" },
  { label: "Knowledge Hub", href: "/knowledge" },
  { label: "Blog", href: "/blog" },
  { label: "Events", href: "/events" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    router.push("/");
  };

  const displayName = profile?.fullName || user?.displayName || user?.email || "Account";
  const initials = displayName.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#e8ffee]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(15,82,56,0.06)] font-['Plus_Jakarta_Sans'] antialiased text-sm font-medium">
      <nav className="flex justify-between items-center w-full px-8 py-4 max-w-8xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 active:scale-95 transform transition-transform cursor-pointer">
          <Image
            src="/logo.png"
            alt="PakStartups Logo"
            width={140}
            height={36}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive
                  ? "text-[#0f5238] font-bold border-b-2 border-[#0f5238] pb-1"
                  : "text-[#2d6a4f] hover:text-[#0f5238] hover:bg-[#d5fde2] rounded-lg transition-all px-2 py-1"}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="w-9 h-9 rounded-full bg-[#d5fde2] animate-pulse" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#d5fde2] transition-all"
              >
                {profile?.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.photoURL} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#0f5238] text-white text-xs font-black flex items-center justify-center">
                    {initials}
                  </div>
                )}
                <span className="text-[#002112] font-semibold text-sm hidden lg:block max-w-[100px] truncate">{displayName.split(" ")[0]}</span>
                <span className="material-symbols-outlined text-sm text-[#707973]">expand_more</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-2xl border border-[#e0e0e0] overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-[#f0f0f0]">
                    <p className="font-bold text-[#002112] text-sm truncate">{displayName}</p>
                    <p className="text-xs text-[#707973] truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    {[
                      { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
                      { label: "My Profile", icon: "person", href: `/profile/${user.uid}` },
                      { label: "Settings", icon: "settings", href: "/settings" },
                      { label: "Notifications", icon: "notifications", href: "/notifications" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#f5faf6] text-[#404943] hover:text-[#0f5238] transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">{item.icon}</span>
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-[#f0f0f0] py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">logout</span>
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="px-5 py-2 text-[#2d6a4f] hover:bg-[#d5fde2] rounded-lg transition-all duration-300 active:scale-95">
                Sign In
              </Link>
              <Link href="/auth/signup" className="px-5 py-2 bg-[#0f5238] text-white font-bold rounded-lg shadow-[0_8px_24px_rgba(15,82,56,0.15)] hover:opacity-90 active:scale-95 transform transition-all">
                Join Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[#d5fde2] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <span className="material-symbols-outlined text-[#0f5238]">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#e8ffee] border-t border-[#c4ecd2] px-8 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-[#2d6a4f] font-medium hover:text-[#0f5238] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-center py-3 border border-[#bfc9c1] rounded-lg text-[#0f5238] font-bold">Dashboard</Link>
                <button onClick={handleLogout} className="py-3 bg-red-50 text-red-600 rounded-lg font-bold">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-center py-3 border border-[#bfc9c1] rounded-lg text-[#0f5238] font-bold">Sign In</Link>
                <Link href="/auth/signup" className="text-center py-3 bg-[#0f5238] text-white rounded-lg font-bold">Join Now</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
