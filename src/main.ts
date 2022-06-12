import { createApp, watch } from "vue"
import App from "./App.vue"
import { createPinia } from "pinia"
import { Catchment, setupTable, useStore } from "./store"

Office.onReady(async () => {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)

  await setupTable()

  app.mount("#app")
})
