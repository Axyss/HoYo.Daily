type Config = Record<string, any>

export async function getConfig(namespace: string): Promise<Config> {
    return new Promise((resolve) => {
        chrome.storage.local.get(namespace, (result) => {
            resolve(result[namespace])
        })
    })
}

export async function setConfig(namespace: string, config: Config): Promise<void> {
     new Promise(() => {
        chrome.storage.local.set({ [namespace]: [config] }, () => {})
    })
}
