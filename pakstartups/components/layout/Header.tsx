"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/lib/context/AuthContext";
import { logout } from "@/lib/firebase/auth";
import EventAnnouncementBar from "./EventAnnouncementBar";
import NotificationMenu from "./NotificationMenu";

const navLinks = [
  { label: "Startup Directory", href: "/startups", icon: "rocket_launch" },
  { label: "Co Founder Matcher", href: "/match", icon: "handshake" },
  { label: "Ecosystem Map", href: "/ecosystem", icon: "hub" },
  // { label: "B2B Deals & Perks", href: "/b2b", icon: "storefront" },
  { label: "Knowledge Hub", href: "/knowledge", icon: "menu_book" },
  { label: "Events", href: "/events", icon: "event" },
  { label: "Contact Us", href: "/contact", icon: "mail" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const avatarUrl = profile?.photoURL || user?.photoURL;
  const displayName = profile?.fullName || user?.displayName || user?.email || "Account";
  const initials = displayName
    .split(" ")
    .map((word: string) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setImgError(false);
  }, [avatarUrl]);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    router.push("/");
  };

  const isActiveLink = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/studio")) {
    return null;
  }

  const mobileSidebar = (
    <div className="fixed inset-0 z-[100] md:hidden" role="dialog" aria-modal="true" aria-label="Site navigation">
      <button
        type="button"
        aria-label="Close navigation sidebar"
        className="absolute inset-0 bg-[#002112]/45 backdrop-blur-sm"
        onClick={() => setMobileOpen(false)}
      />

      <aside
        id="mobile-navigation-sidebar"
        className="relative flex h-dvh w-[min(22rem,88vw)] flex-col bg-[#e8ffee] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#0f5238]/10 px-6 py-5">
          <Link href="/" onClick={() => setMobileOpen(false)} className="inline-flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="PakStartups Logo"
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
            <span className="font-black text-[#0f5238] text-lg tracking-tight">PakStartups</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#0f5238] hover:bg-[#d5fde2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5238]"
            aria-label="Close navigation sidebar"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
          <nav className="space-y-1" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 rounded-xl px-4 py-3.5 text-base font-semibold transition-colors ${
                  isActiveLink(link.href)
                    ? "bg-[#0f5238] text-white shadow-sm"
                    : "text-[#2d6a4f] hover:bg-[#d5fde2] hover:text-[#0f5238]"
                }`}
              >
                <span className="material-symbols-outlined text-xl">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-[#0f5238]/10 bg-white/45 px-5 py-5">
          {loading ? (
            <div className="h-24 rounded-xl bg-[#d5fde2] animate-pulse" />
          ) : user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-white/80 p-3 border border-[#0f5238]/10">
                {avatarUrl && !imgError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[#0f5238] text-white text-xs font-black flex items-center justify-center">
                    {initials}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-bold text-[#002112]">{displayName}</p>
                  <p className="truncate text-xs text-[#707973]">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {profile?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-[#0f5238] px-4 py-3 font-bold text-white"
                  >
                    <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#0f5238]/20 bg-white px-3 py-3 font-bold text-[#0f5238]"
                >
                  <span className="material-symbols-outlined text-lg">dashboard</span>
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#0f5238]/20 bg-white px-3 py-3 font-bold text-[#0f5238]"
                >
                  <span className="material-symbols-outlined text-lg">settings</span>
                  Settings
                </Link>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 font-bold text-red-600 hover:bg-red-100"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="text-center py-3 border border-[#0f5238]/25 bg-white rounded-xl text-[#0f5238] font-bold"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMobileOpen(false)}
                className="text-center py-3 bg-[#0f5238] text-white rounded-xl font-bold shadow-sm"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      </aside>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-[#e8ffee]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(15,82,56,0.06)] font-['Plus_Jakarta_Sans'] antialiased text-sm font-medium">
      <EventAnnouncementBar />

      <nav className="flex justify-between items-center w-full px-5 sm:px-8 py-4 max-w-8xl mx-auto">
        <Link href="/" className="flex items-center gap-2 active:scale-95 transform transition-transform cursor-pointer">
          <Image
            src="/logo.png"
            alt="PakStartups Logo"
            width={36}
            height={36}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActiveLink(link.href)
                  ? "text-[#0f5238] font-bold border-b-2 border-[#0f5238] pb-1"
                  : "text-[#2d6a4f] hover:text-[#0f5238] hover:bg-[#d5fde2] rounded-lg transition-all px-2 py-1"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="w-9 h-9 rounded-full bg-[#d5fde2] animate-pulse" />
          ) : user ? (
            <>
              <NotificationMenu />
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#d5fde2] transition-all"
                  aria-expanded={dropdownOpen}
                  aria-label="Open account menu"
                >
                  {avatarUrl && !imgError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      referrerPolicy="no-referrer"
                      onError={() => setImgError(true)}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#0f5238] text-white text-xs font-black flex items-center justify-center">
                      {initials}
                    </div>
                  )}
                  <span className="text-[#002112] font-semibold text-sm hidden lg:block max-w-[100px] truncate">
                    {displayName.split(" ")[0]}
                  </span>
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
                        ...(profile?.role === "admin"
                          ? [{ label: "Admin Dashboard", icon: "admin_panel_settings", href: "/admin" }]
                          : []),
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
                        type="button"
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
            </>
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

        <button
          type="button"
          className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#0f5238] hover:bg-[#d5fde2] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5238]"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation sidebar"
          aria-controls="mobile-navigation-sidebar"
          aria-expanded={mobileOpen}
        >
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
      </nav>

      {mounted && mobileOpen ? createPortal(mobileSidebar, document.body) : null}
    </header>
  );
}
