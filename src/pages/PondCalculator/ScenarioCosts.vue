<template>
  <!-- Scenario Table -->
  <n-data-table
    style="height: 300px"
    :columns="scenarioColumns"
    :data="scenarios"
    flex-height
  ></n-data-table>

  <n-button @click="addScenario">Add Scenario</n-button>

  <!-- Results Table -->
  <n-data-table
    style="height: 300px"
    id="results-data-table"
    :columns="activeResultsColumns"
    :data="results"
    flex-height
  ></n-data-table>
  <n-drawer
    v-model:show="sidebar"
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

  <n-button @click="() => (sidebar = !sidebar)">Select Columns</n-button>
</template>

<script setup lang="tsx">
import { CopyAdd20Regular, Delete20Regular } from "@vicons/fluent"
import get from "lodash-es/get"
import {
  DataTableBaseColumn,
  NButton,
  NCheckbox,
  NDataTable,
  NDrawer,
  NDrawerContent,
  NIcon,
  NInputNumber,
  NList,
  NSwitch,
  NTooltip,
} from "naive-ui"
import { storeToRefs } from "pinia"
import { computed, h, reactive, ref } from "vue"
import { formatThousands, parseThousands } from "../../common/utils"
import { calculatePondPermanentVolume } from "./calculations"
import { usePondStore } from "./pondStore"
import { calculatePond } from "./StackedFrustum"
import { Scenario } from "./types"

const sidebar = ref(false)
const store = usePondStore()

const { scenarios } = storeToRefs(store)

const calculateScenario = (scenario: Scenario) => {
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
    plantingWidth,
    plantingSlope,
    plantingAsStorage,
  } = store.pond

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

  // Calculate the parameters for the reduced pond size
  const pond = calculatePond({
    permanentSlope,
    activeSlope,
    freeboardSlope,
    bufferWidth,
    lengthToWidth,
    plantingSlope,
    permanentVolume: ((100 - scenario.usdcPermanent) / 100) * permanentVolume,
    activeVolume: ((100 - scenario.usdcActive) / 100) * activeVolume,
    freeboardHeight,
    permanentHeight,
    plantingWidth,
    plantingAsStorage,
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
    pond,
    tank,
    onlyPond: store.result,
    landSaved: (store.result.area - pond.area) / 10000,
    pondLandCost: (pond.area * scenario.landCost) / 10000,
    pondTotalVolume: pond.permanent.volume + pond.active.volume,
    get pondStorageCost() {
      return this.pondTotalVolume * scenario.aboveUnitCost
    },
    get pondTotalCost() {
      return this.pondLandCost + this.pondStorageCost
    },
    get tankTotalCost() {
      return this.tank.totalVolume * scenario.usdcUnitCost
    },
    get landSavings() {
      return this.landSaved * scenario.landCost
    },
    get pondSavings() {
      const volumeDifference =
        this.onlyPond.active.volume +
        this.onlyPond.permanent.volume -
        this.pond.permanent.volume -
        this.pond.active.volume
      return volumeDifference * scenario.aboveUnitCost
    },
    get totalCosts() {
      return this.pondTotalCost + this.tankTotalCost
    },
    get totalSavings() {
      return this.landSavings + this.pondSavings
    },
    get costDifference() {
      return this.totalCosts - this.totalSavings
    },
  }
}
const results = computed(() => {
  return scenarios.value.map((scenario) => calculateScenario(scenario))
})

type ResultsColumn = DataTableBaseColumn<ReturnType<typeof calculateScenario>> & {
  visible: boolean
}

const activeResultsColumns = computed(() => {
  return resultsColumns.filter((col) => col.visible)
})

// Column Value Formatters
const roundedColumn = (columnDefs: ResultsColumn, decimals = 2) => ({
  ...columnDefs,
  render(row: any) {
    const value = get(row, columnDefs.key)
    if (isNaN(value)) {
      return "-"
    }
    return h("span", `${(value as number).toFixed(decimals)}`)
  },
})

const renderTooltip = (trigger: any, content: any) => {
  return h(NTooltip, null, {
    trigger: () => trigger,
    default: () => content,
  })
}

const currencyFormater = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumSignificantDigits: 4,
})

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

// #region Scenarios

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

const scenarioColumns = reactive<DataTableBaseColumn<Scenario>[]>([
  {
    key: "landCost",
    title: "Land Cost ($/ha)",
    render(row) {
      return h(NInputNumber, {
        "onUpdate:value": (value) => (row.landCost = value ?? 0),
        value: row.landCost,
        showButton: false,
        parse: parseThousands,
        format: formatThousands,
      })
    },
  },
  {
    key: "usdcDepth",
    title: "USDC Depth (m)",
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
    title: "Perm Handled by USDC  (%)",
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
    title: "Active Handled by USDC (%)",
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
    title: "USDC Unit Area Cost ($/m3)",
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

// #endregion Scenarios

// #region Results
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

// #endregion Results
</script>
