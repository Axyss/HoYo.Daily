<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";
import { getStorage, setStorage } from "../scripts/utils.ts";

enum NotificationState {
  DISABLED = "disabled",
  MINIMAL = "minimal",
  ENABLED = "enabled"
}

const notificationState = ref<NotificationState>();

onBeforeMount(async () => {
  const settings = await getStorage("Settings");
  notificationState.value = settings?.notificationState ?? NotificationState.MINIMAL;
})

watch(notificationState, async (newVal, _) => {
  console.log(`[HoyoDaily]: Notification state changed to ${newVal}`)
  await setStorage("Settings", { notificationState: newVal })
})

const notificationOptions = [
  {
    state: NotificationState.ENABLED,
    icon: 'icon-[lucide--bell-ring]',
    title: 'Enable notifications',
    description: 'Successful claims and errors'
  },
  {
    state: NotificationState.MINIMAL,
    icon: 'icon-[lucide--bell]',
    title: 'Minimal notifications',
    description: 'Only errors will be displayed'
  },
  {
    state: NotificationState.DISABLED,
    icon: 'icon-[lucide--bell-off]',
    title: 'Disable notifications',
    description: 'You won\'t be disturbed'
  }
];
</script>

<template>
  <div class="dropdown flex items-center gap-1 cursor-pointer">
    <button id="notification-dropdown" type="button" class="dropdown-toggle flex items-center gap-1.5 cursor-pointer hover:text-primary duration-200 rounded-lg">
      <span class="size-3.5" :class="notificationOptions.find(opt => opt.state === notificationState)?.icon" />
      <span class="text-xs">Notifications: {{notificationState}}</span>
      <span class="size-3 icon-[lucide--chevron-down] dropdown-open:rotate-180 transition-transform duration-200"></span>
    </button>
    <ul class="dropdown-menu dropdown-open:opacity-100 hidden absolute bottom-full mb-3 left-0 w-58 rounded-lg p-1.5 z-10 bg-base-100/80 backdrop-blur-lg border border-base-content/10" role="menu">
      <template v-for="(option, index) in notificationOptions" :key="option.state">
        <div class="divider" v-if="index > 0" />
        <li>
          <div @click="notificationState = option.state"
            class="dropdown-item active:text-base-content active:border-primary transition-all flex items-center gap-3 p-2 hover:bg-base-200 transition-bg duration-200 rounded-lg cursor-pointer"
            :class="{ 
              'bg-base-200/50 border-1 border-primary transition-all duration-200': notificationState === option.state
            }"
          >
            <span class="size-5" :class="option.icon" />
            <div class="flex flex-col">
              <span class="text-sm dropdown-active:bg-primary">{{ option.title }}</span>
              <span class="text-xs text-base-content/70">{{ option.description }}</span>
            </div>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<style scoped></style>
