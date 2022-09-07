<template>
  <n-space vertical>
    <h1 class="text-center text-2xl">Pond Calculator</h1>

    <n-space>
      <n-button @click="importFromExcel">Import from Excel</n-button>
      <n-button @click="exportToExcel">Export to Excel</n-button>
    </n-space>
    <n-grid :cols="24">
      <n-grid-item :span="6">
        <n-form-item label="Override Volume?">
          <n-switch v-model:value="pond.overrideVolume" />
        </n-form-item>
        <n-form-item label="Volume Permanent (m3)">
          <n-input-number
            :value="pond.overrideVolume ? pond.customPermanentVolume : computedVolume.permanent"
            @update:value="(value) => (pond.customPermanentVolume = value)"
            :disabled="!pond.overrideVolume"
          />
        </n-form-item>
        <n-form-item label="Volume Active (m3)">
          <n-input-number
            :value="pond.overrideVolume ? pond.customActiveVolume : computedVolume.active"
            @update:value="(value) => (pond.customActiveVolume = value)"
            :disabled="!pond.overrideVolume"
          />
        </n-form-item>
        <n-form-item label="Catchment Area (ha)">
          <n-input-number
            v-model:value="pond.catchmentArea"
            :disabled="pond.overrideVolume"
          />
        </n-form-item>
      </n-grid-item>
      <n-grid-item :span="6">
        <n-form-item label="Imperviousness (%)">
          <n-input-number
            v-model:value="pond.imperviousness"
            :disabled="pond.overrideVolume || pond.overrideUnitRate"
            max="100"
          />
        </n-form-item>
        <n-form-item label="Use Custom Unit Rate?">
          <n-switch
            v-model:value="pond.overrideUnitRate"
            :disabled="pond.overrideVolume"
          />
        </n-form-item>
        <n-form-item label="Perm. Vol by Area (m3/ha)">
          <n-input-number
            :value="
              pond.overrideUnitRate ? pond.permanentUnitRate : computedVolume.permanentUnitRate
            "
            @update-value="(value) => (pond.permanentUnitRate = value)"
            :disabled="!pond.overrideUnitRate || pond.overrideVolume"
          />
        </n-form-item>
        <n-form-item label="Active Vol. by Area (m3/ha)">
          <n-input-number
            :value="pond.overrideUnitRate ? pond.activeUnitRate : computedVolume.activeUnitRate"
            @update-value="(value) => (pond.activeUnitRate = value)"
            :disabled="!pond.overrideUnitRate || pond.overrideVolume"
          />
        </n-form-item>
      </n-grid-item>

      <n-grid-item :span="6">
        <n-form-item label="Length to Width (X:1)">
          <n-input-number
            v-model:value="pond.lengthToWidth"
            :precison="0"
            min="1"
          />
        </n-form-item>

        <n-form-item label="Permanent Slope (X:1)">
          <n-input-number
            v-model:value="pond.permanentSlope"
            :precison="0"
            min="1"
          />
        </n-form-item>
        <n-form-item label="Active Slope (X:1)">
          <n-input-number
            v-model:value="pond.activeSlope"
            :precison="0"
            min="1"
          />
        </n-form-item>
        <n-form-item label="Freeboard Slope (X:1)">
          <n-input-number
            v-model:value="pond.freeboardSlope"
            :precison="0"
            min="1"
          />
        </n-form-item>
      </n-grid-item>
      <n-grid-item :span="6">
        <n-form-item label="Permanent Height (m)">
          <n-input-number
            v-model:value="pond.permanentHeight"
            :precison="2"
          />
        </n-form-item>
        <n-form-item label="Freeboard (m)">
          <n-input-number
            v-model:value="pond.freeboardHeight"
            :precison="2"
          />
        </n-form-item>
        <n-form-item label="Additional Buffer Width (m)">
          <n-input-number
            v-model:value="pond.bufferWidth"
            :precison="2"
          />
        </n-form-item>
      </n-grid-item>
    </n-grid>

    <!-- Scenario Table -->
    <n-data-table
      style="height: 300px"
      :columns="scenarioColumns"
      :data="scenarios"
      flex-height
    ></n-data-table>

    <n-button @click="addScenario">Add Scenario</n-button>

    <n-data-table
      style="height: 300px"
      id="results-data-table"
      :columns="activeResultsColumns"
      :data="results"
      flex-height
    ></n-data-table>
    <n-drawer
      v-model:show="active"
      to="#results-data-table"
      :height="300"
    >
      <n-drawer-content>
        <n-list>
          <template #header> Visible Columns </template>
          <n-list-item
            v-for="column of resultsColumns"
            :key="column.key"
          >
            <n-checkbox
              :checked="column.visible"
              @update:checked="() => (column.visible = !column.visible)"
              >{{ column.title }}</n-checkbox
            >
          </n-list-item>
        </n-list>
      </n-drawer-content>
    </n-drawer>

    <n-button @click="() => (active = !active)">Select Filters</n-button>

    <div style="display: flex; flex-direction: column">
      <pre>{{ JSON.stringify(results, null, 2) }}</pre>
    </div>
  </n-space>
