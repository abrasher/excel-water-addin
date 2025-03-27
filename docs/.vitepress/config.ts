import { defineConfig } from "vitepress"
// @ts-ignore ignore error of no typings
import { withMermaid } from "vitepress-plugin-mermaid"

const customElements = ["mjx-container"]

export default withMermaid({
  title: "Water Add-in Documentation",
  markdown: {
    math: true,
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
