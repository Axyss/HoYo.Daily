<script setup lang="ts">
import { ref } from 'vue'
import GameOption from "./components/GameOption.vue";
import ClaimButton from "./components/ClaimButton.vue";
import Countdown from "./components/Countdown.vue";
import { claimGenshinRewards, claimStarRailRewards, claimZenlessRewards } from "./claimable.ts";
import AutoClaimSetting from "./components/AutoClaimSetting.vue";

const showTimerTooltip = ref(false)

function getImageUrl(name: string, ext: string): string {
  return new URL(`./assets/${name}.${ext}`, import.meta.url).href
}
</script>

<template>
    <header class="flex p-4 border-b border-primary/20">
      <div class="flex items-center gap-3 w-fit">
        <div class="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
          <div class="w-4 h-4 bg-white/90 rotate-45"></div>
        </div>
        <div class="flex items-center gap-2">
          <h1 class="text-xl font-bold text-primary-content">HoyoDaily</h1>
          <span class="px-2 py-0.5 bg-primary/20 text-primary border border-primary/70 text-xs rounded-full">
            Beta
          </span>
        </div>
      </div>
      <button class="text-gray-400 hover:text-primary-content p-2 ml-auto rounded-full">
        <span class="size-5 icon-[lucide--settings]" />
      </button>
    </header>

    <nav class="tabs space-x-2 px-4 py-2 border-b border-primary/20 bg-base-100/60" role="tablist" >
      <button type="button" class="btn btn-text flex-1 active-tab:bg-primary active-tab:text-white hover:text-primary active hover:bg-primary/20" data-tab="#main-tab" role="tab" >
        <span class="icon-[lucide--gamepad-2] size-5"></span>
        <span>Games</span>
      </button>
      <button type="button" class="btn btn-text flex-1 active-tab:bg-primary active-tab:text-white hover:text-primary hover:bg-primary/20" data-tab="#history-tab" role="tab" >
        <span class="icon-[lucide--history] size-5"></span>
        <span>History</span>
      </button>
    </nav>

    <!-- Tabs -->
    <main class="w-full">
      <!-- History Tab Content -->
      <div id="history-tab" role="tabpanel" class="p-4 hidden">
        <div class="flex items-center justify-center h-100 text-accent-content/50 text-lg">
          <span class="icon-[lucide--file]" />
          <span>&nbsp;So empty...</span>
        </div>
      </div>

      <!-- Games Tab Content -->
      <div id="main-tab" role="tabpanel" class="p-0 mt-0">
        <div class="my-2">
          <GameOption name="Genshin Impact" :icon="getImageUrl('genshin-icon', 'webp')" :task="claimGenshinRewards" />
          <GameOption name="Honkai Star Rail" :icon="getImageUrl('hsr-icon', 'png')" :task="claimStarRailRewards" />
          <GameOption name="Zenless Zone Zero" :icon="getImageUrl('zzz-icon', 'png')" :task="claimZenlessRewards" />
        </div>

        <!-- Auto Claim Section -->
        <div class="px-4 py-3 bg-base-100/60 border-t border-b border-primary/20">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="size-4 text-gray-400 icon-[lucide--clock]" />
              <span class="text-gray-300 text-sm">Next claim in:</span>
              <Countdown class="text-primary-content font-mono font-medium text-sm"/>
            </div>

            <div class="relative">
              <button
                @mouseenter="showTimerTooltip = true"
                @mouseleave="showTimerTooltip = false"
                class="h-6 w-6 text-gray-400 hover:text-gray-300"
              >
                <span class="size-4 icon-[lucide--circle-help]" />
              </button>
              <div
                v-if="showTimerTooltip"
                class="absolute right-full mr-2 top-0 bg-gray-800 text-primary-content text-xs p-2 rounded shadow-lg w-48"
              >
                Timer until the next daily rewards are available
              </div>
            </div>
          </div>
          <AutoClaimSetting />
        </div>
        <ClaimButton />
      </div>
    </main>

    <footer>
      <div class="flex items-center justify-between px-4 py-2 text-xs text-accent-content/50 border-t border-primary/20">
        <div class="flex items-center gap-1">
            <span class="size-3 icon-[lucide--bell-ring]" />
            <span>Notifications enabled</span>
        </div>
        <span>v1.0.0</span>
      </div>
    </footer>
</template>

<style scoped></style>
