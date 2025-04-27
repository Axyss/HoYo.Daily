import { getMinutesUntilNextMidnightUTC8, getStorage, setStorage } from "./utils.ts";
import { claimGenshinRewards, claimStarRailRewards, claimZenlessRewards } from "./claimable.ts";
import dayjs from "dayjs";
import { listenMessage, MessageType } from "./messaging.ts";

const ALARM_NAME: string = "auto-claim-alarm";
const CLAIM_FUNCTION_BINDINGS: Record<string, () => void> = {
  "Genshin Impact": claimGenshinRewards,
  "Honkai Star Rail": claimStarRailRewards,
  "Zenless Zone Zero": claimZenlessRewards
};

async function claimSelectedRewards() {
  for (const gameTitle in CLAIM_FUNCTION_BINDINGS) {
    const gameSettings = await getStorage(gameTitle);
    if (!gameSettings?.enabled) continue;

    console.log(`Claiming '${gameTitle}' rewards ${gameSettings.enabled}`);
    CLAIM_FUNCTION_BINDINGS[gameTitle]();
    gameSettings.lastClaim = dayjs().unix()
    await setStorage(gameTitle, gameSettings);
    // todo use the sendMessage wrapper
    await chrome.runtime.sendMessage({ type: "UPDATE", target: gameTitle });
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

// Browser listeners
chrome.runtime.onInstalled.addListener(async (detail) => {
  console.log("Extension installed", detail);
  await scheduleAlarm(ALARM_NAME);
})

chrome.runtime.onStartup.addListener(async () => {
  console.log("Extension started");
  await scheduleAlarm(ALARM_NAME);
})

// Alarm handler
chrome.alarms.onAlarm.addListener(async (alarm) => {
  try {
    if (alarm.name !== ALARM_NAME) return;
    if (!(await getStorage("Settings")).autoClaimEnabled) return;

    console.log(`Alarm '${alarm.name}' fired`);
    await claimSelectedRewards();
  } catch (error) {
    console.error("Unexpected error", error);
  } finally {
    await scheduleAlarm(ALARM_NAME);
  }
})

// Message listeners
listenMessage(MessageType.CLAIM, async () => {
  console.log("Claiming rewards manually");
  await claimSelectedRewards();
})