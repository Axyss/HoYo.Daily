<script setup lang="ts">
import dayjs from "dayjs";

const props = defineProps<{
  game: string;
  itemName: string;
  itemAmount: number;
  itemImage: string;
  timestamp: number;
}>();
</script>

<template>
  <h1 class="text-base-content/50 text-base font-medium">Timestamp</h1>
  <div class="divider mt-1 mb-2" />
  <div class="bg-base-200 flex gap-3 rounded-md p-2">
    <div class="flex flex-col items-center">
      <img class="inline size-10 scale-100 rounded-md blur-xs" :src="props.itemImage" />
      <img class="z-20 -mt-10 inline size-10 rounded-md" :src="props.itemImage" />
    </div>

    <div class="inline-flex flex-col">
      <p class="text-base-content text-base font-medium">
        {{ props.itemName }}
      </p>
      <span class="text-base-content/50 mt-auto">
        {{ props.game }}
      </span>
    </div>
    <div class="ml-auto inline-flex flex-col">
      <span class="bg-primary/20 text-primary rounded-sm px-2 py-0.5 text-sm font-medium">
        +{{ props.itemAmount }}
      </span>
      <span class="text-base-content/50 pr-1 text-right">
        {{ dayjs(props.timestamp).format("HH:mm") }}
      </span>
    </div>
  </div>
</template>

<style scoped></style>
