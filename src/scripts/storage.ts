type StoredData = Record<string, any>

export async function getStorage(namespace: string | null): Promise<StoredData> {
  if (namespace == null)
    return (await chrome.storage.local.get(null)) || {};
  else {
    return (await chrome.storage.local.get(namespace))[namespace] || {};
  }
}

const locks: Record<string, Promise<void>> = {};

export async function setStorage(namespace: string, newData: StoredData): Promise<void> {
  locks[namespace] = (locks[namespace] || Promise.resolve())
    .then(async () => {
      try {
        const currentData = await getStorage(namespace);
        await chrome.storage.local.set({
          [namespace]: { ...currentData, ...newData }
        });
      } catch (error) {
        console.error(`[storage.ts]: Error in setStorage for namespace ${namespace}:`, error);
        throw error;
      }
    })
    .catch(error => {  // Prevents potential deadlocks
      console.error(`[storage.ts]: Lock error for namespace ${namespace}:`, error);
      delete locks[namespace];
      throw error;
    });
  await locks[namespace];  // Wait for the operation to complete
}
