<template>
  <n-space vertical>
    <n-layout>
      <n-layout-content>
        <n-tabs size="large" type="line" justify-content="space-evenly">
          <n-tab-pane name="Methods"><Methods /></n-tab-pane>
          <n-tab-pane name="Define"><Define /></n-tab-pane>
          <n-tab-pane name="Export"><Export /></n-tab-pane>
        </n-tabs>
      </n-layout-content>
    </n-layout>
  </n-space>
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Setup from "./components/Setup.vue"
import { NSpace, NLayout, NTabs, NTabPane, NLayoutContent, NText } from "naive-ui"
import Methods from "./pages/Methods.vue"
import Define from "./pages/Define.vue"
import Export from "./pages/Export.vue"
import { Catchment, useStore } from "./store"
import { onMounted, toRaw } from "vue"

const store = useStore()

let prevState = {}

onMounted(() => {
  store.loadCatchments()
})
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
