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
  <button type="button" class="btn btn-gradient btn-primary w-30" @click="claimRewards">
    <span v-if="rewardsClaimed" class="loading loading-spinner"></span>
    Claim
  </button>
</template>

<style scoped>
</style>
