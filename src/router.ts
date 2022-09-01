import TimeToPeakCalculator from "./pages/TimeToPeakCalculator.vue"
import PondCalculator from "./pages/PondCalculator.vue"
import Home from "./pages/Home.vue"

import { createRouter, createMemoryHistory } from "vue-router"

export const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/ponds",
      component: PondCalculator,
    },
    {
      path: "/timetopeak",
      component: TimeToPeakCalculator,
    },
  ],
})
