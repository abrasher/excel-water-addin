import { createApp, watch } from "vue"
import App from "./App.vue"
import { createPinia } from "pinia"
import { Catchment, useStore } from "./store"

Office.onReady(async () => {
  const app = createApp(App)
  const pinia = createPinia()

  pinia.state.value = Office.context.document.settings.get("state")

  app.use(pinia)

  const store = useStore()

  store.$subscribe(
    (mutation, state) => {
      // Office.context.document.settings.set("pinia", JSON.stringify(state))
      // Office.context.document.settings.saveAsync()
      updateTable(state.catchments)
    },
    { deep: true, detached: true }
  )

  await setupTable()

  app.mount("#app")
})

const setupTable = async () => {
  Excel.run(async (context) => {
    let importSheet = context.workbook.worksheets.getItemOrNullObject("Catchment Definitions")
    await context.sync()

    if (importSheet.isNullObject) {
      importSheet = context.workbook.worksheets.add("Catchment Definitions")
    }

    let importTable = importSheet.tables.getItemOrNullObject("CatchmentDefinitionTable")

    await context.sync()

    const headers = [
      "UID",
      "Name",
      "Flow Length",
      "Area",
      "Slope",
      "Runoff Coefficient",
      "Airport Enabled",
      "Brinsby Williams Enabled",
    ]

    if (importTable.isNullObject) {
      importSheet.getRange("A1:F1").values = [headers]

      importTable = importSheet.tables.add("A1:G1", true)
    }

    importTable.onChanged.add(updateStore)
  })
}

const updateTable = (catchments: Map<string, Catchment>) => {
  Excel.run(async (context) => {
    try {
      const importTable = context.workbook.tables.getItem("CatchmentDefinitionTable")
      await context.sync()

      const rows = []

      catchments.forEach((c) => {
        rows.push([c.id, c.name, c.length, c.area, c.slope, c.runoffCoefficient])
      })
    } catch {
      console.error("Error while updating excel table")
    }
  })
}

const updateStore = async (args: Excel.TableChangedEventArgs) => {
  const store = useStore()

  Excel.run(async (context) => {
    const importTable = context.workbook.tables.getItem(args.tableId)
    await context.sync()

    const rowValues = importTable.rows.items.flatMap((row) => row.values)

    //@ts-ignore
    store.setCatchmentsFromExcel(rowValues)
  })
}
