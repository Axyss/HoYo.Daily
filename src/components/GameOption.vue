<script setup lang="ts">
import { onBeforeMount, reactive, ref, watch } from "vue";
import { getStorage, happenedMoreThanADayAgo, setStorage } from "../scripts/utils.ts";
import Switch from "./Switch.vue";

enum ClaimStates { NOT_CLAIMED, CLAIMING, CLAIMED, ERROR }
const props = defineProps<{
  name: string;
  icon: string;
  task: any;
}>();

const defaultSettings = { enabled: false, lastClaim: 0 }
const settings = reactive({});
const claimingState = ref<ClaimStates>(ClaimStates.NOT_CLAIMED);

onBeforeMount(async () => {
  const currentSettings = await getStorage(props.name);

  if (currentSettings === null) {
    await setStorage(props.name, defaultSettings);
  } else if (Object.keys(defaultSettings).length > Object.keys(currentSettings).length) {
    await setStorage(props.name, { ...defaultSettings, ...currentSettings });
  }
  Object.assign(settings, await getStorage(props.name));
});

watch(settings, async (newSettings, _) => {
  if (happenedMoreThanADayAgo(newSettings.lastClaim)) {
    claimingState.value = ClaimStates.NOT_CLAIMED;
  } else {
    claimingState.value = ClaimStates.CLAIMED;
  }
  await setStorage(props.name, newSettings);
});

chrome.runtime.onMessage.addListener(async ( msg ) => {
  if (msg.target === props.name) {
    console.log(props.name + ": Message received");
    Object.assign(settings, await getStorage(props.name));
  }
})
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3 hover:bg-base-200/90">
    <div class="flex items-center gap-3">
      <img
        class="size-8 bg-base-300 rounded-md flex-shrink-0"
        :src="props.icon"
      />
      <div>
        <p class="text-primary-content font-medium text-sm">{{ props.name }}</p>
        <div v-if="claimingState === ClaimStates.NOT_CLAIMED" class="flex items-center gap-1 text-xs text-red-400">
          <span class="size-3.5 icon-[lucide--circle-x]" />
          <span>Not claimed</span>
        </div>
        <div v-else-if="claimingState === ClaimStates.CLAIMING" class="flex items-center gap-1 text-xs text-blue-400 animate-pulse">
          <span class="size-3.5 icon-[lucide--iteration-ccw]" />
          <span>Claiming...</span>
        </div>
        <div v-else-if="claimingState === ClaimStates.CLAIMED" class="flex items-center gap-1 text-xs text-green-400">
          <span class="size-3.5 icon-[lucide--circle-check-big]" />
          <span>Claimed today</span>
        </div>
        <div v-else-if="claimingState === ClaimStates.ERROR" class="flex items-center gap-1 text-xs text-red-400">
          <span class="size-3.5 icon-[lucide--circle-check-big]" />
          <span>Error</span>
        </div>
      </div>
    </div>
    <Switch v-model="settings.enabled"/>
  </div>
</template>

<style scoped></style>
