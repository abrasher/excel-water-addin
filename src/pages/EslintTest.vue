<template>
  <compontent is="type" />
  <!-- ↑ In this case, the `v-for` list variable should be replace with a computed property that returns your filtered list. -->
  <template>
    <!-- ✓ GOOD -->
    <div>{{ someHTML }}</div>

    <!-- ✗ BAD -->
    <div v-html="someHTML"></div>
  </template>
</template>

<script setup lang="ts">
const todos = [{ shown: true }]
const someHTML = "<div>t</div>"
</script>
