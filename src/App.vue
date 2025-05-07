<script setup lang="ts">
import GameOption from "./components/GameOption.vue";
import ClaimButton from "./components/ClaimButton.vue";
import Countdown from "./components/Countdown.vue";
import { claimGenshinRewards, claimStarRailRewards, claimZenlessRewards } from "./scripts/claimable.ts";
import AutoClaimSetting from "./components/AutoClaimSetting.vue";
import NotificationDropdown from "./components/NotificationDropdown.vue";

function getImageUrl(name: string, ext: string): string {
  return new URL(`./assets/${name}.${ext}`, import.meta.url).href
}

function openGithubIssuesTab(): void {
  chrome.tabs.create({ url: "https://github.com/Axyss/HoyoDaily./issues" })
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
          Beta-0.4.0
        </span>
      </div>
    </div>
    <button class="text-base-content/40 hover:text-primary-content p-2 ml-auto rounded-full duration-200 cursor-pointer">
      <span class="size-5 icon-[lucide--settings]" />
    </button>
  </header>

  <div class="divider" />

  <nav class="tabs space-x-2 px-2 py-2 bg-base-100/60" role="tablist" >
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
      <div
        class="flex flex-col items-center justify-center h-full py-8 px-4">
        <div class="bg-primary/10 border border-primary/30 rounded-xl p-6 flex flex-col items-center max-w-xs text-center">
          <span class="icon-[lucide--history] size-16 text-primary/60 mb-4" />
          <h3 class="text-xl font-semibold text-primary-content mb-2">No History Yet</h3>
          <p class="text-base-content/60 text-sm mb-4">Your claimed rewards will appear here once you start collecting them.</p>
          <div class="flex items-center gap-2 text-base-content/60 text-sm">
            <span class="icon-[lucide--arrow-left]" />
            <span>Switch to Games tab to get started</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Games Tab Content -->
    <div id="main-tab" role="tabpanel" class="p-0 mt-0">
      <Suspense>
        <template #default>
          <div class="my-2">
            <GameOption name="Genshin Impact" :icon="getImageUrl('genshin-icon', 'webp')" :task="claimGenshinRewards" />
            <div class="divider px-4" />

            <GameOption name="Honkai Star Rail" :icon="getImageUrl('hsr-icon', 'webp')" :task="claimStarRailRewards" />
            <div class="divider px-4" />

            <GameOption name="Zenless Zone Zero" :icon="getImageUrl('zzz-icon', 'webp')" :task="claimZenlessRewards" />
          </div>
        </template>
        <template #fallback>
          <div class="loading loading-spinner loading-sm" />
        </template>
      </Suspense>

      <div class="divider" />

      <!-- Auto Claim Section -->
      <div class="px-4 py-3 bg-base-100/60">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="size-4 text-neutral icon-[lucide--clock]" />
            <span class="text-neutral text-sm">Next claim in:</span>
            <Countdown class="text-neutral font-mono font-medium text-sm"/>
          </div>

          <div class="tooltip [--placement:left] tooltip-toggle">
            <span class="text-base-content/40 duration-200 hover:text-base-content/60 size-4 icon-[lucide--circle-help] mt-1.5" />
            <div class="tooltip-content tooltip-shown:opacity-100 tooltip-shown:visible" role="popover">
              <div class="tooltip-body bg-base-100 text-base-content/80 rounded-lg p-2 text-start text-xs">
                Placeholder
              </div>
            </div>
          </div>
        </div>
        <Suspense>
          <template #default>
            <AutoClaimSetting />
          </template>
          <template #fallback>
            <div class="loading loading-spinner loading-sm" />
          </template>
        </Suspense>
      </div>

      <div class="divider" />
      <ClaimButton />
    </div>
  </main>

  <div class="divider" />

  <footer class="flex items-center justify-between px-4 py-2 text-xs text-base-content/50">
    <NotificationDropdown />
    <div @click="openGithubIssuesTab()" class="flex items-center gap-1 cursor-pointer hover:text-primary duration-200">
      <span class="size-3.5 icon-[lucide--github]"></span>
      <span>Report an issue</span>
    </div>
  </footer>
</template>

<style scoped></style>
