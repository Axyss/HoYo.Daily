<script setup lang="ts">
import { ref, watch } from "vue";
import { listenMessage, MessageType, sendMessage } from "../scripts/messaging.ts";
import confetti from "canvas-confetti";

const rewardsClaimed = ref(false)

watch(rewardsClaimed, (newValue, _) => {
  if (!newValue) return;
  setTimeout(async () => {
    rewardsClaimed.value = false;
    await sendMessage({ type: MessageType.MANUAL_CLAIM })
  }, 2500)
})

listenMessage(MessageType.CLAIM_SUCCESS, async () => {
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
