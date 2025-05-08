import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Timing functions
dayjs.extend(utc);
dayjs.extend(timezone);

export function getSecondsUntilNextMidnightUTC8(): number {
  const now = dayjs().tz("Asia/Shanghai");
  const nextMidnight = now.add(1, "day").startOf("day");
  return nextMidnight.add(1, "second").diff(now, "second");
}

export function getSecondsSinceLastMidnightUTC8(): number {
  const now = dayjs().tz("Asia/Shanghai");
  const lastMidnight = now.startOf("day");
  return now.diff(lastMidnight, "second");
}

export function getMinutesUntilNextMidnightUTC8(): number {
  return getSecondsUntilNextMidnightUTC8() / 60;
}

export function happenedMoreThanADayAgo(epoch: number): boolean {
  return (dayjs().unix() - epoch) >= 86400
}

// Notification functions
export function showErrorNotification(gameTitle: string, reason: string): void {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon.png",
    title: "HoyoDaily - Daily Rewards",
    message: `⚠️ Oops! We encountered an error while claiming rewards for ${gameTitle}.\n\nReason: ${reason}.`,
    requireInteraction: false
  });
}
