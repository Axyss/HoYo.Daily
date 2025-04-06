<script setup lang="ts">
import { ref } from 'vue'

const rewardsClaimed = ref(false)

function claimRewards() {
  fetch("https://sg-hk4e-api.hoyolab.com/event/sol/sign", {
    method: "POST",
    body: JSON.stringify({act_id: "e202102251931481"}),
  });
  rewardsClaimed.value = true;
}
</script>

<template>
  <div class="p-10">
    <button type="button" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" @click="claimRewards">Claim</button>
    <p v-if="rewardsClaimed">Rewards claimed!</p>
  </div>
</template>

<style scoped>
</style>
