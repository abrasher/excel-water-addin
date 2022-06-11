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
