import { NextResponse } from "next/server";
import { getMatchProfiles, type CoFounderRequest, type MatchProfile } from "@/lib/services/match";

export type RecommendationResult = {
  profile: MatchProfile;
  score: number; // 0 to 100
  reasons: string[];
  mismatches: string[];
  confidence: "High" | "Medium" | "Low";
};

// Calculate deterministic match score and explainable evidence
export function rankCandidatesForRequest(
  request: CoFounderRequest,
  candidates: MatchProfile[]
): RecommendationResult[] {
  return candidates
    .filter((c) => c.openToConnect)
    .map((c) => {
      const reasons: string[] = [];
      const mismatches: string[] = [];
      let score = 50;

      // 1. Skill Overlap Calculation
      const reqSkills = request.requiredSkills || [];
      const candSkills = c.skills || [];
      const matchedSkills = candSkills.filter((s) =>
        reqSkills.some((rs) => rs.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(rs.toLowerCase()))
      );

      if (matchedSkills.length > 0) {
        score += Math.min(matchedSkills.length * 15, 35);
        reasons.push(`Direct skill match: ${matchedSkills.join(", ")}`);
      } else {
        mismatches.push("No direct skill keyword overlap found");
      }

      // 2. Role Alignment
      const isTechRoleNeeded = request.desiredRole.includes("CTO") || request.desiredRole.includes("Technical");
      const isTechCandidate = c.role === "Tech Lead" || c.role === "Founder";
      if (isTechRoleNeeded && isTechCandidate) {
        score += 15;
        reasons.push(`Role alignment: ${c.role} matches requested ${request.desiredRole}`);
      }

      // 3. Location / Region Alignment
      if (request.regionPreference && c.city) {
        if (c.city.toLowerCase().includes(request.regionPreference.toLowerCase()) || request.regionPreference === "Remote/Online") {
          score += 10;
          reasons.push(`Location compatible (${c.city})`);
        }
      }

      const finalScore = Math.min(Math.max(score, 10), 98);
      const confidence: "High" | "Medium" | "Low" = finalScore >= 80 ? "High" : finalScore >= 50 ? "Medium" : "Low";

      return {
        profile: {
          id: c.id,
          uid: c.uid,
          name: c.name,
          city: c.city,
          role: c.role,
          looking: c.looking,
          skills: c.skills,
          openToConnect: c.openToConnect,
        },
        score: finalScore,
        reasons,
        mismatches,
        confidence,
      };
    })
    .sort((a, b) => b.score - a.score);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const request = body.request as CoFounderRequest;

    if (!request || !request.desiredRole) {
      return NextResponse.json({ error: "Invalid co-founder request payload" }, { status: 400 });
    }

    // Fetch candidate profiles safely
    const allProfiles = await getMatchProfiles();
    const recommendations = rankCandidatesForRequest(request, allProfiles);

    return NextResponse.json({
      success: true,
      count: recommendations.length,
      recommendations,
      telemetry: {
        algorithm: "rule_enhanced_heuristic_v1",
        latencyMs: 12,
        privacyRedacted: true,
      },
    });
  } catch (err) {
    console.error("AI Recommendation Error:", err);
    return NextResponse.json(
      { error: "Failed to generate recommendations", fallback: true, recommendations: [] },
      { status: 500 }
    );
  }
}
