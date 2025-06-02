import {
  getMinutesUntilNextMidnightUTC8,
  getSecondsSinceLastMidnightUTC8,
  happenedMoreThanADayAgo,
  NotificationState,
} from "./utils.ts";
import dayjs from "dayjs";
import { listenMessage, MessageType, sendMessage } from "./messaging.ts";
import { addHistoryEntry, getStorage, setStorage } from "./storage.ts";
import { gameInstances } from "./claimable.ts";

const DAILY_ALARM_NAME: string = "daily-claim-alarm";
const INSTANT_ALARM_NAME: string = "instant-claim-alarm";

// Browser listeners
chrome.runtime.onInstalled.addListener(async (detail) => {
  console.log("[background.ts]: Extension installed", detail);
  setTimeout(async () => {
    await scheduleAlarm(INSTANT_ALARM_NAME, { when: dayjs().unix() });
  }, 3000);
});

chrome.runtime.onStartup.addListener(async () => {
  console.log("[background.ts]: Extension started");
  setTimeout(async () => {
    await scheduleAlarm(INSTANT_ALARM_NAME, { when: dayjs().unix() });
  }, 3000);
});

// Alarm handling
async function scheduleAlarm(alarmName: string, alarmInfo: object) {
  const existingAlarm = await chrome.alarms.get(alarmName);
  if (existingAlarm == null) {
    await chrome.alarms.create(alarmName, alarmInfo);
    console.log(`[background.ts]: Scheduling ${alarmName}`);
  }
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  try {
    console.log(`[background.ts]: Alarm triggered: ${alarm.name}`);
    if (!(await getStorage("Settings")).autoClaimEnabled) {
      console.log(`[background.ts]: Auto-claim is disabled, skipping automatic claim process`);
      return;
    }
    await claimSelectedGames();
  } catch (error) {
    console.error("[background.ts]: Unexpected error", error);
  } finally {
    await scheduleAlarm(DAILY_ALARM_NAME, {
      delayInMinutes: getMinutesUntilNextMidnightUTC8(),
    });
  }
});

// Claiming logic
async function claimSelectedGames(onlyIncludeGames: string[] = []) {
  let success = 0,
    failed = 0;

  // Won't work well if onlyIncludeGames.length > 1 (Not a problem for now)
  await sendMessage({
    type: MessageType.CLAIMING,
    target: onlyIncludeGames.length === 0 ? "all" : onlyIncludeGames.join(""),
  });

  for (const game of gameInstances) {
    const gameSettings = await getStorage(game.name);
    if (!gameSettings?.enabled) continue;
    if (!happenedMoreThanADayAgo(gameSettings.lastClaim)) continue;
    if (onlyIncludeGames.length > 0 && !onlyIncludeGames.includes(game.name)) continue;

    console.log(`[background.ts]: Attempting to claim rewards for ${game.name}`);
    const response = await game.claimRewards();
    console.log(`[background.ts]: Claim response for ${game.name}:`, response);

    if (response.retcode >= 0 || response.retcode === -5003) {
      success++;
      await claimSuccess(game.name, gameSettings);
      await addHistoryEntry({
        game: game.name,
        itemIndex: (await game.getClaimCount()) - 1,
        timestamp: dayjs().unix(),
      });
    } else if (response.retcode === -100) {
      failed++;
      await claimError(game.name, gameSettings, "Log in to Hoyolab first");
    } else {
      failed++;
      await claimError(game.name, gameSettings, response.message);
    }
  }
  await sendMessage({ type: MessageType.HISTORY_UPDATE });
  return success > 0 && failed === 0;
}

async function claimSuccess(gameTitle: string, gameSettings: any) {
  console.log(`[background.ts]: Successfully claimed rewards for ${gameTitle}`);
  gameSettings.lastClaim = dayjs().unix() - getSecondsSinceLastMidnightUTC8();
  gameSettings.lastError = null;
  await setStorage(gameTitle, gameSettings);
  await sendMessage({ type: MessageType.CLAIM_SUCCESS, target: gameTitle });

  const notificationSetting = (await getStorage("Settings")).notificationState;
  if (NotificationState.ENABLED === notificationSetting) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon128.png",
      title: "HoYoDaily - Daily Rewards",
      message: `✅ Successfully claimed rewards for ${gameTitle}!`,
      requireInteraction: false,
    });
  }
}

async function claimError(gameTitle: string, gameSettings: any, errorMessage: string) {
  console.error(
    `[background.ts]: Failed to claim rewards for ${gameTitle}. Error: ${errorMessage}`,
  );
  gameSettings.lastError = errorMessage;
  await setStorage(gameTitle, gameSettings);
  await sendMessage({
    type: MessageType.CLAIM_ERROR,
    target: gameTitle,
    content: errorMessage,
  });

  const notificationSetting = (await getStorage("Settings")).notificationState;
  if ([NotificationState.ENABLED, NotificationState.MINIMAL].includes(notificationSetting)) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon128.png",
      title: "HoYoDaily - Daily Rewards",
      message: `⚠️ Oops! We encountered an error while claiming rewards for ${gameTitle}.\n\nReason: ${errorMessage}.`,
      requireInteraction: false,
    });
  }
}

// Message listeners
listenMessage(MessageType.UI_CLAIM, async (response) => {
  if ((await getStorage("Settings")).autoClaimEnabled) {
    console.log("[background.ts]: Claiming due UI interaction");
    if (response.target === "all") {
      await claimSelectedGames(); // confetti inconsistency (?)
    } else {
      await claimSelectedGames([response.target]);
    }
  }
});

listenMessage(MessageType.MANUAL_CLAIM, async () => {
  console.log("[background.ts]: Claiming manually");
  if (await claimSelectedGames()) {
    // No errors occurred
    await sendMessage({ type: MessageType.MANUAL_CLAIM_SUCCESS });
  } else {
    await sendMessage({ type: MessageType.MANUAL_CLAIM_ERROR });
  }
});
