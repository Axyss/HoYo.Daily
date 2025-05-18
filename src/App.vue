<script setup lang="ts">
import GameOption from "./components/GameOption.vue";
import ClaimButton from "./components/ClaimButton.vue";
import Countdown from "./components/Countdown.vue";
import {
  claimGenshinRewards,
  claimStarRailRewards,
  claimZenlessRewards,
} from "./scripts/claimable.ts";
import AutoClaimSetting from "./components/AutoClaimSetting.vue";
import NotificationDropdown from "./components/NotificationDropdown.vue";
import { onMounted } from "vue";
import ThemeSelector from "./components/ThemeSelector.vue";
import TooltipPopover from "./components/TooltipPopover.vue";

onMounted(() => {
  setTimeout(() => window.HSStaticMethods.autoInit(), 100);
});

const extensionVersion = chrome.runtime.getManifest().version;
function getImageUrl(name: string, ext: string): string {
  return new URL(`./assets/${name}.${ext}`, import.meta.url).href;
}

function openGithubIssuesTab(): void {
  chrome.tabs.create({ url: "https://github.com/Axyss/HoyoDaily./issues" });
}
</script>

<template>
  <header class="flex p-4">
    <div class="flex w-fit items-center gap-3">
      <div class="bg-primary flex h-8 w-8 items-center justify-center rounded-md">
        <div class="bg-primary-content h-4 w-4 rotate-45"></div>
      </div>
      <div class="flex items-center gap-2">
        <h1 class="text-base-content text-xl font-bold">HoyoDaily</h1>
      </div>
      <span
        class="bg-primary/20 text-primary border-primary/70 ml-auto rounded-full border px-2 py-0.5 text-xs font-medium"
      >
        <span class="icon-[lucide--box] size-3.5 align-bottom" />
        {{ extensionVersion }}
      </span>
    </div>
    <ThemeSelector />
  </header>

  <div class="divider" />

  <nav class="tabs bg-base-200/60 space-x-2 px-2 py-2" role="tablist">
    <button
      type="button"
      class="btn btn-text text-base-content/40 active-tab:bg-primary active-tab:text-primary-content hover:text-primary active hover:bg-primary/20 flex-1 rounded-md"
      data-tab="#main-tab"
      role="tab"
    >
      <span class="icon-[lucide--gamepad-2] size-5"></span>
      <span>Games</span>
    </button>
    <button
      type="button"
      class="btn btn-text text-base-content/40 active-tab:bg-primary active-tab:text-primary-content hover:text-primary hover:bg-primary/20 flex-1 rounded-md"
      data-tab="#history-tab"
      role="tab"
    >
      <span class="icon-[lucide--history] size-5"></span>
      <span>History</span>
    </button>
  </nav>

  <div class="divider" />

  <!-- Tabs -->
  <main class="w-full">
    <!-- History Tab Content -->
    <div id="history-tab" role="tabpanel" class="hidden p-4">
      <div class="flex h-full flex-col items-center justify-center px-4 py-8">
        <div
          class="bg-primary/10 border-primary/30 flex max-w-xs flex-col items-center rounded-xl border p-6 text-center"
        >
          <span class="icon-[lucide--history] text-primary/60 mb-4 size-16" />
          <h3 class="text-base-content mb-2 text-xl font-semibold">No History Yet</h3>
          <p class="text-base-content/60 mb-4 text-sm">
            Your claimed rewards will appear here once you start collecting them.
          </p>
          <div class="text-base-content/60 flex items-center gap-2 text-sm">
            <span class="icon-[lucide--arrow-left]" />
            <span>Switch to Games tab to get started</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Games Tab Content -->
    <div id="main-tab" role="tabpanel" class="mt-0 p-0">
      <Suspense>
        <template #default>
          <div class="my-2">
            <GameOption
              name="Genshin Impact"
              :icon="getImageUrl('genshin-icon', 'webp')"
              :task="claimGenshinRewards"
            />
            <div class="divider px-4" />

            <GameOption
              name="Honkai Star Rail"
              :icon="getImageUrl('hsr-icon', 'webp')"
              :task="claimStarRailRewards"
            />
            <div class="divider px-4" />

            <GameOption
              name="Zenless Zone Zero"
              :icon="getImageUrl('zzz-icon', 'webp')"
              :task="claimZenlessRewards"
            />
          </div>
        </template>
        <template #fallback>
          <div class="loading loading-spinner loading-sm" />
        </template>
      </Suspense>

      <div class="divider" />

      <!-- Auto Claim Section -->
      <div class="bg-base-200/60 px-4 py-3">
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="icon-[lucide--clock] size-4" />
            <span class="text-sm">Next claim in:</span>
            <Countdown class="font-mono text-sm font-medium" />
          </div>

          <!-- <div class="tooltip tooltip-toggle [--placement:left]">
            <span
              class="text-base-content/40 hover:text-base-content/60 icon-[lucide--circle-help] mt-1.5 size-4 duration-200"
            />
            <TooltipPopover class="mr-4">
              Rewards reset at <strong>12 a.m UTC +8</strong>
            </TooltipPopover>
          </div> -->
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

  <footer class="text-base-content/50 flex items-center justify-between px-4 py-2 text-xs">
    <Suspense>
      <template #default>
        <NotificationDropdown />
      </template>
      <template #fallback>
        <div class="loading loading-spinner loading-sm" />
      </template>
    </Suspense>
    <div
      @click="openGithubIssuesTab()"
      class="hover:text-primary flex cursor-pointer items-center gap-1 duration-200"
    >
      <span class="icon-[lucide--github] size-3.5"></span>
      <span>Report an issue</span>
    </div>
  </footer>
</template>

<style scoped></style>
