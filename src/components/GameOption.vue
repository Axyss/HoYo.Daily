<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
  name: String,
  icon: String,
})
const isEnabled = ref(false)
</script>

<template>
  <li>
    <label class="flex items-center justify-between gap-3 p-3">
      <div class="avatar">
        <div class="size-10 rounded-md">
          <img :src="props.icon" :class="{grayscale: !isEnabled}" alt="avatar" />
        </div>
      </div>

      <div>
        <span class="label-text text-base py-0">{{ props.name }}</span>
        <span class="label-text text-success text-xs py-0">Claimed today</span>
      </div>
      <input type="checkbox" v-model="isEnabled" class="switch switch-primary" />
    </label>
  </li>
</template>

<style scoped>

</style>