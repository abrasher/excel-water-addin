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
    const currentSheet =
      context.workbook.worksheets.getItemOrNullObject("Catchment Results")

    await context.sync()

    if (!currentSheet.isNullObject) {
      context.workbook.worksheets.getItem("Catchment Results").delete()
    }

    const exportSheet = context.workbook.worksheets.add("Catchment Results")

    const exportTable = exportSheet.tables.add("A1:A1", true)

    exportTable.columns.add(-1, undefined, "Name")
    exportTable.columns.add(-1, undefined, "Airport").getRange().numberFormat =
      [["#.##"]]
    exportTable.columns
      .add(-1, undefined, "Bransby Williams")
      .getRange().numberFormat = [["#.##"]]
    exportTable.columns.add(-1, undefined, "SCS").getRange().numberFormat = [
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
      result.Airport ?? "",
      result["Bransby William"] ?? "",
      result.SCS ?? "",
      result.Kirpich ?? "",
      result.Upland ?? "",
    ])

    console.log(rows)

    exportTable.rows.add(0, rows)

    exportTable.set({ name: "CatchmentResults" })

    exportSheet.activate()
    await context.sync()
  })
}
</script>
