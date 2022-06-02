import { createApp } from "vue"
import App from "./App.vue"
import { setupHooks } from "./common/eventHooks"

Office.onReady(() => {
  createApp(App).mount("#app")
})

Office.initialize = () => {
  setupHooks()
}
