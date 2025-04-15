<script setup lang="ts">
import { onBeforeMount, reactive, watch } from "vue";
import { getStorage, setStorage } from "../persistence.ts";

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
  <li>
    <label class="flex items-center justify-between gap-3 p-3">
      <div class="avatar">
        <div class="size-10 rounded-md">
          <img
            :src="props.icon"
            :class="{ grayscale: !componentState.enabled }"
            class="transition-grayscale duration-300"
            alt="avatar"
          />
        </div>
      </div>

      <div>
        <span class="label-text text-base py-0">{{ props.name }}</span>
        <span class="label-text text-success text-xs py-0">Claimed today</span>
      </div>
      <input type="checkbox" v-model="componentState.enabled" class="switch switch-primary" />
    </label>
  </li>
</template>

<style scoped></style>
