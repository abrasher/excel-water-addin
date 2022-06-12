import { KIRPICHCHANNELTYPE } from "./calculations"
import { defineStore } from "pinia"

export interface Catchment {
  id: string
  name: string
  length?: number
  slope?: number
  area?: number
  scsEnabled?: boolean
  curveNumber?: number
  manningsEnabled?: boolean
  manningsCoefficient?: number
  uplandEnabled?: boolean
  uplandType?: "paved" | "unpaved" | "other"
  uplandVelocity?: number
  kirpichEnabled?: boolean
  kirpichHeight?: number
  kirpichHeightAuto?: boolean
  kirpichHeightAutoValue?: number
  kirpichChannelType?: KIRPICHCHANNELTYPE
  airportEnabled?: boolean
  runoffCoefficient?: number
  bransbyWilliamsEnabled?: boolean
}

export const useStore = defineStore("main", {
  state: () => ({
    catchments: new Map<string, Catchment>(),
    activeCatchmentId: "",
  }),
  getters: {
    numberOfCatchments: (state) => state.catchments.keys.length,
    activeCatchment: (state) => state.catchments.get(state.activeCatchmentId),
    catchmentsArray: (state) => Array.from(state.catchments.values()),
  },
  actions: {
    setActiveCatchment(id: string) {
      this.activeCatchmentId = id
    },
    addCatchment() {
      Excel.run(async (context) => {})

      const id = crypto.randomUUID()
      this.catchments.set(id, {
        id,
        name: `Area ${this.numberOfCatchments + 1}`,
        scsEnabled: false,
        manningsEnabled: false,
        uplandEnabled: false,
        kirpichEnabled: false,
        airportEnabled: false,
        bransbyWilliamsEnabled: false,
      })
    },
    updatePartial(id: string, value: Partial<Catchment>) {
      const data = {
        ...this.catchments.get(id),
        ...value,
      } as Catchment

      this.catchments.set(id, data)
      updateTable(this.catchments)
    },
    updateCatchment(id: string, value: Catchment) {
      this.catchments.set(id, value)
      updateTable(this.catchments)
    },
    setCatchmentsFromExcel(data: [string, string, number, number, number, number][]) {
      data.forEach((data) => {
        const [id, name, length, area, slope, runoffCoefficient] = data
        this.catchments.set(id, { id, name, length, area, slope, runoffCoefficient })
      })
    },
    loadCatchments() {
      Excel.run(async (context) => {
        const importTable = context.workbook.tables.getItem("CatchmentDefinitionTable")
        await context.sync()

        importTable.rows.load()
        await context.sync()
        const rowValues = importTable.rows.items.flatMap((row) => row.values)

        //@ts-ignore
        this.setCatchmentsFromExcel(rowValues)
      })
    },
    removeCatchment(id: string) {
      this.catchments.delete(id)
    },
  },
})

const updateTable = (catchments: Map<string, Catchment>) => {
  Excel.run(async (context) => {
    try {
      const importTable = context.workbook.tables.getItem("CatchmentDefinitionTable")
      await context.sync()

      importTable.getDataBodyRange().delete("Up")

      catchments.forEach((c) => {
        importTable.rows.add(-1, [
          [
            c.id,
            c.name,
            c.length ?? "",
            c.area ?? "",
            c.slope ?? "",
            c.runoffCoefficient ?? "",
            !!c.airportEnabled,
            !!c.bransbyWilliamsEnabled,
          ],
        ])
      })
      await context.sync()
    } catch (e) {
      console.error("Error while updating excel table", e)
    }
  })
}

export const setupTable = async () => {
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
