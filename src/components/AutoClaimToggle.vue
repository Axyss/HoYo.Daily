<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const secondsLeft = ref(getSecondsUntilNextMidnightUTC8());

function getSecondsUntilNextMidnightUTC8(): number {
  const now = dayjs().tz("Asia/Shanghai");
  const nextMidnight = now.add(1, "day").startOf("day");
  return nextMidnight.diff(now, "second");
}

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
      <span class="text-base">Automatic claiming</span>
      <span>Next claim in: <b>{{ countdown }}</b></span>
    </label>
  </div>
</template>

<style scoped></style>
