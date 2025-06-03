<script setup lang="ts">
import Switch from "./Switch.vue";
import TooltipPopover from "./TooltipPopover.vue";
import { ref, watch } from "vue";
import { MessageType, sendMessage } from "../scripts/messaging.ts";
import { getStorage, setStorage } from "../scripts/storage.ts";

const settings = await getStorage("Settings");
const autoClaimEnabled = ref(settings["autoClaimEnabled"]);

watch(autoClaimEnabled, async (newVal, _) => {
  await setStorage("Settings", { autoClaimEnabled: newVal });
  // Triggers a claim when enabling auto claim
  await sendMessage({ type: MessageType.UI_CLAIM, target: "all" });
});

if (!settings?.autoClaimEnabled) {
  autoClaimEnabled.value = false;
} else {
  autoClaimEnabled.value = settings.autoClaimEnabled;
}
</script>

<template>
  <div
    class="bg-primary/10 border-primary/70 flex items-center justify-between rounded-lg border p-3"
  >
    <div class="flex flex-col">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold">Auto Claim</span>
        <div :class="`tooltip tooltip-toggle hover:text-primary [--placement:right]`">
          <span class="icon-[lucide--info] mt-1.5 size-4 duration-200" />
          <TooltipPopover class="mx-2 text-xs" placement="right">
            This feature requires the browser to be <strong>open</strong>.
          </TooltipPopover>
        </div>
      </div>
      <span class="text-base-content/60 dark:text-base-content/50 text-xs">
        Claim rewards automatically when available
      </span>
    </div>
    <Switch v-model="autoClaimEnabled" />
  </div>
</template>

<style scoped></style>
