<script setup lang="ts">
import { onBeforeMount, reactive, watch } from "vue";
import { getStorage, setStorage } from "../utils.ts";
import Switch from "./Switch.vue";

const props = defineProps<{
  name: string;
  icon?: string;
}>();

let componentState: any = reactive({});

onBeforeMount(async () => {
  Object.assign(componentState, await getStorage(props.name));
});

watch(componentState, async (newVal, _) => {
  await setStorage(props.name, newVal);
  console.log("Updating config: ", getStorage(props.name));
});
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3 hover:bg-base-200/90">
    <div class="flex items-center gap-3">
      <img
        class="size-8 bg-gray-800 rounded-md flex-shrink-0"
        :src="props.icon"
      />
      <div>
        <p class="text-primary-content font-medium">{{ props.name }}</p>
        <div v-if="true" class="flex items-center gap-1 text-xs text-green-500">
          <span class="size-3 icon-[lucide--circle-check-big]" />
          <span>Claimed today</span>
        </div>
      </div>
    </div>
    <label class="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        class="sr-only peer"
        :checked="componentState.enabled"
      />
      <Switch />
    </label>
  </div>
</template>

<style scoped></style>
