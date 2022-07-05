import "virtual:windi.css"
import "virtual:windi-devtools"
import { createApp } from "vue"
import App from "./App.vue"
import { createPinia } from "pinia"
import { setupTable } from "./store"
import { router } from "./router"

Office.onReady(async () => {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(router)

  app.use(pinia)

  await setupTable()

  app.mount("#app")
})
