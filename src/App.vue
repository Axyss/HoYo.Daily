<script setup lang="ts">
import ClaimButton from './components/ClaimButton.vue'
import GameOption from './components/GameOption.vue'
</script>

<template>
  <header>
    <h1 class="text-3xl">Hoyodaily</h1>
  </header>
  <main>
    <ol>
      <GameOption />
      <GameOption />
      <GameOption />
      <ClaimButton />
    </ol>
  </main>
  <footer></footer>

</template>

<style scoped>
</style>
