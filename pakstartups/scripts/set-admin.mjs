// scripts/set-admin.mjs
// Sets a user's role to 'admin'. Uses CLIENT SDK — temporarily opens rules.
// Usage: node scripts/set-admin.mjs <uid>
// ------ Run while temporarily open rules or use firebase emulator ------

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });
dotenv.config({ path: join(__dirname, "../.env.local") });

const uid = process.argv[2];
if (!uid) { console.error("Usage: node scripts/set-admin.mjs <uid>"); process.exit(1); }

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

const db = getFirestore(app);
const ref = doc(db, "users", uid);

await setDoc(ref, { uid, role: "admin", updatedAt: new Date().toISOString() }, { merge: true });
console.log(`✅ User ${uid} is now an admin.`);
process.exit(0);
