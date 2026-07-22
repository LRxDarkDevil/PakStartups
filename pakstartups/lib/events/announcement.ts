export const EVENT_ANNOUNCEMENT_DISMISSAL_MS = 24 * 60 * 60 * 1000;

export type AnnouncementTimestamp = {
  toMillis: () => number;
};

export type EventAnnouncementCandidate = {
  id?: string;
  dateTs?: AnnouncementTimestamp | null;
  status?: string;
  updateState?: string;
  isFeatured?: boolean;
  announcementStartTs?: AnnouncementTimestamp | null;
  announcementEndTs?: AnnouncementTimestamp | null;
  announcementPriority?: number;
};

function timestampMillis(value?: AnnouncementTimestamp | null) {
  return value?.toMillis() ?? null;
}

export function isEventAnnouncementEligible(
  event: EventAnnouncementCandidate,
  nowMs = Date.now(),
) {
  const eventStartsAt = timestampMillis(event.dateTs);
  const announcementStartsAt = timestampMillis(event.announcementStartTs);
  const announcementEndsAt = timestampMillis(event.announcementEndTs);

  return Boolean(
    event.id &&
      event.status === "approved" &&
      event.updateState !== "cancelled" &&
      eventStartsAt !== null &&
      eventStartsAt >= nowMs &&
      (announcementStartsAt === null || announcementStartsAt <= nowMs) &&
      (announcementEndsAt === null || announcementEndsAt >= nowMs),
  );
}

export function selectEventAnnouncement<T extends EventAnnouncementCandidate>(
  events: T[],
  nowMs = Date.now(),
): T | null {
  return (
    events
      .filter((event) => isEventAnnouncementEligible(event, nowMs))
      .sort((left, right) => {
        const featuredDifference =
          Number(Boolean(right.isFeatured)) - Number(Boolean(left.isFeatured));
        if (featuredDifference !== 0) return featuredDifference;

        const priorityDifference =
          (right.announcementPriority ?? 0) -
          (left.announcementPriority ?? 0);
        if (priorityDifference !== 0) return priorityDifference;

        return (
          (timestampMillis(left.dateTs) ?? Number.MAX_SAFE_INTEGER) -
          (timestampMillis(right.dateTs) ?? Number.MAX_SAFE_INTEGER)
        );
      })[0] ?? null
  );
}

export function getAnnouncementDismissedUntil(nowMs = Date.now()) {
  return nowMs + EVENT_ANNOUNCEMENT_DISMISSAL_MS;
}

export function isAnnouncementDismissed(
  dismissedUntil: string | null | undefined,
  nowMs = Date.now(),
) {
  if (!dismissedUntil) return false;
  const dismissedUntilMs = Number(dismissedUntil);
  return Number.isFinite(dismissedUntilMs) && dismissedUntilMs > nowMs;
}
