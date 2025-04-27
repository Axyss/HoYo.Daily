<script setup lang="ts">
import { ref, watch } from "vue";
import { Notyf } from "notyf";
import { MessageType, sendMessage } from "../scripts/messaging.ts";

const rewardsClaimed = ref(false)
const notyf = new Notyf({
  duration: 3000,
  position: {
    x: 'center',
    y: 'top',
  },
  dismissible: true,
  ripple: false
});

watch(rewardsClaimed, (newValue, _) => {
  if (!newValue) return;
  setTimeout(async () => {
    rewardsClaimed.value = false;
    await sendMessage({ type: MessageType.CLAIM, content: undefined })
    notyf.success('Rewards claimed!');
  }, 2500)
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
