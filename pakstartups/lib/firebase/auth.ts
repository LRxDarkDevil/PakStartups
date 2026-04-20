// lib/firebase/auth.ts
// Auth helper functions used across client components

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";

const googleProvider = new GoogleAuthProvider();

// ─── Email / Password ─────────────────────────────────────────────────────────

export async function registerWithEmail(
  email: string,
  password: string,
  fullName: string
) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await createUserProfile(cred.user, { fullName });
  return cred.user;
}

export async function loginWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// ─── Google OAuth ─────────────────────────────────────────────────────────────

export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  const isNew = cred.operationType === "signIn";
  if (isNew) {
    await createUserProfile(cred.user, {
      fullName: cred.user.displayName ?? "",
    });
  }
  return cred.user;
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function logout() {
  await signOut(auth);
}

// ─── Auth state listener ──────────────────────────────────────────────────────

export function onAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// ─── User Profile ─────────────────────────────────────────────────────────────

async function createUserProfile(user: User, extra: { fullName: string }) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      fullName: extra.fullName,
      photoURL: user.photoURL ?? null,
      role: "founder",
      city: "",
      bio: "",
      skills: [],
      socialLinks: {},
      savedMatchProfileIds: [],
      savedStartupIds: [],
      savedOrganizationIds: [],
      savedB2BIds: [],
      savedEventIds: [],
      savedIdeaIds: [],
      notificationPrefs: {
        email: true,
        matches: true,
        b2b: true,
        events: true,
      },
      privacyPrefs: {
        profileVisibility: "Public",
        emailVisibility: "Hidden",
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}
