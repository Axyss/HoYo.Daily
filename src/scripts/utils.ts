import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
type Config = Record<string, any>

// Persistence functions
export async function getStorage(namespace: string | null): Promise<Config> {
     if (namespace == null)
          return (await chrome.storage.local.get(null)) || {}
     else {
          return (await chrome.storage.local.get(namespace))[namespace] || {}
     }
}

export async function setStorage(namespace: string, config: Config): Promise<void> {
     await chrome.storage.local.set({ [namespace]: config })
}

// Timing functions
dayjs.extend(utc);
dayjs.extend(timezone);

export function getSecondsUntilNextMidnightUTC8(): number {
     const now = dayjs().tz("Asia/Shanghai");
     const nextMidnight = now.add(1, "day").startOf("day");
     return nextMidnight.diff(now, "second");
}

export function getSecondsSinceLastMidnightUTC8(): number {
     const now = dayjs().tz("Asia/Shanghai");
     const lastMidnight = now.startOf("day");
     return now.diff(lastMidnight, "second");
}

export function getMinutesUntilNextMidnightUTC8(): number {
     return Math.ceil(getSecondsUntilNextMidnightUTC8() / 60);
}

export function happenedMoreThanADayAgo(epoch: number): boolean {
     return (dayjs().unix() - epoch) > 86400
}
