<template>
  <n-space vertical>
    <h1 class="text-center text-2xl">Pond Calculator</h1>

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

    <n-button @click="() => (active = !active)">Select Columns</n-button>

    <div style="display: flex; flex-direction: column">
      <pre>{{ JSON.stringify(results, null, 2) }}</pre>
    </div>
  </n-space>
</template>

<script setup lang="tsx">
import { CopyAdd20Regular, Delete20Regular } from "@vicons/fluent"
import { get } from "lodash-es"
import {
  DataTableBaseColumn,
  NButton,
  NCheckbox,
  NDataTable,
  NDrawer,
  NDrawerContent,
  NFormItem,
  NGrid,
  NGridItem,
  NIcon,
  NInputNumber,
  NList,
  NListItem,
  NSpace,
  NSwitch,
  NTooltip,
  useNotification,
} from "naive-ui"
import { computed, h, reactive, ref } from "vue"
import { getKeyByValue, numberToLetters, pickObjectValues } from "../../common/utils"
import { calculatePond, calculatePondPermanentVolume, storageLerp } from "../../functions/ponds"

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
  catchmentArea: 10,
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

const parseThousands = (input: string) => {
  const nums = input.replace(/(,|\$|\s)/g, "").trim()
  if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums)
  return nums === "" ? null : Number.NaN
}

const formatThousands = (value: number | null) => {
  if (value === null) return ""
  return value.toLocaleString("en-US")
}

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
      return h("span", [
        h(NTooltip, null, {
          default: () => "Duplicate",
          trigger: () =>
            h(
              NButton,
              {
                text: true,
                style: { fontSize: "20px" },
                onClick: () => {
                  scenarios.value.push({ ...row })
                },
              },
              {
                default: () =>
                  h(NIcon, null, {
                    default: () => h(CopyAdd20Regular),
                  }),
              },
            ),
        }),
        h(NTooltip, null, {
          default: () => "Delete",
          trigger: () =>
            h(
              NButton,
              {
                text: true,
                style: { fontSize: "20px" },
                onClick: () => {
                  scenarios.value = scenarios.value.filter((scenario) => row !== scenario)
                },
              },
              {
                default: () =>
                  h(NIcon, null, {
                    default: () => h(Delete20Regular),
                  }),
              },
            ),
        }),
      ])
    },
  },
])

const scenarios = ref<Scenario[]>([
  {
    landCost: 1000000,
    noUSDCPermanent: false,
    aboveUnitCost: 500,
    usdcDepth: 1.8,
    usdcUnitCost: 2000,
    usdcPermanent: 0,
    usdcActive: 50,
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
    return h("span", `${(value as number).toFixed(decimals)}`)
  },
})

const renderTooltip = (trigger: any, content: any) => {
  return h(NTooltip, null, {
    trigger: () => trigger,
    default: () => content,
  })
}

const resultsColumns = reactive<ResultsColumn[]>([
  currencyColumn({
    key: "pondStorageCost",
    title: "Pond Storage Cost",
    visible: true,
  }),

  currencyColumn({
    key: "pondLandCost",
    title(column) {
      return renderTooltip("Pond Land Cost", "Pond Surface Area (ha) * Land Cost (m/ha)")
    },
    visible: true,
  }),
  currencyColumn({
    key: "pondTotalCost",
    title(column) {
      return renderTooltip("Pond Total Cost", "Pond Land Cost + Pond Storage Cost")
    },
    visible: true,
  }),
  currencyColumn({
    key: "tankTotalCost",
    title: "Tank Storage Cost",
    visible: true,
  }),

  currencyColumn({
    key: "totalCosts",
    title(column) {
      return renderTooltip("Total Costs", "Pond Costs + Tank Costs")
    },
    visible: true,
  }),
  roundedColumn(
    {
      key: "landSaved",
      title(column) {
        return renderTooltip("Land Saved (ha)", "(Area if only pond) - (Area of reduced pond)")
      },
      visible: true,
    },
    2,
  ),
  currencyColumn({
    key: "landSavings",
    title: "Land Value Saved",
    visible: true,
  }),
  currencyColumn({
    key: "pondSavings",
    title(column) {
      return renderTooltip(
        "Pond Storage Savings (ha)",
        "(Volume if only pond - Volume of reduced pond) * Pond Unit Volume Cost",
      )
    },
    visible: true,
  }),
  currencyColumn({
    key: "totalSavings",
    title: "Total Savings",
    visible: true,
  }),
  currencyColumn({
    key: "costDifference",
    title: "Cost Difference",
    visible: true,
  }),
  roundedColumn(
    {
      key: "pond.top.area",
      title: "Pond Area (m2)",
      visible: false,
    },
    2,
  ),
  roundedColumn(
    {
      key: "tank.permanentVolume",
      title: "Tank Permanent Volume (m3)",
      visible: false,
    },
    1,
  ),
  roundedColumn(
    {
      key: "tank.activeVolume",
      title: "Tank Active Volume (m3)",
      visible: false,
    },
    1,
  ),
  roundedColumn(
    {
      key: "tank.totalVolume",
      title: "Tank Volume (m3)",
      visible: false,
    },
    1,
  ),
  roundedColumn(
    {
      key: "tank.area",
      title: "Tank Area (m2)",
      visible: false,
    },
    1,
  ),
  roundedColumn(
    {
      key: "pond.permanent.volume",
      title: "Pond Permanent Volume (m3)",
      visible: false,
    },
    0,
  ),
  roundedColumn(
    {
      key: "pond.active.volume",
      title: "Pond Active Volume (m3)",
      visible: false,
    },
    0,
  ),
  roundedColumn(
    {
      key: "pondTotalVolume",
      title: "Pond Total Volume (m3)",
      visible: false,
    },
    0,
  ),
  roundedColumn(
    {
      key: "pond.permanent.height",
      title: "Pond Permanent Height (m)",
      visible: false,
    },
    2,
  ),
  roundedColumn(
    {
      key: "pond.active.height",
      title: "Pond Active Height (m)",
      visible: false,
    },
    2,
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
    activeVolume: ((100 - scenario.usdcActive) / 100) * activeVolume,
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
    pond,
    tank,
    onlyPond,
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
  return scenarios.value.map((scenario) => calculateScenario(pond.value, scenario))
})

// #endregion
</script>
