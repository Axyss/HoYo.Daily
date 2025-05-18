<script setup lang="ts">
import { ref } from "vue";
import { getStorage, setStorage } from "../scripts/storage";

enum Theme {
  LIGHT = "light",
  DARK = "black",
}
const currentTheme = ref((await getStorage("Settings"))?.theme);

if (currentTheme.value === undefined) {
  applyTheme(getPreferredTheme());
} else {
  applyTheme(currentTheme.value);
}

function getPreferredTheme() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  return prefersDark.matches ? Theme.DARK : Theme.LIGHT;
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

async function alternateTheme() {
  currentTheme.value = currentTheme.value === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
  await setStorage("Settings", { theme: currentTheme.value });
  applyTheme(currentTheme.value);
}
</script>

<template>
  <label
    class="swap swap-rotate text-base-content/50 hover:text-primary ml-auto cursor-pointer rounded-full p-2 duration-200"
  >
    <input
      type="checkbox"
      class="theme-controller"
      :checked="(currentTheme ?? getPreferredTheme()) === Theme.DARK"
      @change="alternateTheme()"
    />
    <span class="swap-on icon-[lucide--sun] size-5"></span>
    <span class="swap-off icon-[lucide--moon] size-5"></span>
  </label>
</template>

<style scoped></style>
