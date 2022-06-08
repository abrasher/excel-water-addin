<template>
  <n-button @click="exportSummaryToSheet">
    Export Results to New Sheet
  </n-button>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui"
import { calculateCatchment } from "../calculations/calculateTp"
import { catchments } from "../store"

const exportSummaryToSheet = () => {
  const results = catchments.map((catchment) => calculateCatchment(catchment))

  Excel.run(async (context) => {
    const exportSheet = context.workbook.worksheets.add("Catchment Results")

    const exportTable = exportSheet.tables.add("A1:A1", true)

    exportTable.columns.add(-1, undefined, "Name")
    exportTable.columns.add(-1, undefined, "SCS Tc").getRange().numberFormat = [
      ["#.##"],
    ]
    exportTable.columns.add(-1, undefined, "Kirpich").getRange().numberFormat =
      [["#.##"]]
    exportTable.columns.add(-1, undefined, "Upland").getRange().numberFormat = [
      ["#.##"],
    ]

    exportTable.columns.getItemAt(0).delete()

    const rows = results.map((result) => [
      result.name,
      result.SCS ?? "",
      result.Kirpich ?? "",
      result.Upland ?? "",
    ])

    console.log(rows)

    exportTable.rows.add(-1, rows)

    exportTable.set({ name: "CatchmentResults" })
    await context.sync()
  })
}
</script>
