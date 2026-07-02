<script lang="ts" setup>
import { computed, ref } from "vue";
import dayjs from "dayjs";
import { getStorage, type HistoryGameDataEntry } from "../scripts/storage.ts";
import HistoryEntry from "./HistoryEntry.vue";
import claimableItems from "../assets/claimable-items.json" with { type: "json" };
import { listenMessage, MessageType } from "../scripts/messaging.ts";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);

type GameClaimableItems = Record<string, { icon: string; name: string; cnt: number }[]>;

const claimHistory = ref<any>(await getStorage("History"));
const typedClaimableItems = claimableItems as GameClaimableItems;
const visibleClaimHistoryKeys = computed(() =>
  // Some days may contain invalid entries that are kept for logging purposes.
  Object.keys(claimHistory.value)
    .filter((day) =>
      claimHistory.value[day].some(
        (entry: HistoryGameDataEntry) => typedClaimableItems[entry.game]?.[entry.itemIndex],
      ),
    )
    .sort((a, b) => Number(b) - Number(a)),
);

listenMessage(MessageType.HISTORY_UPDATE, async () => {
  console.log("[HistoryTab.vue]: Updating claim history");
  claimHistory.value = await getStorage("History");
});
</script>

<template>
  <!-- Empty State -->
  <div
    v-if="Object.keys(claimHistory).length === 0"
    class="flex h-full flex-col items-center justify-center px-4 py-8"
  >
    <div
      class="bg-primary/10 border-primary/30 flex max-w-xs flex-col items-center rounded-xl border p-6 text-center"
    >
      <span class="icon-[lucide--history] text-primary/60 mb-4 size-16" />
      <h3 class="text-base-content mb-2 text-xl font-semibold">No History Yet</h3>
      <p class="text-base-content/60 mb-4 text-sm">
        Your claimed rewards will appear here once you start collecting them.
      </p>
    </div>
  </div>

  <!-- HistoryTab List -->
  <ol v-else class="list-none p-0">
    <li v-for="dayTimestamp in visibleClaimHistoryKeys" :key="dayTimestamp">
      <h2 class="text-base-content/60 dark:text-base-content/50 text-base font-semibold">
        {{ dayjs(Number(dayTimestamp)).format("MMMM Do") }}
      </h2>
      <div class="divider mt-1 mb-2" />
      <div
        v-for="(entry, index) in claimHistory[dayTimestamp].sort(
          (a: HistoryGameDataEntry, b: HistoryGameDataEntry) => a.timestamp - b.timestamp,
        )"
        :key="index"
        class="mb-3"
      >
        <HistoryEntry
          v-if="typedClaimableItems[entry.game][entry.itemIndex] != undefined"
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
