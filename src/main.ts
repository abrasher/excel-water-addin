import { createApp, watch } from "vue"
import App from "./App.vue"
import { createPinia } from "pinia"
import { Catchment, useStore } from "./store"

Office.onReady(async () => {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)

  await setupTable()

  app.mount("#app")
})

const setupTable = async () => {
  const store = useStore()

  await Excel.run(async (context) => {
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
      importSheet.getRange("A1:H1").values = [headers]

      importTable = importSheet.tables.add("A1:H1", true)
      importTable.name = "CatchmentDefinitionTable"
    }

    importTable.onChanged.add(updateStore)
  })
}

const updateStore = async (args: Excel.TableChangedEventArgs) => {
  console.log(args)

  const store = useStore()

  if (args.changeType === "RowDeleted") return

  Excel.run(async (context) => {
    const importTable = context.workbook.tables.getItem(args.tableId)
    await context.sync()

    importTable.rows.load()
    await context.sync()
    const rowValues = importTable.rows.items.flatMap((row) => row.values)

    //@ts-ignore
    store.setCatchmentsFromExcel(rowValues)
  })
}
