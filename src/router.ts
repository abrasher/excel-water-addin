import { createMemoryHistory, createRouter } from "vue-router"

const TimeToPeakCalculator = () => import("./pages/TimeToPeakCalculator.vue")
const Home = () => import("./pages/Home.vue")
const PondCalculator = () => import("./pages/PondCalculator/PondCalculator.vue")

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
