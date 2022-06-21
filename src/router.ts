import TimeToPeak from "./pages/TimeToPeak.vue"
import Test from "./pages/Test.vue"

import { createRouter, createMemoryHistory, createWebHashHistory, createWebHistory } from "vue-router"

export const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: "/",
      component: Test,
    },
    {
      path: "/test",
      component: Test,
    },
  ],
})
