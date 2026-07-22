// scripts/seed-client.mjs
// Client-SDK seeder using the temporary open rule window.
// Run: DEMO_SEED_ENABLED=true DEMO_SEED_PROJECT_ID=<project-id> npx tsx scripts/seed-client.mjs
// This works only while Firestore rules allow the required writes.

import { initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore, serverTimestamp, Timestamp } from "firebase/firestore";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createCanonicalLocation } from "../lib/location.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../.env") });
dotenv.config({ path: join(__dirname, "../.env.local"), override: true });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const demoSeedEnabled = process.env.DEMO_SEED_ENABLED === "true";
const acknowledgedProjectId = process.env.DEMO_SEED_PROJECT_ID?.trim();

if (!firebaseConfig.projectId) {
  throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is required before demo seed validation can run.");
}

if (!demoSeedEnabled) {
  throw new Error(
    "Demo seeding is disabled. Set DEMO_SEED_ENABLED=true only for an intentional demo/test environment seed.",
  );
}

if (!acknowledgedProjectId || acknowledgedProjectId !== firebaseConfig.projectId) {
  throw new Error(
    `Refusing to seed project ${firebaseConfig.projectId}. Set DEMO_SEED_PROJECT_ID=${firebaseConfig.projectId} to acknowledge the exact target.`,
  );
}

console.log("Connecting to explicitly acknowledged demo project:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function isEmpty(col) {
  const snap = await getDocs(collection(db, col));
  return snap.empty;
}