</template>

<script setup lang="tsx">
import { CopyAdd20Regular, Delete20Regular } from "@vicons/fluent"
import { get } from "lodash-es"
import {
  NSpace,
  NCheckbox,
  NGrid,
  NGridItem,
  NFormItem,
  NInputNumber,
  NSwitch,
  NDataTable,
  NButton,
  NDrawerContent,
  NDrawer,
  NIcon,
  NList,
  NListItem,
  DataTableBaseColumn,
  NTooltip,
  useNotification,
} from "naive-ui"
import { InternalRowData } from "naive-ui/es/data-table/src/interface"
import { computed, h, reactive, ref } from "vue"
import { getKeyByValue, numberToLetters, pickObjectValues } from "../common/utils"
import { calculatePond, calculatePondPermanentVolume, storageLerp } from "../functions/ponds"

const active = ref(false)

const notification = useNotification()

const excelLabels = {
  overrideVolume: "Override Volume?",
  customActiveVolume: "Overridden Active Volume",
  customPermanentVolume: "Overriden Permanent Volume",
  imperviousness: "Imperviousness",
  catchmentArea: "Catchment Area",
  overrideUnitRate: "Use Custom Unit Rate?",
  permanentUnitRate: "Permanent Storage by Area",
  activeUnitRate: "Active Storage by Area",
  lengthToWidth: "Length to Width",
  permanentSlope: "Permanent Slope",
  activeSlope: "Active Slope",
  freeboardSlope: "Freeboard Slope",
  permanentHeight: "Permanent Height",
  freeboardHeight: "Freeboard Height",
  bufferWidth: "Buffer Width",
}

const importFromExcel = () => {
  Excel.run(async (context) => {
    // Send error if Pond Calculator Sheet is missing
    const sheet = context.workbook.worksheets.getItemOrNullObject("Pond Calculator")
    await context.sync()
    if (sheet.isNullObject) {
      notification.error({
        content: `ERROR: Unable to find sheet "Pond Calculator" to import from`,
        meta: `Use "Export to Excel" first to generate correct format`,
        keepAliveOnHover: true,
        duration: 3000,
      })
    }

    // Send error if PondCalculatorScenarios or ParametersTable is missing
    const scenarioTable = sheet.tables
      .getItemOrNullObject("PondCalculatorScenarios")
      .load({ rows: { $all: true } })
    const parametersTable = sheet.tables
      .getItemOrNullObject("ParametersTable")
      .load({ rows: { $all: true } })

    await context.sync()

    if (scenarioTable.isNullObject || parametersTable.isNullObject) {
      notification.error({
        content: `ERROR: Unable to import `,
        meta: `"Pond Calculator" sheet seems to be incorrectly formatted`,
        keepAliveOnHover: true,
        duration: 3000,
      })
    }

    pond.value = Object.fromEntries(
      parametersTable.rows.items.map((row) => {
        const [label, value] = row.values[0]
        const key = getKeyByValue(excelLabels, label)

        return [key, value]
      })
    )

    scenarios.value = scenarioTable.rows.items.flatMap((row) => {
      const values = row.values[0]

      return Object.fromEntries(values.map((value, index) => [scenarioColumns[index].key, value]))
    })
  })
}

