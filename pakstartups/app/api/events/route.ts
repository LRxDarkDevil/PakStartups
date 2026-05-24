import { NextRequest, NextResponse } from "next/server";
import { getUpcomingEvents, getPastEvents, getWeeklyMeetups } from "@/lib/services/events";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    let results;
    if (type === "past") {
      results = await getPastEvents();
    } else if (type === "meetups") {
      results = await getWeeklyMeetups();
    } else {
      results = await getUpcomingEvents();
    }
    return NextResponse.json({ data: results, total: results.length });
  } catch (err) {
    console.error("Events API error:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (process.env.ENABLE_PUBLIC_WRITES !== "true") {
      return NextResponse.json(
        { error: "Event creation is temporarily disabled." },
        { status: 503 }
      );
    }

    const authorization = request.headers.get("authorization") || "";
    if (!authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const date = typeof body?.date === "string" ? body.date.trim() : "";
    const type = typeof body?.type === "string" ? body.type.trim() : "";
    const location = typeof body?.location === "string" ? body.location.trim() : "";

    if (!title || title.length < 5 || title.length > 200) {
      return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
    if (!type || type.length > 80) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
    if (!location || location.length > 200) {
      return NextResponse.json({ error: "Invalid location" }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        id: "new-event-id",
        data: { title, date, type, location },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
