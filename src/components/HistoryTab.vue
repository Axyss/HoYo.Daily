<script lang="ts" setup>
import { ref } from "vue";
import dayjs from "dayjs";
import { getStorage } from "../scripts/storage.ts";
import HistoryEntry from "./HistoryEntry.vue";
import claimableItems from "../assets/claimable-items.json" with { type: "json" };

type GameClaimableItems = Record<string, { icon: string; name: string; cnt: number }[]>;

const claimHistory = ref<any>(await getStorage("History"));
const typedClaimableItems = claimableItems as GameClaimableItems;
</script>

<template>
  <!-- Empty State -->
  <div v-if="!claimHistory" class="flex h-full flex-col items-center justify-center px-4 py-8">
    <div
      class="bg-primary/10 border-primary/30 flex max-w-xs flex-col items-center rounded-xl border p-6 text-center"
    >
      <span class="icon-[lucide--history] text-primary/60 mb-4 size-16" />
      <h3 class="text-base-content mb-2 text-xl font-semibold">No History Yet</h3>
      <p class="text-base-content/60 mb-4 text-sm">
        Your claimed rewards will appear here once you start collecting them.
      </p>
      <div class="text-base-content/60 flex items-center gap-2 text-sm">
        <span class="icon-[lucide--arrow-left]" />
        <span>Switch to Games tab to get started</span>
      </div>
    </div>
  </div>

  <!-- HistoryTab List -->
  <ol v-else class="list-none p-0">
    <li v-for="(entries, dayTimestamp) in claimHistory" :key="dayTimestamp" class="mb-6">
      <h2 class="text-base-content/50 mb-2 text-base font-medium">
        {{ dayjs(Number(dayTimestamp)).format("MMMM D") }}
      </h2>
      <div class="divider mt-1 mb-2" />
      <div v-for="(entry, entryTimestamp) in entries" :key="entryTimestamp" class="mb-4">
        <HistoryEntry
          :game="entry.game"
          :itemAmount="typedClaimableItems[entry.game][entry.itemIndex].cnt"
          :itemImage="typedClaimableItems[entry.game][entry.itemIndex].icon"
          :itemName="typedClaimableItems[entry.game][entry.itemIndex].name"
          :timestamp="entry.timestamp"
        />
      </div>
    </li>
  </ol>
</template>

<style scoped></style>
