"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function B2BMatchesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/b2b");
  }, [router]);

  return null;
}
