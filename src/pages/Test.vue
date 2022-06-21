<template>
  <div>
    <n-button @click="setupTable">Setup</n-button>
    <n-button @click="addRow">Add Row</n-button>
    <n-button @click="t">Add Old Row</n-button>
  </div>
  <n-form v-for="(row, index) of dataTable.vueState.value" :key="index">
    <n-form-item label="Name">
      <n-input :value="row.name" @change=""> </n-input>
    </n-form-item>
  </n-form>
  <p>{{ dataTable.vueState }}</p>
</template>

<script lang="ts" setup>
import { NButton, NDataTable, NForm, NFormItem, NInput, NInputNumber } from "naive-ui"
import { onMounted, ref } from "vue"
import { StoredTable } from "../common/table"

interface Row {
  name: string
  age: number
}

const dataTable = new StoredTable<Row>("TestTable", "TableSheet", [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "age",
    label: "Age",
  },
])

const setupTable = () => {
  dataTable.setup()
}

onMounted(() => {
  dataTable.setup()
})

const addRow = () => {
  dataTable.addRow({ name: "amber" })
}

const t = () => {
  // dataTable.oldAddRow()
}

const data = ref()
</script>
