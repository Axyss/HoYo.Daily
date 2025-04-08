<script setup lang="ts">
import ClaimButton from './components/ClaimButton.vue'
import GameOption from './components/GameOption.vue'
import comissionIcon from './assets/comission-icon.svg'

function getImageUrl(name: String, ext: String): string {
  return new URL(`./assets/${name}.${ext}`, import.meta.url).href
}
</script>

<template>
  <header class="flex flex-row items-baseline">
    <img class="size-10 mr-2 self-end" :src="comissionIcon" />
    <h1 class="text-4xl">HoyoDaily</h1>
    <sub class="self-baseline">Beta</sub>
  </header>
  <div class="divider divider-secondary"></div>
  <main>
    <!--<h6 class="text-base text-base-content mb-1">Switch your preferred certifications:</h6>-->
    <ul class="border-base-content/25 max-w-sm divide-base-content/25 divide-y rounded-md border *:first:rounded-t-md *:last:rounded-b-md *:cursor-pointer">
      <GameOption name="Genshin Impact" :icon="getImageUrl('genshin-icon', 'webp')" />
      <GameOption name="Honkai Star Rail" :icon="getImageUrl('hsr-icon', 'png')" />
      <GameOption name="Zenless Zone Zero" :icon="getImageUrl('zzz-icon', 'png')" />
    </ul>
  </main>
  <div class="flex gap-2">
    <input type="checkbox" class="checkbox checkbox-primary mt-2" id="checkboxLabel1" />
    <label class="label-text cursor-pointer flex flex-col" for="checkboxLabel1">
      <span class="text-base">Automatic claiming</span>
      <span>Next claim in: 10:23:45</span>
    </label>
  </div>
  <footer>
    <ClaimButton />
  </footer>
</template>

<style scoped>
</style>
