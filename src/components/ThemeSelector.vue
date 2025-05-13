<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const isDarkMode = ref(false);

onMounted(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  isDarkMode.value = prefersDark.matches;
});

watch(isDarkMode, (newValue) => {
  const theme = newValue ? 'black' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
});
</script>

<template>
  <label class="swap swap-rotate text-base-content/40 hover:text-primary p-2 ml-auto rounded-full duration-200 cursor-pointer">
    <input type="checkbox" class="theme-controller" :checked="isDarkMode" @change="isDarkMode = !isDarkMode" />
    <span class="swap-on icon-[lucide--sun] size-5"></span>
    <span class="swap-off icon-[lucide--moon] size-5"></span>
  </label>
</template>

<style scoped>
</style>