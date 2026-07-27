"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const CARD_DESTINATIONS = {
  "Total Startups": { href: "/admin?tab=manage", tab: "manage" },
  "Pending Approval": { href: "/admin?tab=queue", tab: "queue" },
  "Pending Events": { href: "/admin/events" },
  "Total Users": { href: "/admin/users" },
} as const;

type DashboardTab = "queue" | "manage";
type CardLabel = keyof typeof CARD_DESTINATIONS;

function activateDashboardTab(tab: DashboardTab) {
  const expectedText = tab === "manage" ? "Manage Startups" : "Approval Queue";
  const tabButton = Array.from(document.querySelectorAll<HTMLButtonElement>("main button")).find(
    (button) => button.textContent?.includes(expectedText),
  );

  tabButton?.click();
}

function enhanceDashboardCards(root: HTMLElement) {
  const labels = Object.keys(CARD_DESTINATIONS) as CardLabel[];

  root.querySelectorAll<HTMLParagraphElement>("p").forEach((labelElement) => {
    const label = labelElement.textContent?.trim() as CardLabel | undefined;
    if (!label || !labels.includes(label)) return;

    const card = labelElement.closest<HTMLElement>(".rounded-xl");
    if (!card || card.dataset.adminStatCard) return;

    card.dataset.adminStatCard = label;
    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Open ${label}`);
    card.classList.add(
      "cursor-pointer",
      "transition-all",
      "hover:-translate-y-0.5",
      "hover:shadow-md",
      "focus:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-[#0f5238]",
      "focus-visible:ring-offset-2",
    );
  });
}

export default function AdminTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== "/admin") return;

    const root = document.querySelector<HTMLElement>("main");
    if (!root) return;

    const openCardDestination = (card: HTMLElement) => {
      const label = card.dataset.adminStatCard as CardLabel | undefined;
      if (!label) return;

      const destination = CARD_DESTINATIONS[label];
      router.push(destination.href);

      if ("tab" in destination) {
        requestAnimationFrame(() => activateDashboardTab(destination.tab));
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const card = target.closest<HTMLElement>("[data-admin-stat-card]");
      if (card) openCardDestination(card);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const target = event.target as HTMLElement;
      const card = target.closest<HTMLElement>("[data-admin-stat-card]");
      if (!card) return;

      event.preventDefault();
      openCardDestination(card);
    };

    const activateRequestedTab = () => {
      const tab = new URLSearchParams(window.location.search).get("tab");
      if (tab === "manage" || tab === "queue") {
        requestAnimationFrame(() => activateDashboardTab(tab));
      }
    };

    enhanceDashboardCards(root);
    activateRequestedTab();

    const observer = new MutationObserver(() => enhanceDashboardCards(root));
    observer.observe(root, { childList: true, subtree: true });

    root.addEventListener("click", handleClick);
    root.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", activateRequestedTab);

    return () => {
      observer.disconnect();
      root.removeEventListener("click", handleClick);
      root.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", activateRequestedTab);
    };
  }, [pathname, router]);

  return children;
}
