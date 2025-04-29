import { getMinutesUntilNextMidnightUTC8, getSecondsSinceLastMidnightUTC8, getStorage, setStorage } from "./utils.ts";
import { claimGenshinRewards, claimStarRailRewards, claimZenlessRewards } from "./claimable.ts";
import dayjs from "dayjs";
import { listenMessage, MessageType, sendMessage } from "./messaging.ts";

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

    console.log(`[${gameTitle}]: Claiming rewards`);
    CLAIM_FUNCTION_BINDINGS[gameTitle]();
    gameSettings.lastClaim = dayjs().unix() - getSecondsSinceLastMidnightUTC8();
    await setStorage(gameTitle, gameSettings);
    await sendMessage({ type: MessageType.UPDATE, target: gameTitle })
  }
}

async function scheduleAlarm(alarmName: string) {
  if (await chrome.alarms.get(alarmName) == null) {
    await chrome.alarms.create(alarmName, {
      delayInMinutes: getMinutesUntilNextMidnightUTC8()
    })
    console.log(`[HoyoDaily]: Scheduling an alarm in ${getMinutesUntilNextMidnightUTC8()} minutes`)
  }
}

// Browser listeners
chrome.runtime.onInstalled.addListener(async (detail) => {
  console.log("[HoyoDaily]: Extension installed", detail);
  await scheduleAlarm(ALARM_NAME);
})

chrome.runtime.onStartup.addListener(async () => {
  console.log("[HoyoDaily]: Extension started");
  await scheduleAlarm(ALARM_NAME);
})

// Alarm handlers
chrome.alarms.onAlarm.addListener(async (alarm) => {
  try {
    if (alarm.name !== ALARM_NAME) return;
    if (!(await getStorage("Settings")).autoClaimEnabled) return;

    console.log(`[HoyoDaily]: Alarm '${alarm.name}' fired`);
    await claimSelectedRewards();
  } catch (error) {
    console.error("[HoyoDaily]: Unexpected error", error);
  } finally {
    await scheduleAlarm(ALARM_NAME);
  }
})

// Message listeners
listenMessage(MessageType.CLAIM, async () => {
  if ((await getStorage("Settings")).autoClaimEnabled) {
    console.log("[HoyoDaily]: Claiming due UI interaction");
    await claimSelectedRewards();
  }
})

listenMessage(MessageType.MANUAL_CLAIM, async () => {
  console.log("[HoyoDaily]: Claiming manually");
  await claimSelectedRewards();
})
