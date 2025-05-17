<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { happenedMoreThanADayAgo } from "../scripts/utils.ts";
import Switch from "./Switch.vue";
import { listenMessage, MessageType, sendMessage } from "../scripts/messaging.ts";
import { getStorage, setStorage } from "../scripts/storage.ts";

enum ClaimStates {
  NOT_CLAIMED,
  CLAIMING,
  CLAIMED,
  ERROR,
}
const props = defineProps<{
  name: string;
  icon: string;
  task: any;
}>();

const defaultSettings = { enabled: false, lastClaim: 0, lastError: null };
const settings = reactive(await loadSettings(props.name));
const claimingState = ref<ClaimStates>();

if (settings.lastError) {
  claimingState.value = ClaimStates.ERROR;
} else if (happenedMoreThanADayAgo(settings.lastClaim)) {
  claimingState.value = ClaimStates.NOT_CLAIMED;
} else {
  claimingState.value = ClaimStates.CLAIMED;
}

async function loadSettings(namespace: string) {
  const currentSettings = await getStorage(namespace);
  // Upgrades internal settings if necessary
  await setStorage(namespace, { ...defaultSettings, ...currentSettings });
  return await getStorage(namespace);
}

watch(settings, async (newSettings, _) => {
  await setStorage(props.name, newSettings);
  // Triggers a claim when enabling auto claim
  if (settings.enabled) {
    await sendMessage({ type: MessageType.UI_CLAIM });
  }
});

listenMessage(MessageType.CLAIMING, async (response) => {
  if (
    (response.target === props.name || response.target === "all") &&
    settings.enabled &&
    claimingState.value !== ClaimStates.CLAIMED
  ) {
    console.log(`[${props.name}]: Type '${response.type}' message received`);
    claimingState.value = ClaimStates.CLAIMING;
  }
});

listenMessage(MessageType.CLAIM_SUCCESS, async (response) => {
  if (response.target === props.name || response.target === "all") {
    console.log(`[${props.name}]: Type '${response.type}' message received`);
    claimingState.value = ClaimStates.CLAIMED;
  }
});

listenMessage(MessageType.CLAIM_ERROR, async (response) => {
  if (response.target === props.name || response.target === "all") {
    console.log(`[${props.name}]: Type '${response.type}' message received`);
    settings.lastError = response.content;
    claimingState.value = ClaimStates.ERROR;
  }
});
</script>

<template>
  <div
    class="flex items-center justify-between px-4 py-3"
    :class="{ 'grayscale-100': !settings.enabled }"
  >
    <div class="flex items-center gap-3">
      <img
        class="size-8 bg-base-100 rounded-md flex-shrink-0 shadow-primary shadow-sm"
        :src="props.icon"
      />
      <div>
        <p class="text-base-content font-medium text-sm">{{ props.name }}</p>
        <div
          v-if="claimingState === ClaimStates.NOT_CLAIMED"
          class="flex items-center gap-1 text-xs text-error"
        >
          <span class="size-3.5 icon-[lucide--circle-x]" />
          <span>Not claimed</span>
        </div>
        <div
          v-else-if="claimingState === ClaimStates.CLAIMING"
          class="flex items-center gap-1 text-xs text-info animate-pulse"
        >
          <span class="size-3.5 icon-[lucide--iteration-ccw]" />
          <span>Claiming...</span>
        </div>
        <div
          v-else-if="claimingState === ClaimStates.CLAIMED"
          class="flex items-center gap-1 text-xs text-success"
        >
          <span class="size-3.5 icon-[lucide--circle-check-big]" />
          <span>Claimed today</span>
        </div>
        <div
          v-else-if="claimingState === ClaimStates.ERROR"
          class="flex items-center gap-1 text-xs text-error"
        >
          <span class="size-3.5 icon-[lucide--circle-x]" />
          <span
            v-if="settings.lastError"
            class="truncate max-w-[30ch]"
            :title="settings.lastError"
            >{{ settings.lastError }}</span
          >
          <span v-else>An <strong>error</strong> occurred</span>
        </div>
      </div>
    </div>
    <Switch v-model="settings.enabled" />
  </div>
</template>

<style scoped></style>
