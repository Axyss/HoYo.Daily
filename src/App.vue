<script setup lang="ts">
import GameOption from "./components/GameOption.vue";
import ClaimButton from "./components/ClaimButton.vue";
import Countdown from "./components/Countdown.vue";
import AutoClaimSetting from "./components/AutoClaimSetting.vue";
import NotificationDropdown from "./components/NotificationDropdown.vue";
import { onMounted } from "vue";
import ThemeSelector from "./components/ThemeSelector.vue";
import HistoryTab from "./components/HistoryTab.vue";

onMounted(async () => {
  setTimeout(() => window.HSStaticMethods.autoInit(), 100);
});

const extensionVersion = chrome.runtime.getManifest().version;
function getImageUrl(name: string, ext: string): string {
  return new URL(`./assets/${name}.${ext}`, import.meta.url).href;
}

function openGithubReleasesTab(): void {
  chrome.tabs.create({ url: "https://github.com/Axyss/HoYoDaily./releases" });
}

function openGithubIssuesTab(): void {
  chrome.tabs.create({ url: "https://github.com/Axyss/HoYoDaily./issues" });
}
</script>

<template>
  <header class="flex p-4">
    <div class="flex w-fit items-center gap-3">
      <div class="bg-primary flex h-8 w-8 items-center justify-center rounded-md">
        <div class="bg-primary-content h-4 w-4 rotate-45"></div>
      </div>
      <div class="flex items-center gap-2">
        <h1 class="text-base-content text-xl font-bold">HoYoDaily</h1>
      </div>
      <div
        @click="openGithubReleasesTab()"
        class="bg-primary/10 dark:bg-primary/20 text-primary border-primary/70 ml-auto cursor-pointer rounded-full border px-2 py-0.5 text-xs font-semibold duration-200 hover:shadow-[0_0_10px_rgba(0,0,0,0.15)] hover:shadow-[#7033ff]"
      >
        <span class="icon-[lucide--box] size-3.5 align-bottom" />
        {{ extensionVersion }}
      </div>
    </div>
    <Suspense>
      <template #default>
        <ThemeSelector />
      </template>
      <template #fallback>
        <div class="loading loading-spinner loading-sm" />
      </template>
    </Suspense>
  </header>

  <div class="divider" />

  <nav class="tabs bg-base-200/60 space-x-2 px-2 py-2" role="tablist">
    <button
      type="button"
      class="btn btn-text text-base-content/50 active-tab:bg-primary active-tab:text-primary-content hover:text-primary active hover:bg-primary/20 flex-1 rounded-md"
      data-tab="#main-tab"
      role="tab"
    >
      <span class="icon-[lucide--gamepad-2] size-5"></span>
      <span class="font-semibold">Games</span>
    </button>
    <button
      type="button"
      class="btn btn-text text-base-content/50 active-tab:bg-primary active-tab:text-primary-content hover:text-primary hover:bg-primary/20 flex-1 rounded-md"
      data-tab="#history-tab"
      role="tab"
    >
      <span class="icon-[lucide--history] size-5"></span>
      <span class="font-semibold">History</span>
    </button>
  </nav>

  <div class="divider" />

  <!-- Tabs -->
  <main class="w-full">
    <!-- HistoryTab Tab Content -->
    <div
      id="history-tab"
      role="tabpanel"
      class="scrollbar scrollbar-thumb-primary scrollbar-w-1 hidden h-[410px] overflow-y-scroll p-4 pr-3 dark:h-[412px]"
    >
      <Suspense>
        <template #default>
          <HistoryTab />
        </template>
        <template #fallback>
          <div class="loading loading-spinner loading-sm" />
        </template>
      </Suspense>
    </div>

    <!-- Games Tab Content -->
    <div id="main-tab" role="tabpanel" class="mt-0 p-0">
      <Suspense>
        <template #default>
          <div class="scrollbar scrollbar-thumb-primary scrollbar-w-1 max-h-48.5 overflow-y-scroll">
            <GameOption name="Genshin Impact" :icon="getImageUrl('genshin-icon', 'webp')" />
            <div class="divider px-4" />
            <GameOption name="Honkai Star Rail" :icon="getImageUrl('hsr-icon', 'webp')" />
            <div class="divider px-4" />
            <GameOption name="Zenless Zone Zero" :icon="getImageUrl('zzz-icon', 'webp')" />
            <div class="divider px-4" />
            <GameOption name="Honkai Impact 3rd" :icon="getImageUrl('hi3rd-icon', 'webp')" />
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

  <footer
    class="text-base-content/60 dark:text-base-content/50 flex items-center justify-between px-4 py-2 text-xs"
  >
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
