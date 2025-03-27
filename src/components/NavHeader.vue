<template>
  <n-menu
    mode="horizontal"
    :options="menuOptions"
    class="w-full text-white"
    style="background-color: #1e1e2f"
  />
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
    label: renderRoute("/ponds", "Pond Calculator"),
    key: "ponds",
  },
  {
    label: renderRoute("/timetopeak", "Time to Peak Calculator"),
    key: "timetopeak",
  },
]
</script>
