import Mermaid from "vitepress-plugin-mermaid/Mermaid.vue"
import DefaultTheme from "vitepress/theme"

export default {
  ...DefaultTheme,
  enhanceApp({ app }: any) {
    // register global components
    app.component("Mermaid", Mermaid)
  },
}
