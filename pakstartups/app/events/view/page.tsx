import { redirect } from "next/navigation";

type LegacyEventViewPageProps = {
  searchParams: Promise<{
    id?: string | string[];
  }>;
};

export default async function LegacyEventViewPage({ searchParams }: LegacyEventViewPageProps) {
  const params = await searchParams;
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const eventId = rawId?.trim();

  if (!eventId) {
    redirect("/events");
  }

  redirect(`/events/${encodeURIComponent(eventId)}`);
}
