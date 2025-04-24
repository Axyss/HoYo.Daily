import { getMinutesUntilNextMidnightUTC8, getStorage, setStorage } from "./utils.ts";
import { claimGenshinRewards, claimStarRailRewards, claimZenlessRewards } from "./claimable.ts";
import dayjs from "dayjs";

const ALARM_NAME: string = "auto-claim-alarm";
const CLAIM_FUNCTION_BINDINGS: Record<string, () => void> = {
  "Genshin Impact": claimGenshinRewards,
  "Honkai Star Rail": claimStarRailRewards,
  "Zenless Zone Zero": claimZenlessRewards
};

async function claimSelectedRewards() {
  try {
    for (const gameTitle in CLAIM_FUNCTION_BINDINGS) {
      const gameSettings = await getStorage(gameTitle);
      if (!gameSettings?.enabled) continue;

      console.log(`Claiming '${gameTitle}' rewards`);
      CLAIM_FUNCTION_BINDINGS[gameTitle]();
      await setStorage(gameTitle, { lastClaim: dayjs().unix() });
      await chrome.runtime.sendMessage({ type: "UPDATE", target: gameTitle });
    }
  } catch (error) {
    console.error("Unexpected error", error);
  } finally {
    await scheduleAlarm(ALARM_NAME);
  }
}

async function scheduleAlarm(alarmName: string) {
  if (await chrome.alarms.get(alarmName) == null) {
    await chrome.alarms.create(alarmName, {
      delayInMinutes: getMinutesUntilNextMidnightUTC8()
    })
    console.log(`Scheduling an alarm in ${getMinutesUntilNextMidnightUTC8()} minutes`)
  }
}

// Listeners
chrome.runtime.onInstalled.addListener(async (detail) => {
  console.log("Extension installed", detail);
  await scheduleAlarm(ALARM_NAME);
})

chrome.runtime.onStartup.addListener(async () => {
  console.log("Extension started");
  await scheduleAlarm(ALARM_NAME);
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;
  console.log(`Alarm '${alarm.name}' fired`);

  await claimSelectedRewards();
})
