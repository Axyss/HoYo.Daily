import { createApp } from 'vue'
import './assets/style.css'
import App from './App.vue'

createApp(App).mount('#app')

export function claimGenshinReward(): Promise<any> {
    return fetch("https://sg-hk4e-api.hoyolab.com/event/sol/sign", {
        method: "POST",
        body: JSON.stringify({act_id: "e202102251931481"}),
    })
}