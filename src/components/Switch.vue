<script setup lang="ts">
const model = defineModel<boolean>();
</script>

<template>
  <label
    :class="{ 'grayscale-100 duration-200 dark:brightness-250': !model }"
    class="relative inline-flex cursor-pointer items-center"
  >
    <input type="checkbox" class="peer sr-only" v-model="model" />
    <div
      class="bg-base-100 border-primary/20 peer peer-checked peer-checked:bg-primary peer-checked:after:border-primary-content peer-checked:after:bg-primary-content after:bg-primary/50 after:border-primary/1 h-6 w-11 rounded-full border-1 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:transition-all after:content-[''] peer-checked:after:translate-x-full"
    ></div>
  </label>
</template>
