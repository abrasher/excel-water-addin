<template>
  <n-config-provider
    :theme-overrides="themeOverrides"
    inline-theme-disabled
  >
    <n-notification-provider>
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
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import {
  GlobalThemeOverrides,
  NConfigProvider,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NNotificationProvider,
  NSpace,
} from "naive-ui"
import NavHeader from "./components/NavHeader.vue"

const themeOverrides: GlobalThemeOverrides = {
  Menu: {
    itemTextColor: "#FFFFFFFFF",
    itemTextColorHorizontal: "#FFFFFF",
    itemTextColorActive: "#FFFFFF",
    itemTextColorHover: "#FFFFFF",
    itemColorActive: "#FFFFFF",
    itemTextColorActiveHover: "#FFFFFF",

    itemColorHover: "#FFFFFF",
    itemTextColorActiveHorizontal: "#FFFFFFF",
    itemTextColorActiveHoverHorizontal: "#FFFFFFF",
  },
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
