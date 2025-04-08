<script setup lang="ts">
  import genshinIcon from '../assets/genshin-icon.webp'
  import hsrIcon from '../assets/hsr-icon.png'
  import zzzIcon from '../assets/zzz-icon.png'
</script>

<template>
  <h6 class="text-base text-base-content mb-1">Switch your preferred certifications:</h6>
  <ul class="border-base-content/25 max-w-sm divide-base-content/25 divide-y rounded-md border *:first:rounded-t-md *:last:rounded-b-md *:cursor-pointer">
    <li>
      <label class="flex items-center justify-around gap-3 p-3">
        <div class="avatar">
          <div class="size-8 rounded-md">
            <img :src="genshinIcon" alt="avatar" />
          </div>
        </div>
        <span class="label-text text-base"> Genshin Impact </span>
        <input type="checkbox" class="switch switch-primary" />
      </label>
    </li>
    <li>
      <label class="flex items-center justify-around gap-3 p-3">
        <div class="avatar">
          <div class="size-8 rounded-md">
            <img :src="hsrIcon" alt="avatar" />
          </div>
        </div>
        <span class="label-text text-base"> Honkai Star Rail </span>
        <input type="checkbox" class="switch switch-primary" checked />
      </label>
    </li>
    <li>
      <label class="flex items-center justify-around gap-3 p-3">
        <div class="avatar">
          <div class="size-8 rounded-md">
            <img :src="zzzIcon" alt="avatar" />
          </div>
        </div>
        <span class="label-text text-base"> Zenless Zone Zero </span>
        <input type="checkbox" class="switch switch-primary" />
      </label>
    </li>
  </ul>
</template>

<style scoped>

</style>