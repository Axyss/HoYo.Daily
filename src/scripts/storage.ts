import dayjs from "dayjs";

type StoredData = Record<string, any>;
export type HistoryDataEntry = {
  game: string;
  itemIndex: number;
  timestamp: number;
};
const locks: Record<string, Promise<void>> = {};

export async function getStorage(namespace: string | null): Promise<StoredData> {
  if (namespace == null) return (await chrome.storage.local.get(null)) || {};
  else {
    return (await chrome.storage.local.get(namespace))[namespace] || {};
  }
}

export async function setStorage(namespace: string, newData: StoredData): Promise<void> {
  locks[namespace] = (locks[namespace] || Promise.resolve())
    .then(async () => {
      try {
        const currentData = await getStorage(namespace);
        await chrome.storage.local.set({
          [namespace]: { ...currentData, ...newData },
        });
      } catch (error) {
        console.error(`[storage.ts]: Error in setStorage for namespace ${namespace}:`, error);
        throw error;
      }
    })
    .catch((error) => {
      // Prevents potential deadlocks
      console.error(`[storage.ts]: Lock error for namespace ${namespace}:`, error);
      delete locks[namespace];
      throw error;
    });
  await locks[namespace]; // Wait for the operation to complete
}

export async function addHistoryEntry(entry: HistoryDataEntry): Promise<void> {
  const midnight = dayjs().startOf("day").valueOf();
  const historyData = await getStorage("History");
  const todayHistory: HistoryDataEntry[] = historyData[midnight] || [];
  todayHistory.push(entry);
  await setStorage("History", { [midnight]: todayHistory });
  console.log(`[storage.ts]: Adding new entry to the history: ${historyData[midnight]}`);
}
