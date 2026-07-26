import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, category, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!discordWebhookUrl || !discordWebhookUrl.trim()) {
      console.error("DISCORD_WEBHOOK_URL is not set in environment variables.");
      return NextResponse.json(
        { error: "Discord webhook is not configured. Please set DISCORD_WEBHOOK_URL in .env" },
        { status: 500 }
      );
    }

    const ticketId = `PS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const payload = {
      username: "PakStartups Contact Bot",
      avatar_url: "https://pakstartups.org/logo.png",
      content: `📬 **New Contact Form Submission**`,
      embeds: [
        {
          title: subject ? `📌 ${subject.trim()}` : `📩 New Inquiry from ${name.trim()}`,
          color: 0x5865f2, // Discord Blurple
          fields: [
            { name: "👤 Sender Name", value: name.trim(), inline: true },
            { name: "✉️ Email Address", value: email.trim(), inline: true },
            { name: "🏷️ Category", value: category || "General Support", inline: true },
            ...(subject ? [{ name: "📌 Subject", value: subject.trim(), inline: false }] : []),
            { name: "💬 Message Details", value: message.trim(), inline: false },
          ],
          footer: { text: `Ref: ${ticketId} • PakStartups Contact Form` },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const res = await fetch(discordWebhookUrl.trim(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Discord Webhook delivery failed:", res.status, errText);
      return NextResponse.json(
        { error: `Discord Webhook delivery failed (Status ${res.status}).` },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, id: ticketId });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Failed to send message to Discord." },
      { status: 500 }
    );
  }
}
