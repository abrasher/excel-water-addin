<template>
  <n-tabs size="large" type="line" justify-content="space-evenly">
    <n-tab-pane name="Methods"><Methods /></n-tab-pane>
    <n-tab-pane name="Define"><Define /></n-tab-pane>
    <n-tab-pane name="Export"><Export /></n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import Methods from "./Methods.vue"
import Define from "./Define.vue"
import Export from "./Export.vue"
import { useStore } from "../store"
import { onMounted } from "vue"
import { NTabs, NTabPane } from "naive-ui"

const store = useStore()

onMounted(() => {
  store.loadCatchments()
})
</script>
