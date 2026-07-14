import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Timing functions
dayjs.extend(utc);
dayjs.extend(timezone);

export function getSecondsUntilNextMidnightUTC8(): number {
  const now = dayjs().tz("Asia/Shanghai");
  const nextMidnight = now.add(1, "day").startOf("day");
  // Offset of 1 minute (00:01) to avoid issues with claiming at exactly midnight
  const nextMidnightOffset = nextMidnight.add(1, "minute");
  return nextMidnightOffset.add(1, "second").diff(now, "second");
}

export function getSecondsSinceLastMidnightUTC8(): number {
  const now = dayjs().tz("Asia/Shanghai");
  const lastMidnight = now.startOf("day");
  // Offset of 1 minute (00:01) to avoid issues with claiming at exactly midnight
  const lastMidnightOffset = lastMidnight.add(1, "minute");
  return now.diff(lastMidnightOffset, "second");
}

export function getMinutesUntilNextMidnightUTC8(): number {
  return getSecondsUntilNextMidnightUTC8() / 60;
}

export function happenedMoreThanADayAgo(epoch: number): boolean {
  return dayjs().unix() - epoch >= 86400;
}

export enum NotificationState {
  DISABLED = "disabled",
  MINIMAL = "minimal",
  ENABLED = "enabled",
}
