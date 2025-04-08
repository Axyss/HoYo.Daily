<script setup lang="ts">
  const props = defineProps({
    name: String,
    icon: String,
  })
</script>

<template>
  <li>
    <label class="flex items-center justify-between gap-3 p-3">
      <div class="avatar">
        <div class="size-10 rounded-md">
          <img :src="props.icon" alt="avatar" />
        </div>
      </div>
      <div>
        <span class="label-text text-base py-0">{{ props.name }}</span>
        <span class="label-text text-success text-xs py-0">Claimed today</span>
      </div>
      <input type="checkbox" class="switch switch-primary" />
    </label>
  </li>
</template>

<style scoped>

</style>