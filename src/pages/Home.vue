<template>
  <n-space
    vertical
    align="center"
  >
    <p>Use the navigation bar above or the buttons below</p>
    <n-space>
      <router-link to="/ponds"><n-button>Pond Calculator</n-button></router-link>
      <router-link to="/timetopeak"><n-button>Time to Peak Calculator</n-button></router-link>
    </n-space>
  </n-space>
</template>

<script setup lang="ts">
import { NSpace, NButton } from "naive-ui"
</script>

<style scoped></style>
