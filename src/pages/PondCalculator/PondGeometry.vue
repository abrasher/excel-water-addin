<template>
  <div style="display: flex; flex-direction: column">
    <pre>{{ JSON.stringify(store.result, null, 2) }}</pre>
  </div>
</template>

<script setup lang="ts">
import { usePondStore } from "./pondStore"

const store = usePondStore()
</script>
