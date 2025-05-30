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
        class="bg-base-100 shadow-primary size-8 flex-shrink-0 rounded-md shadow-sm"
        :src="props.icon"
      />
      <div>
        <p class="text-base-content text-sm font-medium">{{ props.name }}</p>
        <div
          v-if="claimingState === ClaimStates.NOT_CLAIMED"
          class="text-error flex items-center gap-1 text-xs"
        >
          <span class="icon-[lucide--circle-x] size-3.5" />
          <span>Not claimed</span>
        </div>
        <div
          v-else-if="claimingState === ClaimStates.CLAIMING"
          class="text-info flex animate-pulse items-center gap-1 text-xs"
        >
          <span class="icon-[lucide--iteration-ccw] size-3.5" />
          <span>Claiming...</span>
        </div>
        <div
          v-else-if="claimingState === ClaimStates.CLAIMED"
          class="text-success flex items-center gap-1 text-xs"
        >
          <span class="icon-[lucide--circle-check-big] size-3.5" />
          <span>Claimed today</span>
        </div>
        <div
          v-else-if="claimingState === ClaimStates.ERROR"
          class="text-error flex items-center gap-1 text-xs"
        >
          <span class="icon-[lucide--circle-x] size-3.5" />
          <span
            v-if="settings.lastError"
            class="max-w-[30ch] truncate"
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
