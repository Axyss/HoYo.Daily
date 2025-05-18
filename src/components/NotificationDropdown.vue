<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";
import { getStorage, setStorage } from "../scripts/storage.ts";
import { NotificationState } from "../scripts/utils.ts";

const notificationState = ref<NotificationState>();

watch(notificationState, async (newVal, _) => {
  console.log(`[NotificationDropdown.vue]: Notification state changed to ${newVal}`);
  await setStorage("Settings", { notificationState: newVal });
});

onBeforeMount(async () => {
  const settings = await getStorage("Settings");
  if (!settings?.notificationState) {
    notificationState.value = NotificationState.MINIMAL;
  } else {
    notificationState.value = settings.notificationState;
  }
});

const notificationOptions = [
  {
    state: NotificationState.ENABLED,
    icon: "icon-[lucide--bell-ring]",
    title: "Enable notifications",
    description: "Displays claims and errors",
  },
  {
    state: NotificationState.MINIMAL,
    icon: "icon-[lucide--bell]",
    title: "Minimal notifications",
    description: "Displays just the errors",
  },
  {
    state: NotificationState.DISABLED,
    icon: "icon-[lucide--bell-off]",
    title: "Disable notifications",
    description: "You won't be disturbed",
  },
];
</script>

<template>
  <div class="dropdown flex cursor-pointer items-center gap-1">
    <button
      id="notification-dropdown"
      type="button"
      class="dropdown-toggle hover:text-primary flex cursor-pointer items-center gap-1.5 rounded-lg duration-200"
    >
      <span
        class="size-3.5"
        :class="notificationOptions.find((opt) => opt.state === notificationState)?.icon"
      />
      <span class="text-xs">Notifications: {{ notificationState }}</span>
      <span
        class="icon-[lucide--chevron-down] dropdown-open:rotate-180 size-3 transition-transform duration-200"
      ></span>
    </button>
    <ul
      class="dropdown-menu dropdown-open:opacity-100 bg-base-200/80 border-base-content/10 absolute bottom-full left-0 z-10 mb-3 hidden w-58 rounded-lg border p-1.5 backdrop-blur-sm"
      role="menu"
    >
      <template v-for="(option, index) in notificationOptions" :key="option.state">
        <div class="divider" v-if="index > 0" />
        <li>
          <div
            @click="notificationState = option.state"
            class="dropdown-item active:text-base-content active:border-primary flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-all duration-200"
            :class="{
              'bg-base-200/50 border-primary border-1 transition-all duration-200':
                notificationState === option.state,
            }"
          >
            <span class="size-5" :class="option.icon" />
            <div class="flex flex-col">
              <span class="text-sm">{{ option.title }}</span>
              <span class="text-base-content/70 text-xs">{{ option.description }}</span>
            </div>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<style scoped></style>
