<script setup lang="ts">
import { ref, watch } from "vue";
import { listenMessage, MessageType, sendMessage } from "../scripts/messaging.ts";
import confetti from "canvas-confetti";

const rewardsClaimed = ref(false);

let myCanvas = document.createElement("canvas");
myCanvas.style.position = "fixed";
myCanvas.style.top = "0";
myCanvas.style.left = "0";
myCanvas.style.width = "100vw";
myCanvas.style.height = "100vh";
myCanvas.style.pointerEvents = "none";
myCanvas.style.zIndex = "9999";
document.body.appendChild(myCanvas);

let workerlessConfetti = confetti.create(myCanvas, {
  resize: true,
  useWorker: false, // CSF rules do not allow worker usage on Firefox
});

watch(rewardsClaimed, () => {
  if (rewardsClaimed.value) {
    setTimeout(
      async () => {
        await sendMessage({ type: MessageType.MANUAL_CLAIM });
      },
      Math.random() * 500 + 1000,
    );
  }
});

listenMessage(MessageType.MANUAL_CLAIM_ERROR, async () => {
  rewardsClaimed.value = false;
});

listenMessage(MessageType.MANUAL_CLAIM_SUCCESS, async () => {
  rewardsClaimed.value = false;
  workerlessConfetti({
    particleCount: 100,
    spread: 70,
    startVelocity: 40,
    origin: { y: 0.9 },
  });
});
</script>

<template>
  <div class="p-4">
    <button
      class="btn btn-primary flex w-full justify-center rounded-lg py-6 text-lg font-semibold"
      @click="rewardsClaimed = true"
    >
      <span
        :class="{
          'size-6': true,
          'loading loading-spinner loading-sm': rewardsClaimed,
          'icon-[lucide--gift]': !rewardsClaimed,
        }"
      />
      <span v-if="!rewardsClaimed">Claim Rewards</span>
      <span v-else>Claiming...</span>
    </button>
  </div>
</template>

<style scoped></style>
