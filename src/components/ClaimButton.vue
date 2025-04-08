<script setup lang="ts">
import { ref } from 'vue'

const rewardsClaimed = ref(false)

function claimRewards() {
  fetch("https://sg-hk4e-api.hoyolab.com/event/sol/sign", {
    method: "POST",
    body: JSON.stringify({act_id: "e202102251931481"}),
  }).then((res) => {
    if (!res.ok) {
      // If response status is not ok, throw an error
      return Promise.reject(`Failed to claim rewards: ${res.statusText}`);
    }
    return res.json();  // Parse the response as JSON
  })
      .then((data) => {
        console.log(data);  // Log the parsed result
        rewardsClaimed.value = true;  // Set rewardsClaimed to true
        setTimeout(() => {rewardsClaimed.value = false}, 1500)
      })
      .catch((error) => {
        console.error("Error claiming rewards:", error);  // Log errors
      });
}
</script>

<template>
  <button type="button" class="btn btn-gradient btn-primary w-30" @click="claimRewards">
    <span v-if="rewardsClaimed" class="loading loading-spinner"></span>
    <span v-else class="icon-[tabler--gift] size-5"></span>
    Claim
  </button>
</template>

<style scoped>
</style>
