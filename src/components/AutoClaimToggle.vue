<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getSecondsUntilNextMidnightUTC8 } from "../utils.ts";

const secondsLeft = ref(getSecondsUntilNextMidnightUTC8());

const countdown = computed(() => {
  const h = Math.floor(secondsLeft.value / 3600).toString().padStart(2, "0");
  const m = Math.floor((secondsLeft.value % 3600) / 60).toString().padStart(2, "0");
  const s = (secondsLeft.value % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
})

onMounted(() => {
  setInterval(() => {
    if (secondsLeft.value > 0) {
      secondsLeft.value--;
    } else {
      secondsLeft.value = getSecondsUntilNextMidnightUTC8()
    }
  }, 1000);
});

</script>

<template>
  <div class="flex gap-2">
    <input type="checkbox" class="checkbox checkbox-primary mt-2" id="checkboxLabel1" />
    <label class="label-text cursor-pointer flex flex-col" for="checkboxLabel1">
      <span class="text-base">Auto-Claim</span>
      <span>Next claim in: <b>{{ countdown }}</b></span>
    </label>
  </div>
</template>

<style scoped></style>
