<script setup lang="ts">
import Switch from "./Switch.vue";
</script>

<template>
  <div class="flex items-center justify-between bg-primary/20 p-3 rounded-lg border border-primary/70">
    <div class="flex flex-col">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold">Auto Claim</span>
        <div class="tooltip [--placement:top] tooltip-toggle">
          <span class="icon-[lucide--info] hover:text-primary mt-1.5 size-[16px]"></span>
          <div class="tooltip-content tooltip-shown:opacity-100 tooltip-shown:visible" role="popover">
            <div class="tooltip-body bg-base-100 text-base-content/80 max-w-xs rounded-lg p-2 text-start text-xs w-40">
              This functionality will not work while the browser is closed.
            </div>
          </div>
        </div>
      </div>
      <span class="text-xs text-gray-400">Claim rewards automatically when available</span>
    </div>
    <Switch />
  </div>
</template>

<style scoped></style>
