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

    const exportTable = exportSheet.tables.add("A1:B10", true)

    for (const result of results) {
      exportTable.rows.add(-1, [
        [
          result.name,
          result.SCS ?? "",
          result.Kirpich ?? "",
          result.Upland ?? "",
        ],
      ])
    }

    await context.sync()
  })
}
</script>
