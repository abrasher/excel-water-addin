<template>
  <n-config-provider :theme-overrides="themeOverrides" inline-theme-disabled>
    <n-space vertical>
      <n-layout>
        <n-layout-header class="pb-2">
          <NavHeader></NavHeader>
        </n-layout-header>
        <n-layout-content class="pl-2">
          <router-view></router-view>
        </n-layout-content>
      </n-layout>
    </n-space>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NSpace, NLayout, NLayoutContent, NLayoutHeader, NConfigProvider, GlobalThemeOverrides } from "naive-ui"
import NavHeader from "./components/NavHeader.vue"
import colors from "windicss/colors"

const themeOverrides: GlobalThemeOverrides = {
  Menu: {
    itemTextColorHorizontal: colors.gray[100],
    itemTextColorActive: "#46785EFF",
    itemTextColorHover: "rgba(210, 193, 14, 1)"
  }
}
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
