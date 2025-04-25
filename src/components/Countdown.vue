<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
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
    secondsLeft.value = getSecondsUntilNextMidnightUTC8()
  }, 1000);
});
</script>

<template>
  <span v-bind="$attrs">
    {{ countdown }}
  </span>
</template>

<style scoped></style>
