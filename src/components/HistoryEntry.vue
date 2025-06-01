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
  <li class="bg-base-200 flex gap-3 rounded-md p-2">
    <div class="flex flex-col items-center">
      <img
        class="inline size-10 scale-100 rounded-md blur-xs dark:scale-100"
        :src="props.itemImage"
      />
      <img class="z-20 -mt-10 inline size-10 rounded-md" :src="props.itemImage" />
    </div>

    <div class="inline-flex flex-col">
      <p
        class="text-base-content max-w-[25ch] truncate text-sm font-medium"
        :title="props.itemName"
      >
        {{ props.itemName }}
      </p>
      <span class="text-base-content/60 dark:text-base-content/50">
        {{ props.game }}
      </span>
    </div>
    <div class="ml-auto inline-flex flex-col">
      <span class="bg-primary/20 text-primary m-auto rounded-sm px-1 py-0 text-sm font-medium">
        +{{ props.itemAmount }}
      </span>
      <span class="text-base-content/60 dark:text-base-content/50 text-right text-xs">
        {{ dayjs.unix(props.timestamp).local().format("HH:mm") }}
      </span>
    </div>
  </li>
</template>

<style scoped></style>
