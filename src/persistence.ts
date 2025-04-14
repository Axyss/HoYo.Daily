type Config = Record<string, any>

export async function getStorage(namespace: string): Promise<Config> {
     return (await chrome.storage.local.get(namespace))[namespace] || {}
}

export async function setStorage(namespace: string, config: Config): Promise<void> {
     await chrome.storage.local.set({ [namespace]: config })
}
