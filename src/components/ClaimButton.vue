<script setup lang="ts">
import { ref, watch } from "vue";
import { listenMessage, MessageType, sendMessage } from "../scripts/messaging.ts";
import confetti from "canvas-confetti";

const rewardsClaimed = ref(false)

watch(rewardsClaimed, () => {
  if (rewardsClaimed.value) {
    setTimeout(async () => {
      await sendMessage({ type: MessageType.MANUAL_CLAIM })},Math.random() * 500 + 1000)
  }
})

listenMessage(MessageType.MANUAL_CLAIM_ERROR,  async () => {
  rewardsClaimed.value = false;
})

listenMessage(MessageType.MANUAL_CLAIM_SUCCESS, async () => {
  rewardsClaimed.value = false;
  confetti({
    particleCount: 100,
    spread: 70,
    startVelocity: 40,
    origin: { y: 0.9 },
  });
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
