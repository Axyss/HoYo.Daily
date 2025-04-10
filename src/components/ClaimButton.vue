<script setup lang="ts">
import { ref } from 'vue'
import { claimGenshinReward } from '../main.ts'
const rewardsClaimed = ref(false)
</script>

<template>
  <button type="button" class="btn btn-gradient btn-primary w-30" @click="claimGenshinReward">
    <span v-if="rewardsClaimed" class="loading loading-spinner"></span>
    <span v-else class="icon-[tabler--gift] size-5"></span>
    Claim
  </button>
</template>

<style scoped>
</style>
