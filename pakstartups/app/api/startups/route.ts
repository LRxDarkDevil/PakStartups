import { NextRequest, NextResponse } from "next/server";
import { getStartups } from "@/lib/services/startups";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const city = searchParams.get("city");
  const stage = searchParams.get("stage");

  try {
    let results = await getStartups(category || undefined);
    if (city) results = results.filter((s) => s.city === city);
    if (stage) results = results.filter((s) => s.stage === stage);

    return NextResponse.json({ data: results, total: results.length });
  } catch (err) {
    console.error("Startups API error:", err);
    return NextResponse.json({ error: "Failed to fetch startups" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (process.env.ENABLE_PUBLIC_WRITES !== "true") {
      return NextResponse.json(
        { error: "Startup submission is temporarily disabled." },
        { status: 503 }
      );
    }

    const authorization = request.headers.get("authorization") || "";
    if (!authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const city = typeof body?.city === "string" ? body.city.trim() : "";
    const category = typeof body?.category === "string" ? body.category.trim() : "";
    const stage = typeof body?.stage === "string" ? body.stage.trim() : "";
    const desc = typeof body?.desc === "string" ? body.desc.trim() : "";
    const website = typeof body?.website === "string" ? body.website.trim() : "";

    if (!name || name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: "Invalid startup name" }, { status: 400 });
    }
    if (!city || city.length > 120) {
      return NextResponse.json({ error: "Invalid city" }, { status: 400 });
    }
    if (!category || category.length > 120) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    if (!stage || stage.length > 80) {
      return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
    }
    if (!desc || desc.length < 10 || desc.length > 500) {
      return NextResponse.json({ error: "Invalid description" }, { status: 400 });
    }
    if (website.length > 0 && website.length > 300) {
      return NextResponse.json({ error: "Invalid website" }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        id: "new-id",
        data: { name, city, category, stage, desc, website },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
