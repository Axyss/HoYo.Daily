<script setup lang="ts">
import { ref } from 'vue'
import GameOption from "./components/GameOption.vue";
import ClaimButton from "./components/ClaimButton.vue";
import Countdown from "./components/Countdown.vue";
import { claimGenshinRewards, claimStarRailRewards, claimZenlessRewards } from "./scripts/claimable.ts";
import AutoClaimSetting from "./components/AutoClaimSetting.vue";

const showTimerTooltip = ref(false)

function getImageUrl(name: string, ext: string): string {
  return new URL(`./assets/${name}.${ext}`, import.meta.url).href
}
</script>

<template>
  <header class="flex p-4">
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
    <button class="text-base-content/40 hover:text-primary-content p-2 ml-auto rounded-full">
      <span class="size-5 icon-[lucide--settings]" />
    </button>
  </header>

  <div class="divider" />

  <nav class="tabs space-x-2 px-4 py-2 bg-base-100/60" role="tablist" >
    <button type="button" class="btn btn-text flex-1 text-base-content/60 active-tab:bg-primary active-tab:text-base-content hover:text-primary active hover:bg-primary/20" data-tab="#main-tab" role="tab" >
      <span class="icon-[lucide--gamepad-2] size-5"></span>
      <span>Games</span>
    </button>
    <button type="button" class="btn btn-text flex-1 text-base-content/60 active-tab:bg-primary active-tab:text-base-content hover:text-primary hover:bg-primary/20" data-tab="#history-tab" role="tab" >
      <span class="icon-[lucide--history] size-5"></span>
      <span>History</span>
    </button>
  </nav>

  <div class="divider" />

  <!-- Tabs -->
  <main class="w-full">
    <!-- History Tab Content -->
    <div id="history-tab" role="tabpanel" class="p-4 hidden">
      <div class="flex items-center justify-center h-100 text-base-content/50 text-lg">
        <span class="icon-[lucide--file]" />
        <span>&nbsp;So empty...</span>
      </div>
    </div>

    <!-- Games Tab Content -->
    <div id="main-tab" role="tabpanel" class="p-0 mt-0">
      <div class="my-2">
        <GameOption name="Genshin Impact" :icon="getImageUrl('genshin-icon', 'webp')" :task="claimGenshinRewards" />
        <div class="divider px-4" />

        <GameOption name="Honkai Star Rail" :icon="getImageUrl('hsr-icon', 'webp')" :task="claimStarRailRewards" />
        <div class="divider px-4" />

        <GameOption name="Zenless Zone Zero" :icon="getImageUrl('zzz-icon', 'webp')" :task="claimZenlessRewards" />
      </div>

      <div class="divider" />

      <!-- Auto Claim Section -->
      <div class="px-4 py-3 bg-base-100/60">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="size-4 text-neutral icon-[lucide--clock]" />
            <span class="text-neutral text-sm">Next claim in:</span>
            <Countdown class="text-neutral font-mono font-medium text-sm"/>
          </div>

          <div class="relative">
            <button
              @mouseenter="showTimerTooltip = true"
              @mouseleave="showTimerTooltip = false"
              class="h-6 w-6 text-base-content/40 hover:text-base-content/60"
            >
              <span class="size-4 icon-[lucide--circle-help]" />
            </button>
            <div
              v-if="showTimerTooltip"
              class="absolute right-full mr-2 top-0 bg-base-300 text-primary-content text-xs p-2 rounded shadow-lg w-48"
            >
              Timer until the next daily rewards are available
            </div>
          </div>
        </div>
        <AutoClaimSetting />
      </div>

      <div class="divider" />
      <ClaimButton />
    </div>
  </main>

  <div class="divider" />

  <footer>
    <div class="flex items-center justify-between px-4 py-2 text-xs text-base-content/50">
      <div class="flex items-center gap-1">
          <span class="size-3 icon-[lucide--bell-ring]" />
          <span>Notifications enabled</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="size-3.5 icon-[lucide--github]"></span>
        <span>Report an issue</span>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