// Export parameters, scenarios and results to excel
const exportToExcel = () => {
  Excel.run(async (context) => {
    context.workbook.worksheets.getItemOrNullObject("Pond Calculator").delete()
    await context.sync()

    const sheet = context.workbook.worksheets.add("Pond Calculator")

    // Export the scenarios table with actions filtered out as it has no value on the row data
    const scenarioColFiltered = scenarioColumns.filter((col) => col.key !== "actions")

    const scenarioTable = sheet.tables.add(
      `A1:${numberToLetters(scenarioColFiltered.length)}1`,
      true
    )

    scenarioTable.name = "PondCalculatorScenarios"

    scenarioTable.getHeaderRowRange().values = [scenarioColFiltered.map((col) => col.title)]

    const scenarioKeys = scenarioColFiltered.map((col) => col.key)

    scenarioTable.rows.add(
      -1,
      scenarios.value.map((scenario) => pickObjectValues(scenario, scenarioKeys as string[]))
    )

    // Export the results table below the scenarios table with 1 cell of spacing
    const offset1 = scenarios.value.length + 3

    const resultsTable = sheet.tables.add(
      `A${offset1}:${numberToLetters(resultsColumns.length)}${offset1}`,
      true
    )

    resultsTable.name = "PondCalculatorResults"

    resultsTable.getHeaderRowRange().values = [resultsColumns.map((col) => col.title)]

    const resultsKeys = resultsColumns.map((col) => col.key)

    resultsTable.rows.add(
      -1,
      results.value.map((result) => pickObjectValues(result, resultsKeys as string[]))
    )

    // Export the catchment characteristics below the results table
    const offset2 = scenarios.value.length + results.value.length + 5

    const paramTable = sheet.tables.add(`A${offset2}:B${offset2}`, true)

    paramTable.name = "ParametersTable"

    paramTable.getHeaderRowRange().values = [["Parameter", "Value"]]

    paramTable.rows.add(
      -1,
      Object.entries(excelLabels).map(([key, label]) => {
        return [label, get(pond.value, key)]
      })
    )

    sheet.activate()

    await context.sync()
  })
}

type Pond = {
  overrideVolume: boolean
  customActiveVolume: number | null
  customPermanentVolume: number | null
  catchmentArea: number
  imperviousness: number
  permanentHeight: number
  permanentSlope: number
  activeSlope: number
  freeboardSlope: number
  permanentUnitRate: number | null
  activeUnitRate: number | null
  overrideUnitRate: boolean
  freeboardHeight: number
  bufferWidth: number
  lengthToWidth: number
}

const pond = ref<Pond>({
  overrideVolume: false,
  customActiveVolume: 0,
  customPermanentVolume: 0,
  catchmentArea: 0,
  imperviousness: 85,
  permanentHeight: 1.1,
  overrideUnitRate: false,
  permanentUnitRate: 0,
  activeUnitRate: 0,
  freeboardHeight: 0.2,
  bufferWidth: 10,
  freeboardSlope: 6,
  activeSlope: 5,
  permanentSlope: 4,
  lengthToWidth: 3,
})

const computedVolume = computed(() => {
  if (pond.value.overrideUnitRate) {
    return {
      active: pond.value.catchmentArea * (pond.value.activeUnitRate ?? 0),
      permanent: pond.value.catchmentArea * (pond.value.permanentUnitRate ?? 0),
    }
  }
  return {
    active: pond.value.catchmentArea * 40,
    permanent: calculatePondPermanentVolume(pond.value.catchmentArea, pond.value.imperviousness),
    permanentUnitRate: storageLerp(pond.value.imperviousness),
    activeUnitRate: 40,
  }
})

const currencyFormater = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumSignificantDigits: 4,
})

// #region Scenarios

interface Scenario {
  landCost: number
  usdcDepth: number
  usdcPermanent: number
  usdcActive: number
  noUSDCPermanent: boolean
  aboveUnitCost: number
  usdcUnitCost: number
}

