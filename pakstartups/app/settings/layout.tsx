"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { icon: "person", label: "Profile", path: "/settings" },
  { icon: "interests", label: "Skills & Interests", path: "/settings/skills" },
  { icon: "share", label: "Social Accounts", path: "/settings/social" },
  { icon: "notifications", label: "Notifications", path: "/settings/notifications" },
  { icon: "lock", label: "Privacy", path: "/settings/privacy" },
  { icon: "security", label: "Security", path: "/settings/security" },
  { icon: "cancel", label: "Danger Zone", path: "/settings/danger", danger: true },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-[#002112]">Account Settings</h1>
        <p className="text-[#404943] mt-1">Manage your digital presence and account preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-left transition-all ${
                    isActive
                      ? "bg-[#d5fde2] text-[#0f5238] font-bold"
                      : item.danger
                      ? "text-red-600 hover:bg-red-50"
                      : "text-[#404943] hover:bg-[#f5f5f5]"
                  }`}
                >
                  <span className={`material-symbols-outlined text-lg ${isActive ? "text-[#0f5238]" : item.danger ? "text-red-600" : "text-[#707973]"}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content Canvas */}
        <div className="flex-1 w-full relative">
            {children}
        </div>
      </div>
    </div>
  );
}