async function seedIfEmpty(col, items) {
  if (!(await isEmpty(col))) {
    console.log(`⏭  ${col}: already has data, skipping.`);
    return;
  }

  for (const item of items) {
    await addDoc(collection(db, col), {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  console.log(`✅ ${col}: seeded ${items.length} documents.`);
}

const futureDate = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return Timestamp.fromDate(date);
};

const withLocation = (item, location = {}) => ({
  ...item,
  ...createCanonicalLocation(location),
  ...(location.city ? { city: location.city } : {}),
});

const asDemoStartup = (item) => ({
  ...item,
  recordType: "testimonial-demo",
  isDemo: true,
});

await seedIfEmpty("startups", [
  withLocation(asDemoStartup({ name: "FinFlow", desc: "Revolutionizing digital payments for underserved merchants across Punjab.", stage: "Growth", category: "FinTech", slug: "finflow", logo: "/images/image-055.jpg", ownerId: "seed", ownerName: "Ahmed Raza", status: "approved", views: 0 }), { city: "Lahore" }),
  withLocation(asDemoStartup({ name: "AgriSense", desc: "AI-powered soil analysis and weather forecasting for small-scale farmers.", stage: "MVP", category: "AgriTech", slug: "agrisense", logo: "/images/image-056.jpg", ownerId: "seed", ownerName: "Zain Farooq", status: "approved", views: 0 }), { city: "Faisalabad" }),
  withLocation(asDemoStartup({ name: "SehatLink", desc: "Connecting rural patients with top-tier specialists through video consults.", stage: "Scaling", category: "HealthTech", slug: "sehatlink", logo: "/images/image-057.jpg", ownerId: "seed", ownerName: "Sara Malik", status: "approved", views: 0 }), { city: "Karachi" }),
  withLocation(asDemoStartup({ name: "EduPeak", desc: "Gamified learning platform tailored for the national curriculum of Pakistan.", stage: "Growth", category: "EdTech", slug: "edupeak", logo: "/images/image-058.jpg", ownerId: "seed", ownerName: "Hina Khan", status: "approved", views: 0 }), { city: "Islamabad" }),
  withLocation(asDemoStartup({ name: "ZippyCart", desc: "Ultra-fast grocery delivery service operating in metropolitan hubs.", stage: "Scaling", category: "E-Commerce", slug: "zippycart", logo: "/images/image-059.jpg", ownerId: "seed", ownerName: "Osman Ali", status: "approved", views: 0 }), { city: "Lahore" }),
  withLocation(asDemoStartup({ name: "SaaSFlow", desc: "Simplified ERP solutions for small to medium scale manufacturing units.", stage: "Idea", category: "SaaS", slug: "saasflow", logo: "/images/image-060.jpg", ownerId: "seed", ownerName: "Bilal Rauf", status: "approved", views: 0 }), { city: "Sialkot" }),
  withLocation(asDemoStartup({ name: "CloudOps PK", desc: "Affordable cloud infrastructure management for local tech agencies.", stage: "Growth", category: "SaaS", slug: "cloudops-pk", logo: "/images/image-061.jpg", ownerId: "seed", ownerName: "Madiha Ali", status: "approved", views: 0 }), { city: "Karachi" }),
  withLocation(asDemoStartup({ name: "VoltCharge", desc: "Building a nationwide network of EV charging stations in major cities.", stage: "MVP", category: "Cleantech", slug: "voltcharge", logo: "/images/image-062.jpg", ownerId: "seed", ownerName: "Ahmed Khan", status: "approved", views: 0 }), { city: "Islamabad" }),
  withLocation(asDemoStartup({ name: "LendCare", desc: "Peer-to-peer lending platform focusing on student and medical micro-loans.", stage: "Growth", category: "FinTech", slug: "lendcare", logo: "/images/image-063.jpg", ownerId: "seed", ownerName: "Fatima Jinnah", status: "approved", views: 0 }), { city: "Peshawar" }),
]);

await seedIfEmpty("ideas", [
  { title: "AgriTech Supply Chain Optimizer", desc: "Connecting small-scale farmers directly to urban markets using AI-driven logistics.", stage: "VALIDATION STAGE", tags: ["Logistics", "AI/ML"], authorId: "seed", authorName: "Ahmed K.", authorAvatar: "/images/image-018.jpg", ownerId: "seed", upvotes: 42, comments: 12, status: "active" },
  { title: "EduLink Remote Tutoring", desc: "A low-bandwidth video platform specifically for rural education where 4G signals are weak.", stage: "PROBLEM DEFINED", tags: ["EdTech", "Social Impact"], authorId: "seed", authorName: "Zainab S.", authorAvatar: "/images/image-019.jpg", ownerId: "seed", upvotes: 28, comments: 5, status: "active" },
  { title: "SolarShare Neighborhood Grid", desc: "Peer-to-peer excess solar energy trading platform for residential housing societies.", stage: "SOLUTION MVP", tags: ["Energy", "Blockchain"], authorId: "seed", authorName: "Omar F.", authorAvatar: "/images/image-020.jpg", ownerId: "seed", upvotes: 56, comments: 24, status: "active" },
  { title: "CareCart Health Delivery", desc: "Verified prescription medicine delivery service with temperature-controlled transit.", stage: "SCALING", tags: ["HealthTech", "Pharma"], authorId: "seed", authorName: "Sana M.", authorAvatar: "/images/image-021.jpg", ownerId: "seed", upvotes: 112, comments: 38, status: "active" },
]);

await seedIfEmpty("blogPosts", [
  { title: "How I Built Pakistan's First AgriTech Platform With Zero Funding", excerpt: "A deep dive into challenges of scaling in rural Sindh and unconventional strategies to achieve product-market fit.", category: "Founder Journey", authorId: "seed", authorName: "Fatima Khan", authorAvatar: "/images/image-025.jpg", cover: "/images/image-026.jpg", readTime: "12 min read", status: "approved", isFeatured: true, content: "" },
  { title: "Scaling a Fintech Startup for the Unbanked Population", excerpt: "How we reached 50,000 users without a single paid ad.", category: "Case Study", authorId: "seed", authorName: "Ahmed Ali", authorAvatar: "/images/image-028.jpg", cover: "/images/image-027.jpg", readTime: "8 min read", status: "approved", isFeatured: false, content: "" },
  { title: "The Eco-Friendly Revolution: From Karachi to the World", excerpt: "Building sustainable products for a growing global market.", category: "Founder Journey", authorId: "seed", authorName: "Sara Sheikh", authorAvatar: "/images/image-030.jpg", cover: "/images/image-029.jpg", readTime: "15 min read", status: "approved", isFeatured: false, content: "" },
  { title: "5 Mistakes We Made While Hiring Our First Engineering Team", excerpt: "Hard lessons from our early hiring failures and what we would do differently.", category: "Lessons Learned", authorId: "seed", authorName: "Zaid Munir", authorAvatar: "/images/image-032.jpg", cover: "/images/image-031.jpg", readTime: "6 min read", status: "approved", isFeatured: false, content: "" },
  { title: "Optimizing Supply Chains for the E-commerce Boom", excerpt: "Reducing last-mile delivery costs by 30% using localized hubs.", category: "Case Study", authorId: "seed", authorName: "Hames Javed", authorAvatar: "/images/image-034.jpg", cover: "/images/image-033.jpg", readTime: "10 min read", status: "approved", isFeatured: false, content: "" },
  { title: "From Freelancer to Agency Owner: A 5-Year Roadmap", excerpt: "Building a team of 40 designers from a solo Fiverr profile.", category: "Founder Journey", authorId: "seed", authorName: "Nida Malik", authorAvatar: "/images/image-036.jpg", cover: "/images/image-035.jpg", readTime: "20 min read", status: "approved", isFeatured: false, content: "" },
]);

await seedIfEmpty("events", [
  withLocation({ title: "Friday Founder Pitch Night #24", desc: "Watch 5 curated startups pitch to investors.", type: "PITCHING", location: "Online · Zoom", isOnline: true, organizerId: "seed", organizerName: "PakStartups Lab", dateTs: futureDate(7), dateLabel: "Friday · 8:00 PM PKT", rsvpCount: 284, status: "approved", isFeatured: true }, { regionId: "remote-online" }),
  withLocation({ title: "SaaS Growth Masterclass", desc: "A hands-on workshop on building scalable SaaS products.", type: "WORKSHOP", location: "LUMS, Lahore · Hybrid", isOnline: false, organizerId: "seed", organizerName: "Zahra Khan", dateTs: futureDate(14), dateLabel: "May 2 · 6:00 PM PKT", rsvpCount: 142, status: "approved", isFeatured: false }, { city: "Lahore" }),
  withLocation({ title: "Founder Coffee: Karachi", desc: "Casual morning coffee meetup for Karachi-based founders.", type: "MEETUP", location: "Coffee Wagera, Karachi", isOnline: false, organizerId: "seed", organizerName: "Bilal Ahmed", dateTs: futureDate(17), dateLabel: "May 5 · 10:00 AM PKT", rsvpCount: 45, status: "approved", isFeatured: false }, { city: "Karachi" }),
  withLocation({ title: "AgriTech Demo Day", desc: "Top AgriTech startups presenting live products.", type: "DEMO", location: "Islamabad · Online", isOnline: true, organizerId: "seed", organizerName: "Ali Hassan", dateTs: futureDate(24), dateLabel: "May 12 · 7:00 PM PKT", rsvpCount: 312, status: "approved", isFeatured: false }, { regionId: "remote-online", city: "Islamabad" }),
]);

await seedIfEmpty("b2bDemands", [
  { title: "Scalable E-commerce MVP Development", desc: "Looking for a full-stack team to build a headless commerce platform.", category: "Tech & Dev", tags: ["FinTech", "MVP Stage"], budget: "PKR 150k–300k", deadline: "15 Days", ownerId: "seed", ownerName: "Ahmed Raza, CEO", ownerAvatar: "/images/image-006.jpg", icon: "code", status: "active" },
  { title: "B2B Content Strategy & Ghostwriting", desc: "Need a content lead to manage LinkedIn presence.", category: "Marketing", tags: ["Logistics", "Post-Seed"], budget: "PKR 50k–80k / mo", deadline: "Open", ownerId: "seed", ownerName: "Sara Malik, CMO", ownerAvatar: "/images/image-007.jpg", icon: "campaign", status: "active" },
  { title: "Financial Modeling for Series A Funding", desc: "Seeking a fractional CFO to prepare 3-year projections.", category: "Finance", tags: ["AgriTech", "Series A"], budget: "PKR 200k–500k", deadline: "30 Days", ownerId: "seed", ownerName: "Zain Farooq, Founder", ownerAvatar: "/images/image-008.jpg", icon: "payments", status: "active" },
  { title: "Rebranding & Visual Identity Package", desc: "Complete brand overhaul including logo and marketing collateral.", category: "Design", tags: ["EdTech", "Scale-up"], budget: "PKR 100k–150k", deadline: "21 Days", ownerId: "seed", ownerName: "Hina Khan, Ops Lead", ownerAvatar: "/images/image-009.jpg", icon: "brush", status: "active" },
]);

await seedIfEmpty("matchProfiles", [
  withLocation({ uid: "seed-1", name: "Ahmed Khan", role: "Founder", looking: "A technical co-founder to build a sustainable agri-tech marketplace.", skills: ["Product", "AgriTech", "Strategy"], openToConnect: true }, { city: "Lahore" }),
  withLocation({ uid: "seed-2", name: "Sara Ahmed", role: "Tech Lead", looking: "Scale-up opportunities in Fintech. Passionate about blockchain security.", skills: ["React Native", "FinTech", "Web3"], openToConnect: true }, { city: "Karachi" }),
  withLocation({ uid: "seed-3", name: "Zain Malik", role: "Student", looking: "Early-stage mentorship and a chance to build the MVP for a logistics startup.", skills: ["Python", "Logistics", "MVP"], openToConnect: true }, { city: "Islamabad" }),
  withLocation({ uid: "seed-4", name: "Fatima Jinnah", role: "Founder", looking: "Growth hackers and marketing wizards for an e-commerce fashion venture.", skills: ["Marketing", "E-commerce", "Branding"], openToConnect: true }, { city: "Lahore" }),
  withLocation({ uid: "seed-5", name: "Bilal Rauf", role: "Freelancer", looking: "Operations and supply chain projects in the textile sector.", skills: ["Operations", "Supply Chain", "Textiles"], openToConnect: true }, { city: "Faisalabad" }),
  withLocation({ uid: "seed-6", name: "Madiha Ali", role: "Founder", looking: "CFO partner for a social enterprise focused on financial literacy for women.", skills: ["Finance", "Social Impact", "EdTech"], openToConnect: true }, { city: "Lahore" }),
]);

console.log("\n🎉 Demo seeding complete for acknowledged project:", firebaseConfig.projectId);
process.exit(0);