const scenarioColumns = reactive<DataTableBaseColumn<Scenario>[]>([
  {
    key: "landCost",
    title: "Land Cost ($/ha)",
    render(row) {
      return h(NInputNumber, {
        "onUpdate:value": (value) => (row.landCost = value ?? 0),
        value: row.landCost,
        showButton: false,
      })
    },
  },
  {
    key: "usdcDepth",
    title: "USDC Depth ($/ha)",
    render(row) {
      return h(NInputNumber, {
        "onUpdate:value": (value) => (row.usdcDepth = value ?? 0),
        value: row.usdcDepth,
        showButton: false,
      })
    },
  },
  {
    key: "noUSDCPermanent",
    title: "No USDC Perm Storage?",
    render(row) {
      return h(NSwitch, {
        "onUpdate:value": (value) => (row.noUSDCPermanent = value),
        value: row.noUSDCPermanent,
      })
    },
  },
  {
    key: "usdcPermanent",
    title: "USDC Perm (%)",
    render(row) {
      return h(NInputNumber, {
        "onUpdate:value": (value) => (row.usdcPermanent = value ?? 0),
        value: row.usdcPermanent,
        showButton: false,
      })
    },
  },
  {
    key: "usdcActive",
    title: "USDC Active (%)",
    render(row) {
      return h(NInputNumber, {
        "onUpdate:value": (value) => (row.usdcActive = value ?? 0),
        value: row.usdcActive,
        showButton: false,
      })
    },
  },
  {
    key: "aboveUnitCost",
    title: "Pond Unit Volume Cost ($/m3)",
    render(row) {
      return h(NInputNumber, {
        "onUpdate:value": (value) => (row.aboveUnitCost = value ?? 0),
        value: row.aboveUnitCost,
        showButton: false,
      })
    },
  },
  {
    key: "usdcUnitCost",
    title: "USDC Unit Area Cost ($/m2)",
    render(row) {
      return h(NInputNumber, {
        "onUpdate:value": (value) => (row.usdcUnitCost = value ?? 0),
        value: row.usdcUnitCost,
        showButton: false,
      })
    },
  },
  {
    key: "actions",
    title: "Actions",
    render(row) {
      return (
        <span>
          <NTooltip>
            {{
              default: () => "Duplicate",
              trigger: () => (
                <NButton
                  text
                  style={{ fontSize: "20px" }}
                  onClick={() => {
                    scenarios.value.push({ ...row })
                  }}
                >
                  {{
                    default: () => (
                      <NIcon>
                        {{
                          default: () => <CopyAdd20Regular />,
                        }}
                      </NIcon>
                    ),
                  }}
                </NButton>
              ),
            }}
          </NTooltip>
          <NTooltip>
            {{
              default: () => "Delete",
              trigger: () => (
                <NButton
                  text
                  style={{ fontSize: "20px" }}
                  onClick={() => {
                    scenarios.value = scenarios.value.filter((scenario) => row !== scenario)
                  }}
                >
                  {{
                    default: () => (
                      <NIcon>
                        {{
                          default: () => <Delete20Regular />,
                        }}
                      </NIcon>
                    ),
                  }}
                </NButton>
              ),
            }}
          </NTooltip>
        </span>
      )
    },
  },
])

const scenarios = ref<Scenario[]>([
  {
    landCost: 10,
    noUSDCPermanent: true,
    aboveUnitCost: 10,
    usdcDepth: 1.8,
    usdcUnitCost: 200,
    usdcPermanent: 20,
    usdcActive: 90,
  },
])

const addScenario = () => {
  scenarios.value.push({
    landCost: 10,
    noUSDCPermanent: true,
    aboveUnitCost: 10,
    usdcDepth: 1.8,
    usdcUnitCost: 200,
    usdcPermanent: 20,
    usdcActive: 90,
  })
}
// #endregion Scenarios

// #region Results

type ResultsColumn = DataTableBaseColumn<ReturnType<typeof calculateScenario>> & {
  visible: boolean
}

const activeResultsColumns = computed(() => {
  return resultsColumns.filter((col) => col.visible)
})

const renderAsCurrency =
  <T extends InternalRowData>(key: keyof T) =>
  (row: T) => {
    return h(currencyFormater.format(row[key] as number))
  }

const currencyColumn = (columnDefs: ResultsColumn) => ({
  ...columnDefs,
  render(row: any) {
    const value = get(row, columnDefs.key)
    if (isNaN(value)) {
      return "-"
    }
    return `${currencyFormater.format(value as number)}`
  },
})

const roundedColumn = (columnDefs: ResultsColumn, decimals = 2) => ({
  ...columnDefs,
  render(row: any) {
    const value = get(row, columnDefs.key)
    if (isNaN(value)) {
      return "-"
    }
    return h("span", `${(row[columnDefs.key] as number).toFixed(decimals)}`)
  },
})

