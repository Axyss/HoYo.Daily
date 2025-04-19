import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
type Config = Record<string, any>

// Persistance functions
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
