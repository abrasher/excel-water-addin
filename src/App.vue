<template>
  <n-tabs type="segment">
    <n-tab-pane name="Setup">
      <Setup></Setup>
    </n-tab-pane>
    <n-tab-pane name="Methods"> <Methods> </Methods></n-tab-pane>
    <n-tab-pane name="Results"> </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Setup from "./components/Setup.vue"
import { NTabs, NTabPane } from "naive-ui"
import Methods from "./pages/Methods.vue"
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
