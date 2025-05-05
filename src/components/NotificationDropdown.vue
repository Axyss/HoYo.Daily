<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { getStorage, setStorage } from "../scripts/utils.ts";

enum NotificationState {
  DISABLED = "disabled",
  MINIMAL = "minimal",
  FULL = "full"
}

const notificationState = ref<NotificationState>(NotificationState.FULL);

onBeforeMount(async () => {
  const settings = await getStorage("Settings");
  if (settings && settings.notificationState !== undefined) {
    notificationState.value = settings.notificationState as NotificationState;
  }
});

async function setNotificationState(state: NotificationState) {
  notificationState.value = state;
  await setStorage("Settings", { notificationState: notificationState.value });
}
</script>

<template>
  <div class="dropdown relative inline-flex">
    <button id="notification-dropdown" type="button" class="dropdown-toggle flex items-center gap-1.5 cursor-pointer hover:text-primary duration-200 px-2 py-1 rounded-lg hover:bg-primary/10 transition-all" aria-haspopup="menu" aria-expanded="false" aria-label="Notification Settings">
      <span class="size-3.5 icon-[lucide--bell-ring]" :class="{ 
        'text-primary animate-ring': notificationState === NotificationState.FULL,
        'text-warning': notificationState === NotificationState.MINIMAL,
        'text-base-content/50': notificationState === NotificationState.DISABLED
      }" />
      <span class="text-xs">Notifications {{
        notificationState === NotificationState.FULL ? 'enabled' : 
        notificationState === NotificationState.MINIMAL ? 'minimal' : 
        'disabled' 
      }}</span>
      <span class="size-3 icon-[lucide--chevron-up] dropdown-open:rotate-180 transition-transform duration-300"></span>
    </button>
    <ul class="dropdown-menu dropdown-open:opacity-100 hidden absolute bottom-full mb-3 left-0 w-60 rounded-lg p-2 z-10 bg-base-100/90 shadow-lg border border-primary/10 backdrop-blur-md" role="menu" aria-orientation="vertical" aria-labelledby="notification-dropdown">
      <li>
        <div @click="setNotificationState(NotificationState.FULL)" 
          class="dropdown-item flex items-center gap-3 p-2.5 hover:bg-primary/20 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md group"
        >
          <span class="size-5 icon-[lucide--bell-ring] transition-transform" :class="{ 'text-primary': notificationState === NotificationState.FULL }" />
          <div class="flex flex-col">
            <span class="font-normal">Full notifications</span>
            <span class="text-xs text-base-content/60">Successful claims and errors</span>
          </div>
        </div>
      </li>
      <li>
        <div @click="setNotificationState(NotificationState.MINIMAL)"
          class="dropdown-item flex items-center gap-3 p-2.5 hover:bg-primary/20 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md group"
        >
          <span class="size-5 icon-[lucide--bell] transition-transform" :class="{ 'text-warning': notificationState === NotificationState.MINIMAL }" />
          <div class="flex flex-col">
            <span class="font-normal">Minimal notifications</span>
            <span class="text-xs text-base-content/60">Only errors will be displayed</span>
          </div>
        </div>
      </li>
      <li>
        <div @click="setNotificationState(NotificationState.DISABLED)"
          class="dropdown-item flex items-center gap-3 p-2.5 hover:bg-primary/20 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md group"
        >
          <span class="size-5 icon-[lucide--bell-off] transition-transform" :class="{ 'text-error': notificationState === NotificationState.DISABLED }" />
          <div class="flex flex-col">
            <span class="font-normal">Disable notifications</span>
            <span class="text-xs text-base-content/60">You won't be disturbed</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
