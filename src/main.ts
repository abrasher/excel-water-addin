import { createPinia } from "pinia"
import "virtual:windi-devtools"
import "virtual:windi.css"
import { createApp } from "vue"
import App from "./App.vue"
import { router } from "./router"

Office.onReady(async () => {
  const app = createApp(App)
  // state management library
  const pinia = createPinia()
  app.use(pinia)

  app.use(router)

  app.mount("#app")
})
