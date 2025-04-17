<script setup lang="ts">
import { onBeforeMount, reactive, watch } from "vue";
import { getStorage, setStorage } from "../utils.ts";
import Switch from "./Switch.vue";
import { getTasks, registerTask, unregisterTask } from "../task-registry.ts";

const props = defineProps<{
  name: string;
  icon: string;
  task: any;
}>();

let componentState: any = reactive({});

onBeforeMount(async () => {
  Object.assign(componentState, await getStorage(props.name));
});

watch(componentState, async (newState, _) => {
  console.log(newState.enabled);
  if (newState.enabled) {
    registerTask(props.task);
  } else {
    unregisterTask(props.task);
  }
  console.log("Task registry", getTasks())
  await setStorage(props.name, newState);
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
    <Switch v-model="componentState.enabled"/>
  </div>
</template>

<style scoped></style>
