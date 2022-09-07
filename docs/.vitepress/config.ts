import { defineConfig } from "vitepress"

const customElements = ["mjx-container"]

export default defineConfig({
  title: "Water Add-in Documentation",
  markdown: {
    config: (md) => {
      md.use(require("markdown-it-mathjax3"))
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
            text: "Pond Calculator Equations",
            link: "/technical/pondCalculator",
          },
        ],
      },
    ],
  },
})
