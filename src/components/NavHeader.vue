<template>
  <n-menu mode="horizontal" :options="menuOptions" class="w-full bg-gray-900" />
</template>

<script lang="ts" setup>
import { h } from "vue"
import { NMenu } from "naive-ui"
import type { MenuOption } from "naive-ui"
import { RouterLink } from "vue-router"

const renderRoute = (to: string, label: string) => {
  return () => h(RouterLink, { to: { path: to } }, { default: () => label })
}

const menuOptions: MenuOption[] = [
  {
    label: renderRoute("/", "Home"),
    key: "home",
  },
  {
    label: renderRoute("/ponds", "Urban Ponds"),
    key: "ponds",
  },
]
</script>
