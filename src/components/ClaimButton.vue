<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { listenMessage, MessageType, sendMessage } from "../scripts/messaging.ts";
import { isFirefox } from "../scripts/utils.ts";
import confettiModule from "canvas-confetti";

const rewardsClaimed = ref(false);

// Partial Fix for Firefox confetti issue
let confetti = confettiModule;
let canvas: HTMLCanvasElement | null = null;

onMounted(() => {
  if (isFirefox()) {
    canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.pointerEvents = "none";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.zIndex = "999999";

    confetti = confettiModule.create(canvas, {
      resize: true,
      useWorker: false,
    });

    document.body.appendChild(canvas);
  }
});

// Create confetti config
const confettiConfig = computed(() => {
  const baseConfig = {
    particleCount: 100,
    spread: 70,
    startVelocity: 40,
    origin: { y: 0.9 },
  };

  // Adjust settings for Firefox
  if (isFirefox()) {
    return {
      ...baseConfig,
      scalar: 0.7,
      ticks: 300,
      gravity: 0.8,
      decay: 0.94,
    };
  }

  return baseConfig;
});

function triggerConfetti() {
  confetti(confettiConfig.value);
}

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
  confetti({
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
