<template>
  <n-space vertical>
    <n-layout>
      <n-layout-content>
        <router-view></router-view>
      </n-layout-content>
    </n-layout>
  </n-space>
</template>

<script setup lang="ts">
import { NSpace, NLayout, NTabs, NTabPane, NLayoutContent, NText } from "naive-ui"
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
</style>
