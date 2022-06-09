<template>
  <n-space align="center" vertical>
    <n-button @click="addCatchment">Add Catchment</n-button>

    <n-data-table :data="catchments" :columns="columnDefs"> </n-data-table>
  </n-space>
</template>

<script setup lang="ts">
import { h } from "vue"
import {
  DataTableColumns,
  NCheckbox,
  NDataTable,
  NButton,
  NInput,
  NSpace,
} from "naive-ui"

import { Catchment, catchments, addCatchment, removeCatchment } from "../store"

const columnDefs: DataTableColumns<Catchment> = [
  {
    key: "remove",
    width: 10,
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
    width: 180,
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
