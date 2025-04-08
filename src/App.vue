<script setup lang="ts">
import ClaimButton from './components/ClaimButton.vue'
import GameOptions from './components/GameOptions.vue'
import comissionIcon from './assets/comission-icon.svg'
</script>

<template>
  <header>
    <img class="" :src="comissionIcon" />
    <h1 class="inline-block text-base-content text-4xl">HoyoDaily</h1>
    <sub>Beta</sub>
  </header>
  <main>
    <ol>
      <GameOptions />
    </ol>
  </main>
  <div class="divider divider-secondary"></div>
  <footer>
    <ClaimButton />
  </footer>
</template>

<style scoped>
</style>
