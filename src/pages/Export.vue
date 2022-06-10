<template>
  <n-space vertical align="center">
    <n-radio-group v-model:value="exportType">
      <n-radio-button label="Time to Peak" value="Peak" />
      <n-radio-button label="Time to Concentration" value="Concentration" />
    </n-radio-group>
    <n-table>
      <tr>
        <th>Name</th>
        <th>Airport</th>
        <th>Bransby</th>
        <th>SCS</th>
        <th>Kirpich</th>
        <th>Upland</th>
      </tr>
      <tbody>
        <tr v-for="(result, index) in results" :key="index">
          <td>
            {{ result.name }}
          </td>
          <td>
            {{ result.Airport?.toFixed(1) }}
          </td>
          <td>
            {{ result["Bransby William"]?.toFixed(1) }}
          </td>
          <td>
            {{ result.SCS?.toFixed(1) }}
          </td>
          <td>
            {{ result.Kirpich?.toFixed(1) }}
          </td>
          <td>
            {{ result.Upland?.toFixed(1) }}
          </td>
        </tr>
      </tbody>
    </n-table>
    <n-button @click="exportSummaryToSheet"> Export Results to New Sheet </n-button>
  </n-space>
</template>

<script setup lang="ts">
import { computed } from "@vue/reactivity"
import { NButton, NRadioGroup, NRadioButton, NSpace, NTable } from "naive-ui"
import { ref } from "vue"
import { calculateTpCatchment, calculateTcCatchment } from "../calculations/calculateTp"
import { numberToLetters } from "../common/utils"
import { catchments } from "../store"

const exportType = ref("Peak")

const headers = ["Name", "Airport", "Bransby", "SCS", "Kirpich", "Upland"]

const results = computed(() => {
  const results = catchments.map((catchment) => {
    if (exportType.value === "Peak") {
      return calculateTpCatchment(catchment)
    } else if (exportType.value === "Concentration") {
      return calculateTcCatchment(catchment)
    }
    throw Error("Unknown export type")
  })

  return results
})

const exportSummaryToSheet = () => {
  Excel.run(async (context) => {
    const currentSheet = context.workbook.worksheets.getItemOrNullObject("Catchment Results")

    await context.sync()

    if (!currentSheet.isNullObject) {
      context.workbook.worksheets.getItem("Catchment Results").delete()
    }

    const exportSheet = context.workbook.worksheets.add("Catchment Results")

    const exportTable = exportSheet.tables.add("A2:A2", true)

    exportTable.columns.add(-1, undefined, "Name")
    exportTable.columns.add(-1, undefined, "Flow Length (m)").getRange().numberFormat = [["0.0"]]
    exportTable.columns.add(-1, undefined, "Area (ha)").getRange().numberFormat = [["0.0"]]
    exportTable.columns.add(-1, undefined, "Slope (%)").getRange().numberFormat = [["0.0"]]
    exportTable.columns.add(-1, undefined, "Runoff Coeff.").getRange().numberFormat = [["0.0"]]
    exportTable.columns.add(-1, undefined, "Airport").getRange().numberFormat = [["0.00"]]
    exportTable.columns.add(-1, undefined, "Bransby Williams").getRange().numberFormat = [["0.00"]]
    exportTable.columns.add(-1, undefined, "SCS").getRange().numberFormat = [["0.00"]]
    exportTable.columns.add(-1, undefined, "Kirpich").getRange().numberFormat = [["0.00"]]
    exportTable.columns.add(-1, undefined, "Upland").getRange().numberFormat = [["0.00"]]

    exportTable.columns.getItemAt(0).delete()

    // Create time to peak header
    exportSheet.getRange("F1:F1").values = [[`Time to ${exportType.value} (hr)`]]
    const headerRange = exportSheet.getRange(`F1:${numberToLetters(9)}1`)
    headerRange.merge()
    headerRange.format.horizontalAlignment = "Center"
    headerRange.format.borders.getItem("EdgeTop").style = "Continuous"
    headerRange.format.borders.getItem("EdgeLeft").style = "Continuous"
    headerRange.format.borders.getItem("EdgeRight").style = "Continuous"

    const rows = results.map((result) => [
      result.name,
      result.length ?? "",
      result.area ?? "",
      result.slope ?? "",
      result.runoffCoefficent ?? "",
      result.Airport ?? "",
      result["Bransby William"] ?? "",
      result.SCS ?? "",
      result.Kirpich ?? "",
      result.Upland ?? "",
    ])

    exportTable.rows.add(0, rows)

    exportTable.set({ name: "CatchmentResults" })
    exportTable.getRange().format.autofitColumns()

    await context.sync()

    exportSheet.activate()
  })
}
</script>