const resultsColumns = reactive<ResultsColumn[]>([
  currencyColumn({
    key: "pondStorageCost",
    title: "Pond Storage Cost ($)",
    visible: false,
  }),

  currencyColumn({
    key: "pondLandCost",
    title: "Pond Land Cost ($)",
    visible: false,
  }),
  currencyColumn({
    key: "pondTotalCost",
    title: "Pond Total Cost ($)",
    visible: true,
  }),
  currencyColumn({
    key: "tankTotalCost",
    title: "Tank Total Cost ($)",
    visible: true,
  }),
  roundedColumn(
    {
      key: "landSaved",
      title: "Land Saved (ha)",
      visible: false,
    },
    2
  ),
  currencyColumn({
    key: "landSavedCost",
    title: "Land Value Saved ($)",
    visible: true,
  }),
  roundedColumn(
    {
      key: "pond.top.area",
      title: "Pond Area (m2)",
      visible: false,
    },
    2
  ),
  roundedColumn(
    {
      key: "tank.area",
      title: "Tank Area (m2)",
      visible: false,
    },
    1
  ),
  roundedColumn(
    {
      key: "pondTotalVolume",
      title: "Pond Total Volume (m3)",
      visible: false,
    },
    0
  ),
  roundedColumn(
    {
      key: "pond.permanent.height",
      title: "Pond Permanent Height (m)",
      visible: false,
    },
    2
  ),
  roundedColumn(
    {
      key: "pond.active.height",
      title: "Pond Active Height (m)",
      visible: false,
    },
    2
  ),
])

const calculateScenario = (pondDef: Pond, scenario: Scenario) => {
  const {
    overrideVolume,
    customActiveVolume,
    customPermanentVolume,
    overrideUnitRate,
    catchmentArea,
    activeUnitRate,
    permanentUnitRate,
    imperviousness,
    permanentSlope,
    activeSlope,
    freeboardSlope,
    bufferWidth,
    freeboardHeight,
    permanentHeight,
    lengthToWidth,
  } = pondDef

  // Use custom permanent volume if chosen, if not use custom unit rate, if not calculate based on imperviousness
  const permanentVolume =
    (overrideVolume
      ? customPermanentVolume
      : overrideUnitRate
      ? (permanentUnitRate ?? 0) * catchmentArea
      : calculatePondPermanentVolume(catchmentArea, imperviousness)) ?? 0

  // Use custom active volume if chosen, if not use custom unit rate, if not use the standard MOE 40m3/ha
  const activeVolume =
    (overrideVolume
      ? customActiveVolume
      : overrideUnitRate
      ? (activeUnitRate ?? 0) * catchmentArea
      : catchmentArea * 40) ?? 0

  const pondDimensions = {
    permanentSlope,
    activeSlope,
    freeboardSlope,
    bufferWidth,
    lengthToWidth,
  }

  const pondCalculator = calculatePond(pondDimensions)

  // Calculate if we only used a pond, needed to get land saved
  const onlyPond = pondCalculator({
    permanentVolume,
    activeVolume,
    freeboardHeight,
    permanentHeight,
  })

  // Calculate the parameters for the reduced pond size
  const pond = pondCalculator({
    permanentVolume: ((100 - scenario.usdcPermanent) / 100) * permanentVolume,
    activeVolume: ((100 - scenario.usdcPermanent) / 100) * activeVolume,
    freeboardHeight,
    permanentHeight,
  })

  // Calculate the tank parameters
  const tank = {
    permanentVolume: scenario.noUSDCPermanent
      ? 0
      : (scenario.usdcPermanent * permanentVolume) / 100,
    activeVolume: (scenario.usdcActive * activeVolume) / 100,
    get area() {
      return this.totalVolume / scenario.usdcDepth
    },
    get totalVolume() {
      return this.activeVolume + this.permanentVolume
    },
  }

  return {
    landSaved: (onlyPond.top.area - pond.top.area) / 10000,
    pondLandCost: (pond.top.area * scenario.landCost) / 10000,
    pondTotalVolume: pond.permanent.volume + pond.active.volume,
    get pondStorageCost() {
      return this.pondTotalVolume * scenario.aboveUnitCost
    },
    get pondTotalCost() {
      return this.pondLandCost + this.pondStorageCost
    },
    get tankTotalCost() {
      return this.tank.area * scenario.usdcUnitCost
    },
    get landSavedCost() {
      return this.landSaved * scenario.landCost
    },
    pond,
    tank,
    onlyPond,
  }
}

const results = computed(() => {
  return scenarios.value.map((scenario) => calculateScenario(pond.value, scenario))
})

// #endregion
</script>
