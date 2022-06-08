<template>
  <n-button @click="addCatchment">Add Catchment</n-button>
  <div>
    <n-data-table :data="catchments" :columns="columnDefs"> </n-data-table>
  </div>
  {{ catchments }}
</template>

<script setup lang="ts">
import { h, onMounted, reactive, ref } from "vue"
import {
  DataTableColumns,
  NCheckbox,
  NDataTable,
  NButton,
  NInput,
} from "naive-ui"

import { Catchment, catchments, addCatchment, removeCatchment } from "../store"

const columnDefs: DataTableColumns<Catchment> = [
  {
    key: "remove",
    render: (row) =>
      h(
        NButton,
        { onClick: () => removeCatchment(row.id) },
        {
          default: () => "X",
        }
      ),
  },
  {
    key: "name",
    title: "Name",
    render: (row) =>
      h(NInput, {
        type: "text",
        placeholder: "Catchment Name",
        value: row.name,
        onInput: (value) => {
          row.name = value
        },
      }),
  },
  {
    title: "Airport",
    key: "airportEnabled",
    render: (row) =>
      h(NCheckbox, {
        checked: row.airportEnabled,
        onUpdateChecked: () => {
          row.airportEnabled = !row.airportEnabled
        },
      }),
  },
  {
    title: "Bransby Williams",
    key: "bransbyWilliamsEnabled",
    render: (row) =>
      h(NCheckbox, {
        checked: row.bransbyWilliamsEnabled,
        onUpdateChecked: () => {
          row.bransbyWilliamsEnabled = !row.bransbyWilliamsEnabled
        },
      }),
  },
  {
    title: "SCS",
    key: "scsEnabled",
    render: (row) =>
      h(NCheckbox, {
        checked: row.scsEnabled,
        onUpdateChecked: () => {
          row.scsEnabled = !row.scsEnabled
        },
      }),
  },
  {
    title: "Kirpich",
    key: "kirpichEnabled",
    render: (row) =>
      h(NCheckbox, {
        checked: row.kirpichEnabled,
        onUpdateChecked: () => {
          row.kirpichEnabled = !row.kirpichEnabled
        },
      }),
  },
  {
    title: "Upland",
    key: "uplandEnabled",
    render: (row) =>
      h(NCheckbox, {
        checked: row.uplandEnabled,
        onUpdateChecked: () => {
          row.uplandEnabled = !row.uplandEnabled
        },
      }),
  },
]

const data = reactive([
  {
    id: 1,
    name: "hello",
    kirpich: true,
  },
  {
    id: 1,
    name: "hello 2",
    kirpich: false,
  },
])

onMounted(() => {
  // Excel.run(async (context) => {
  //   const table = context.workbook.tables.getItemOrNullObject(
  //     "CatchmentDefinitons"
  //   )
  //   table.load()
  //   await context.sync()
  //   if (table.isNullObject) {
  //     return
  //   }
  //   tableData.value = await excelTableToObjectArray<RowData>(table)
  //   await context.sync()
  //   loading.value = false
  // })
})
</script>
