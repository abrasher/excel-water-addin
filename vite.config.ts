import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import { readFileSync } from "fs"
import { homedir } from "os"
import { resolve } from "path"
import { defineConfig } from "vite"
import officeAddin from "vite-plugin-office-addin"
import WindiCSS from "vite-plugin-windicss"

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const plugins = [
    vue(),
    WindiCSS(),
    vueJsx(),
    officeAddin({
      devUrl: "https://localhost:3000",
      prodUrl: "https://victorious-beach-06dd7280f.1.azurestaticapps.net",
    }),
  ]

  if (mode === "development") {
    return {
      server: {
        port: 3000,
        strictPort: true,
        https: {
          key: readFileSync(resolve(`${homedir}/.office-addin-dev-certs/localhost.key`)),
          cert: readFileSync(resolve(`${homedir}/.office-addin-dev-certs/localhost.crt`)),
          ca: readFileSync(resolve(`${homedir}/.office-addin-dev-certs/ca.crt`)),
        },
      },
      plugins,
    }
  }
  return {
    plugins,
  }
})
