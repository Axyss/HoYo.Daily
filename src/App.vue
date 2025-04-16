<script setup lang="ts">
import { ref } from 'vue'
import GameOption from "./components/GameOption.vue";
import ClaimButton from "./components/ClaimButton.vue";

const autoClaimEnabled = ref(false)
const showTimerTooltip = ref(false)
const showAutoClaimTooltip = ref(false)


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
        <GameOption name="Genshin Impact" :icon="getImageUrl('genshin-icon', 'webp')" />
        <GameOption name="Honkai Star Rail" :icon="getImageUrl('hsr-icon', 'png')" />
        <GameOption name="Zenless Zone Zero" :icon="getImageUrl('zzz-icon', 'png')" />

        <!-- Auto Claim Section -->
        <div class="mt-4 px-4 py-3 bg-base-100/60 border-t border-b border-primary/20">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="size-4 text-gray-400 icon-[lucide--clock]" />
              <span class="text-gray-300">Next claim in:</span>
              <span class="text-primary-content font-mono font-medium">03:00:17</span>
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

          <div class="flex items-center justify-between bg-primary/20 p-3 rounded-lg border border-primary/70">
            <div class="flex flex-col">
              <div class="flex items-center gap-2">
                <span class="text-primary-content font-medium">Auto Claim</span>
                <div class="relative">
                  <button
                    @mouseenter="showAutoClaimTooltip = true"
                    @mouseleave="showAutoClaimTooltip = false"
                    class="h-5 w-5 text-gray-400 hover:text-gray-300"
                  >
                    <span class="h-3.5 w-3.5 icon-[lucide--info]" />
                  </button>
                  <div
                    v-if="showAutoClaimTooltip"
                    class="absolute left-full ml-2 top-0 bg-gray-800 text-primary-content text-xs p-2 rounded shadow-lg w-64 z-10"
                  >
                    When enabled, rewards will be automatically claimed for all active games as soon as they become available
                  </div>
                </div>
              </div>
              <span class="text-xs text-gray-400">Claim rewards automatically when available</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                class="sr-only peer"
                v-model="autoClaimEnabled"
              >
              <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
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
