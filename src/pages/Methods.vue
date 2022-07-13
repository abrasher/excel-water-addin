<template>
  <n-space align="center" vertical>
    <n-button @click="setupExcel">Setup Table</n-button>
    <n-button @click="store.addCatchment">Add Catchment</n-button>

    <n-data-table :data="store.catchmentsArray" :columns="columnDefs"> </n-data-table>
  </n-space>
  {{ store.catchments }}
</template>

<script setup lang="ts">
import { h } from "vue"
import { DataTableColumns, NCheckbox, NDataTable, NButton, NInput, NSpace } from "naive-ui"

import { Catchment, useStore } from "../store"

const store = useStore()

const setupExcel = () => {
  Excel.run(async (context) => {})
}

const columnDefs: DataTableColumns<Catchment> = [
  {
    key: "remove",
    width: 10,
    render: (row) =>
      h(
        NButton,
        { onClick: () => store.removeCatchment(row.id) },
        {
          default: () => "X",
        }
      ),
  },
  {
    key: "name",
    title: "Name",
    width: 180,
    render: (row) =>
      h(NInput, {
        type: "text",
        placeholder: "Catchment Name",
        value: row.name,
        onInput: (value) => {
          store.updatePartial(row.id, { name: value })
        },
      }),
  },
  {
    title: "Airport",
    width: 80,
    key: "airportEnabled",
    className: "aligncenter",
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
    width: 80,
    className: "aligncenter",
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
    width: 80,
    className: "aligncenter",
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
    width: 80,
    className: "aligncenter",
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
    width: 80,
    className: "aligncenter",
    render: (row) =>
      h(NCheckbox, {
        checked: row.uplandEnabled,
        onUpdateChecked: () => {
          row.uplandEnabled = !row.uplandEnabled
        },
      }),
  },
]
</script>

<style>
.aligncenter {
  text-align: center !important;
}
</style>
