// app/api/match/route.ts
// GET /api/match — browse match profiles from Firestore

import { NextRequest, NextResponse } from "next/server";
import { getMatchProfiles } from "@/lib/services/match";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") ?? undefined;
  const locationFilter = searchParams.get("region") ?? searchParams.get("city") ?? undefined;

  try {
    const results = await getMatchProfiles(role, locationFilter);
    return NextResponse.json({ data: results, total: results.length });
  } catch (error) {
    console.error("Match API error:", error);
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }
}
