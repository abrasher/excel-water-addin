<template>
  <n-space>
    <n-button @click="setupPage">Setup Page</n-button>
  </n-space>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { NButton } from "naive-ui"
import { onTableChanged } from "../common/eventHooks"

const setupPage = () => {
  Excel.run(async (context) => {
    const sheet = context.workbook.worksheets.add("Catchments")
    const defTable = sheet.tables.add("A1:C2", true)
    defTable.name = "CatchmentDefinitons"
    defTable.getHeaderRowRange().values = [["ID", "Name", "Flow Length (m)"]]

    if (Office.context.requirements.isSetSupported("ExcelApi", "1.2")) {
      sheet.getUsedRange().format.autofitColumns()
    }

    defTable.onChanged.add(onTableChanged)

    sheet.activate()

    Office.context.document.settings.set("setup", true)
    Office.context.document.settings.saveAsync()

    await context.sync()
  })
}
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
