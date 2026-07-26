import { NextResponse } from "next/server";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function POST(req: Request) {
  try {
    const { name, email, message, category } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Store durable support message in Firestore
    const docRef = await addDoc(collection(db, "supportMessages"), {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      category: category || "General Support",
      status: "open",
      createdAt: serverTimestamp(),
    });

    // 2. Dispatch to Discord Webhook if configured
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (discordWebhookUrl) {
      try {
        await fetch(discordWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [
              {
                title: `📩 New Support Inquiry: ${name.trim()}`,
                color: 0x0f5238, // Emerald
                fields: [
                  { name: "Sender Name", value: name.trim(), inline: true },
                  { name: "Email", value: email.trim(), inline: true },
                  { name: "Category", value: category || "General Support", inline: true },
                  { name: "Message", value: message.trim() },
                ],
                footer: { text: `Ticket ID: ${docRef.id} · PakStartups Bot` },
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        });
      } catch (webhookErr) {
        console.warn("Discord webhook delivery failed, message stored in Firestore", webhookErr);
      }
    }

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
