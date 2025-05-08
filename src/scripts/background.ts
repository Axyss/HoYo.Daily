import {
  getMinutesUntilNextMidnightUTC8,
  getSecondsSinceLastMidnightUTC8,
  happenedMoreThanADayAgo, NotificationState
} from "./utils.ts";
import { claimGenshinRewards, claimStarRailRewards, claimZenlessRewards } from "./claimable.ts";
import dayjs from "dayjs";
import { listenMessage, MessageType, sendMessage } from "./messaging.ts";
import { getStorage, setStorage } from "./storage.ts";

const DAILY_ALARM_NAME: string = "daily-claim-alarm";
const INSTANT_ALARM_NAME: string = "instant-claim-alarm";

const CLAIM_FUNCTION_BINDINGS: Record<string, () => Promise<any>> = {
  "Genshin Impact": claimGenshinRewards,
  "Honkai Star Rail": claimStarRailRewards,
  "Zenless Zone Zero": claimZenlessRewards
};

// Browser listeners
chrome.runtime.onInstalled.addListener(async (detail) => {
  console.log("[HoyoDaily]: Extension installed", detail);
  await scheduleAlarm(INSTANT_ALARM_NAME, {when: dayjs().unix()});
})

chrome.runtime.onStartup.addListener(async () => {
  console.log("[HoyoDaily]: Extension started");
  await scheduleAlarm(INSTANT_ALARM_NAME, {when: dayjs().unix()});
})

// Alarm handling
async function scheduleAlarm(alarmName: string, alarmInfo: Object) {
  if (await chrome.alarms.get(alarmName) == null) {
    await chrome.alarms.create(alarmName, alarmInfo)
    console.log(`[HoyoDaily]: Scheduling ${alarmName}`)
  }
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  try {
    if (!(await getStorage("Settings")).autoClaimEnabled) return;

    console.log(`[HoyoDaily]: Alarm '${alarm.name}' fired`);
    await claimSelectedRewards();
  } catch (error) {
    console.error("[HoyoDaily]: Unexpected error", error);
  } finally {
    await scheduleAlarm(DAILY_ALARM_NAME, {
      delayInMinutes: getMinutesUntilNextMidnightUTC8()
    });
  }
})

// Claiming logic
async function claimSelectedRewards() {
  let noErrors: boolean = true;
  await sendMessage({ type: MessageType.CLAIMING, target: "all" })

  for (const gameTitle in CLAIM_FUNCTION_BINDINGS) {
    const gameSettings = await getStorage(gameTitle);
    if (!gameSettings?.enabled) continue;
    if (!happenedMoreThanADayAgo(gameSettings.lastClaim)) continue;

    const response = await CLAIM_FUNCTION_BINDINGS[gameTitle]();
    const content = await response.json();
    console.log(`[${gameTitle}]: Claiming rewards`);
    console.log(content);

    if (content.retcode >= 0 || content.retcode === -5003) {
      await claimSuccess(gameTitle, gameSettings);
    } else {
      await claimError(gameTitle, gameSettings, content.message);
    }
  }
  return noErrors;
}

async function claimSuccess(gameTitle: string, gameSettings: any) {
  gameSettings.lastClaim = dayjs().unix() - getSecondsSinceLastMidnightUTC8();
  gameSettings.lastError = null;
  await setStorage(gameTitle, gameSettings);
  await sendMessage({ type: MessageType.CLAIM_SUCCESS, target: gameTitle })

  const notificationSetting = (await getStorage("Settings")).notificationState;
  if (NotificationState.ENABLED === notificationSetting) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "HoyoDaily - Daily Rewards",
      message: `✅ Successfully claimed rewards for ${gameTitle}!`,
      requireInteraction: false
    });
  }
}

async function claimError(gameTitle: string, gameSettings: any, errorMessage: string) {
  gameSettings.lastError = errorMessage;
  await setStorage(gameTitle, gameSettings);
  await sendMessage({ type: MessageType.CLAIM_ERROR, target: gameTitle, content: errorMessage })

  const notificationSetting = (await getStorage("Settings")).notificationState;
  if ([NotificationState.ENABLED, NotificationState.MINIMAL].includes(notificationSetting)) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "HoyoDaily - Daily Rewards",
      message: `⚠️ Oops! We encountered an error while claiming rewards for ${gameTitle}.\n\nReason: ${errorMessage}.`,
      requireInteraction: false
    });
  }
}

// Message listeners
listenMessage(MessageType.UI_CLAIM, async () => {
  if ((await getStorage("Settings")).autoClaimEnabled) {
    console.log("[HoyoDaily]: Claiming due UI interaction");
    await claimSelectedRewards()  // confetti inconsistency
  }
})

listenMessage(MessageType.MANUAL_CLAIM, async () => {
  console.log("[HoyoDaily]: Claiming manually");
  if ((await claimSelectedRewards())) {
    await sendMessage({ type: MessageType.CLAIM_SUCCESS })
  }
})
