"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { createCanonicalLocation, isRegionId } from "@/lib/location";
import { useAuth } from "./AuthContext";

function PostHogIdentity() {
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user) {
      const location = createCanonicalLocation({
        regionId: isRegionId(profile?.regionId) ? profile.regionId : undefined,
        city: profile?.city,
      });

      posthog.identify(user.uid, {
        email: user.email,
        name: profile?.fullName ?? user.displayName ?? undefined,
        role: profile?.role ?? "user",
        country: location.country,
        country_code: location.countryCode,
        region_id: location.regionId,
        region: location.region,
        city: location.city,
      });
    } else {
      posthog.reset();
    }
  }, [user, profile]);

  return null;
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      process.env.NEXT_PUBLIC_POSTHOG_KEY &&
      !posthog.__loaded
    ) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: false,
        capture_pageleave: true,
        autocapture: true,
        session_recording: {
          maskAllInputs: true,
        },
        loaded: (ph) => {
          if (process.env.NODE_ENV === "development") ph.debug();
        },
      });
    }
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <PostHogIdentity />
      {children}
    </PostHogProvider>
  );
}
