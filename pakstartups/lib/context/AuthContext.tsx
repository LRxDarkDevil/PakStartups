// lib/context/AuthContext.tsx
// Global Firebase Auth state provider — wraps the entire app.

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";

export type UserProfile = {
  uid: string;
  email: string;
  fullName: string;
  photoURL: string | null;
  role: string;
  city: string;
  bio: string;
  skills: string[];
  interests?: string[];
  socialLinks: Record<string, string>;
  savedMatchProfileIds?: string[];
  savedStartupIds?: string[];
  savedOrganizationIds?: string[];
  savedB2BIds?: string[];
  savedEventIds?: string[];
  savedIdeaIds?: string[];
  notificationPrefs?: Record<string, boolean>;
  privacyPrefs?: Record<string, string>;
};

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubSnapshot: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      
      if (unsubSnapshot) {
        unsubSnapshot();
        unsubSnapshot = null;
      }

      if (firebaseUser) {
        unsubSnapshot = onSnapshot(
          doc(db, "users", firebaseUser.uid),
          (docSnap) => {
            if (docSnap.exists()) {
              setProfile({ uid: firebaseUser.uid, ...docSnap.data() } as UserProfile);
            }
            setLoading(false);
          },
          (e) => {
            console.error("[AuthContext] Failed to load profile:", e);
            setLoading(false);
          }
        );
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubSnapshot) unsubSnapshot();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
