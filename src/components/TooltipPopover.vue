<script setup lang="ts"></script>

<template>
  <div
    class="tooltip-content tooltip-shown:opacity-100 tooltip-shown:visible text-base-content/70 bg-base-200/80 border-base-content/10 shadow-primary/20 z-10 w-38 rounded-lg border p-1.5 text-left shadow-xs backdrop-blur-sm"
    role="popover"
  >
    <slot />
  </div>
</template>

<style scoped></style>
