import type { Metadata } from "next";
import KnowledgeHubClient from "./KnowledgeHubClient";

export const metadata: Metadata = {
  title: "Knowledge Hub — PakStartups",
  description: "Everything you need to start, validate, and grow your startup in Pakistan.",
};

const sections = [
  { icon: "book_2", title: "Learning Guides", desc: "Step-by-step playbooks for founders navigating the early stages of Pakistani entrepreneurship.", cta: "Explore Guides" },
  { icon: "build", title: "Operational Toolkit", desc: "Ready-to-use templates, financial tools & calculators designed for local compliance and scaling.", cta: "Open Toolkit" },
  { icon: "bar_chart", title: "Market Intelligence", desc: "In-depth sector reports, consumer surveys & benchmarking data for the Pakistan market.", cta: "View Reports" },
  { icon: "account_balance", title: "Resource Directory", desc: "Access a curated list of grants, updated regulations & local investor directories.", cta: "Browse Resources" },
];

export default function KnowledgePage() {
  return <KnowledgeHubClient sections={sections.map((s) => ({ ...s, href: `/knowledge/${s.title === "Learning Guides" ? "guides" : s.title === "Operational Toolkit" ? "toolkit" : s.title === "Market Intelligence" ? "reports" : "directory" }` }))} />;
}
