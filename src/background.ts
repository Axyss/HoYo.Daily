import { getMinutesUntilNextMidnightUTC8, getSecondsUntilNextMidnightUTC8 } from "./utils.ts";
import { claimGenshinReward, claimStarRailReward, claimZenlessReward } from "./claimable.ts";

const ALARM_NAME: string = "auto-claim-alarm";
const BINDINGS: Record<string, () => void> = {
  "Genshin Impact": claimGenshinReward,
  "Honkai Star Rail": claimStarRailReward,
  "Zenless Zone Zero": claimZenlessReward
};

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
  console.log("Installed", detail);
  await scheduleAlarm(ALARM_NAME);
})

chrome.runtime.onStartup.addListener(async () => {
  console.log("Started");
  await scheduleAlarm(ALARM_NAME);
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) {
    return
  }

  console.log("Alarm fired: ", alarm);
  try {
    for (let game in BINDINGS) {
      const gameSettings = await chrome.storage.local.get(game)
      if (gameSettings.enabled) {
        console.log(`Claiming ${game} rewards`)
        BINDINGS[game]();
      }
    }
  } catch (error) {
    console.error("Unexpected error", error);
  } finally {
    await scheduleAlarm(ALARM_NAME);
  }
})
