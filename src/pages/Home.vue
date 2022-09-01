<template>
  <n-space
    vertical
    align="center"
  >
    <img
      :src="logoUrl"
      style="max-width: 400px"
    />
    <h1>Urbantech Water Resources Excel Toolkit</h1>
    <p>Use the navigation bar above or the buttons below</p>
    <n-space>
      <router-link to="/ponds"><n-button>Pond Calculator</n-button></router-link>
      <router-link to="/timetopeak"><n-button>Time to Peak Calculator</n-button></router-link>
    </n-space>
    <h3><a href="https://www.urbantech.com/">Urbantech West 2022</a></h3>
  </n-space>
</template>

<script setup lang="ts">
import logoUrl from "../assets/logo-name.png"
import { NSpace, NButton } from "naive-ui"
</script>
