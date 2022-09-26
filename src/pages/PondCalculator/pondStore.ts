import { defineStore } from "pinia"
import { ref } from "vue"
import { Pond } from "./types"

export const usePondStore = defineStore("pond", () => {
  const pond = ref<Pond>({
    overrideVolume: false,
    customActiveVolume: 0,
    customPermanentVolume: 0,
    catchmentArea: 10,
    imperviousness: 85,
    permanentHeight: 1.1,
    overrideUnitRate: false,
    permanentUnitRate: 0,
    activeUnitRate: 0,
    freeboardHeight: 0.2,
    bufferWidth: 10,
    freeboardSlope: 6,
    activeSlope: 5,
    permanentSlope: 4,
    lengthToWidth: 3,
    plantingSlope: 7,
    plantingWidth: 2,
    plantingAsStorage: true,
  })

  const exportToExcel = () => {
    Excel.run(async (context) => {
      context.workbook.worksheets.getItemOrNullObject("Pond Calculator").delete()
      await context.sync()

      const sheet = context.workbook.worksheets.add("Pond Calculator")

      // Export the scenarios table with actions filtered out as it has no value on the row data
      const scenarioColFiltered = scenarioColumns.filter((col) => col.key !== "actions")

      const scenarioTable = sheet.tables.add(
        `A1:${numberToLetters(scenarioColFiltered.length)}1`,
        true
      )

      scenarioTable.name = "PondCalculatorScenarios"

      scenarioTable.getHeaderRowRange().values = [scenarioColFiltered.map((col) => col.title)]

      const scenarioKeys = scenarioColFiltered.map((col) => col.key)

      scenarioTable.rows.add(
        -1,
        scenarios.value.map((scenario) => pickObjectValues(scenario, scenarioKeys as string[]))
      )

      // Export the results table below the scenarios table with 1 cell of spacing
      const offset1 = scenarios.value.length + 3

      const resultsTable = sheet.tables.add(
        `A${offset1}:${numberToLetters(resultsColumns.length)}${offset1}`,
        true
      )

      resultsTable.name = "PondCalculatorResults"

      resultsTable.getHeaderRowRange().values = [resultsColumns.map((col) => col.title)]

      const resultsKeys = resultsColumns.map((col) => col.key)

      resultsTable.rows.add(
        -1,
        results.value.map((result) => pickObjectValues(result, resultsKeys as string[]))
      )

      // Export the catchment characteristics below the results table
      const offset2 = scenarios.value.length + results.value.length + 5

      const paramTable = sheet.tables.add(`A${offset2}:B${offset2}`, true)

      paramTable.name = "ParametersTable"

      paramTable.getHeaderRowRange().values = [["Parameter", "Value"]]

      paramTable.rows.add(
        -1,
        Object.entries(excelLabels).map(([key, label]) => {
          return [label, get(pond.value, key)]
        })
      )

      sheet.activate()

      await context.sync()
    })
  }

  return { pond }
})
