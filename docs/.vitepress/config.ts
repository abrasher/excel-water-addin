import { defineConfig } from "vitepress"
// @ts-ignore ignore error of no typings
import MermaidPlugin from "vitepress-plugin-mermaid"

const customElements = ["mjx-container"]

export default defineConfig({
  title: "Water Add-in Documentation",
  markdown: {
    config: (md) => {
      md.use(require("markdown-it-mathjax3"))
      MermaidPlugin(md)
    },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => customElements.includes(tag),
      },
    },
  },
  themeConfig: {
    sidebar: [
      {
        text: "Technical",
        items: [
          {
            text: "Time to Peak / Time of Concentration",
            link: "/technical/timeToPeak",
          },
          {
            text: "Pond Calculator Flow",
            link: "/technical/pondCalculator",
          },
        ],
      },
    ],
  },
})
