<template>
  <n-space vertical>
    <h1 class="text-center text-2xl">Time to Peak Calculator</h1>
    <n-data-table
      :data="catchments"
      :columns="catchmentColumns"
    />

    <n-button @click="addCatchment">Add Catchment</n-button>
    <n-select
      placeholder="Please Select a Catchment to Define"
      :value="activeCatchmentId"
      :options="catchmentSelections"
      @update:value="(val) => (activeCatchmentId = val)"
    >
    </n-select>

    <template v-if="activeCatchment">
      <n-h3 prefix="bar">
        <n-text>General Parameters </n-text>
      </n-h3>
      <n-form-item
        label="Flow Length (m)"
        path="length"
        step="10"
        min="10"
      >
        <n-input-number v-model:value="activeCatchment.length" />
      </n-form-item>
      <n-form-item
        label="Slope (%)"
        path="slope"
        min="0"
        max="100"
      >
        <n-input-number v-model:value="activeCatchment.slope" />
      </n-form-item>
      <!-- SCS -->
      <template v-if="activeCatchment.scsEnabled">
        <n-h3 prefix="bar">SCS Method Parameters</n-h3>
        <n-form-item
          label="Curve Number"
          path="curveNumber"
        >
          <n-input-number v-model:value="activeCatchment.curveNumber" />
        </n-form-item>
      </template>
      <!-- Airport -->
      <template v-if="activeCatchment?.airportEnabled">
        <n-h3 prefix="bar">Airport Method Parameters</n-h3>
        <n-form-item
          label="Runoff Coeff."
          path="runoffCofficient"
        >
          <n-input-number
            v-model:value="activeCatchment.runoffCoefficient"
            min="0.01"
            max="1"
            step="0.01"
          />
        </n-form-item>
      </template>
      <!-- Bransby Williams -->
      <template v-if="activeCatchment?.bransbyWilliamsEnabled">
        <n-h3 prefix="bar">Bransby Williams Parameters</n-h3>
        <n-form-item
          label="Area (ha)"
          path="area"
        >
          <n-input-number v-model:value="activeCatchment.area" />
        </n-form-item>
      </template>
      <!-- Upland -->
      <template v-if="activeCatchment?.uplandEnabled">
        <n-h3 prefix="bar">Upland Method Parameters</n-h3>
        <n-form-item
          label="Land Type"
          path="uplandType"
        >
          <n-select
            style="width: 300px"
            :options="uplandTypeOptions"
            v-model:value="activeCatchment.uplandType"
          />
        </n-form-item>
        <n-form-item
          label="Velocity (m/s)"
          path="uplandVelocity"
          v-if="activeCatchment.uplandType === 'other'"
        >
          <n-input-number v-model:value="activeCatchment.uplandVelocity" />
        </n-form-item>
      </template>
      <!-- Kirpich -->
      <!-- <template v-if="activeCatchment?.kirpichEnabled">
        <n-h3 prefix="bar"><n-text>Kirpich Parameters</n-text></n-h3>
        <n-form-item label="Channel Type">
          <n-select v-model:value="activeCatchment.kirpichChannelType" :options="kirpichChannelType"></n-select>
        </n-form-item>
        <n-form-item label="Calculate Height from Slope">
          <n-switch v-model:value="activeCatchment.kirpichHeightAuto"></n-switch>
        </n-form-item>
        <n-form-item label="Drop in Elevation (m) ">
          <n-input-number
            v-if="activeCatchment.kirpichHeightAuto"
            :value="kirpichHeightAutoValue"
            :disabled="true"
          ></n-input-number>
          <n-input-number v-else v-model:value="activeCatchment.kirpichChannelType"></n-input-number>
        </n-form-item>
      </template> -->
      <!-- Kinematic Wave -->
    </template>
    <n-space
      vertical
      align="center"
    >
      <n-radio-group v-model:value="exportType">
        <n-radio-button
          label="Time to Peak"
          value="Peak"
        />
        <n-radio-button
          label="Time to Concentration"
          value="Concentration"
        />
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
          <tr
            v-for="(result, index) in results"
            :key="index"
          >
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
      <n-button @click="exportSummaryToSheet"> Export Results To Excel </n-button>
    </n-space>
  </n-space>
</template>

<script setup lang="ts">
import { computed, h, ref } from "vue"
import { kirpichChannelType } from "../calculations"
import { calculateTpCatchment, calculateTcCatchment } from "../calculations/calculateTp"

import {
  NSelect,
  NText,
  NInputNumber,
  NInput,
  NH3,
  NFormItem,
  NSpace,
  NDataTable,
  DataTableColumns,
  NTable,
  NRadioButton,
  NRadioGroup,
  NButton,
  NCheckbox,
} from "naive-ui"
import { numberToLetters } from "../common/utils"
import { Catchment } from "../types"

const exportType = ref("Peak")

const results = computed(() => {
  const res = catchments.value.map((catchment) => {
    if (exportType.value === "Peak") {
      return calculateTpCatchment(catchment)
    } else if (exportType.value === "Concentration") {
      return calculateTcCatchment(catchment)
    }
    throw Error("Unknown export type")
  })

  return res
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
    const headerRange = exportSheet.getRange(`F1:${numberToLetters(10)}1`)
    headerRange.merge()
    headerRange.format.horizontalAlignment = "Center"
    headerRange.format.borders.getItem("EdgeTop").style = "Continuous"
    headerRange.format.borders.getItem("EdgeLeft").style = "Continuous"
    headerRange.format.borders.getItem("EdgeRight").style = "Continuous"

    const rows = results.value.map((result) => [
      result.name,
      result.length ?? "",
      result.area ?? "",
      result.slope ?? "",
      result.runoffCoefficient ?? "",
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

const addCatchment = () => {
  catchments.value.push({ id: crypto.randomUUID(), name: "New catchment" })
}

const catchmentColumns: DataTableColumns<Catchment> = [
  {
    key: "remove",
    width: 10,
    render: (row) =>
      h(
        NButton,
        { onClick: () => (catchments.value = catchments.value.filter((c) => c.id !== row.id)) },
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
        "onUpdate:value": (value) => (row.name = value),
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
  // {
  //   title: "Kirpich",
  //   key: "kirpichEnabled",
  //   width: 80,
  //   className: "aligncenter",
  //   render: (row) =>
  //     h(NCheckbox, {
  //       checked: row.kirpichEnabled,
  //       onUpdateChecked: () => {
  //         row.kirpichEnabled = !row.kirpichEnabled
  //       },
  //     }),
  // },
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

const uplandTypeOptions = [
  {
    label: "Paved",
    value: "paved",
  },
  {
    label: "Unpaved",
    value: "unpaved",
  },
  {
    label: "Other (set velocity manually)",
    value: "other",
  },
]

const catchmentSelections = computed(() => {
  return catchments.value.map((catchment) => ({ value: catchment.id, label: catchment.name }))
})

const catchments = ref<Catchment[]>([
  {
    id: crypto.randomUUID(),
    name: "Catchment 1",
  },
])

const activeCatchmentId = ref<string | null>(null)

const activeCatchment = computed(() =>
  catchments.value.find((catchment) => catchment.id === activeCatchmentId.value)
)
</script>
