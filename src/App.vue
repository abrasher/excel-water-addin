<template>
  <n-space vertical>
    <n-layout>
      <n-layout-header>
        <NavHeader></NavHeader>
      </n-layout-header>
      <n-layout-content>
        <router-view></router-view>
      </n-layout-content>
    </n-layout>
  </n-space>
</template>

<script setup lang="ts">
import { NSpace, NLayout, NLayoutContent, NLayoutHeader } from "naive-ui"
import NavHeader from "./components/NavHeader.vue"
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
