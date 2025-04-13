import { reactive } from 'vue'

export const configTemplate = {
    genshin: {
        enabled: true,
    },
    hsr: {
        enabled: true,
    },
    zzz: {
        enabled: true,
    }
}
export const config = reactive(configTemplate)

chrome.storage.local.set(configTemplate)

type Config = Record<string, any>
let configSingleton: Config | null = null

export async function getConfig(): Promise<Config> {
    if (configSingleton) return configSingleton

    const data: Config = await new Promise((resolve) => {
        chrome.storage.local.get(null, (result) => {
            resolve(result)
        })
    })
    configSingleton = reactive({...configTemplate, ...data})
    return configSingleton
}


