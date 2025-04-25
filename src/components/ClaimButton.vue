<script setup lang="ts">
import { ref, watch } from "vue";

const rewardsClaimed = ref(false)
watch(rewardsClaimed, () => {
  setTimeout(() => {
    rewardsClaimed.value = false;
  }, 3000)
})
</script>

<template>
  <div class="p-4">
    <button class="btn btn-primary flex justify-center py-6 text-lg rounded-md w-full font-medium" @click="rewardsClaimed = true">
      <span :class="{'size-6': true,
                     'loading loading-spinner loading-sm': rewardsClaimed,
                     'icon-[lucide--gift]': !rewardsClaimed}" />
      <span v-if="!rewardsClaimed">Claim Rewards</span>
      <span v-else>Claiming...</span>
    </button>
  </div>
</template>

<style scoped></style>
