<template>
  <div class="">
    <n-form :model="pond" class="">
      <n-form-item label="Catchment Area (ha)" path="catchmentArea">
        <n-input-number v-model:value="pond.catchmentArea" placeholder="40" />
      </n-form-item>
      <n-form-item label="Impervious (%)" path="imperviousness">
        <n-input-number step="5" v-model:value="pond.imperviousness" placeholder="40" />
      </n-form-item>
    </n-form>
    <n-button @click="addScenario">Add Scenario</n-button>
    <n-data-table :columns="columns" :data="scenarios" />

    <n-data-table :columns="resultsColumns" :data="results" />

    <!-- <p>Permanent Volume (m<sup>3</sup>): {{ permanentVolume.toFixed(0) }}</p>
    <p>Active Volume (m<sup>3</sup>): {{ activeVolume.toFixed(0) }}</p>
    <h1 class="text-xl">Above Ground:</h1>
    <p>Permanent Volume (m<sup>3</sup>): {{ abovePermanentVolume.toFixed(0) }}</p>
    <p>Active Volume (m<sup>3</sup>): {{ aboveActiveVolume.toFixed(0) }}</p>
    <h1 class="text-xl">Below Ground:</h1>
    <p>Permanent Volume (m<sup>3</sup>): {{ undergroundPermanentVolume.toFixed(0) }}</p>
    <p>Active Volume (m<sup>3</sup>): {{ undergroundActiveVolume.toFixed(0) }}</p>
    <h1 class="text-xl">Costs</h1>
    <p>Cost Land:</p>
    <p>Cost Wet Pond:</p>
    <p>Cost Underground: {{}}</p>
    <p>Land Saved (m<sup>2</sup>): {{ landSaved.toFixed(0) }}</p>
    <p>Land Saved Value ($): {{ currencyFormater.format(landSavedValue) }}</p> -->

    {{ results }}
  </div>
</template>

<script setup lang="ts">
import { NForm, NFormItem, NInputNumber, NTable, NDataTable, DataTableColumns, NButton } from "naive-ui"
import { reactive, computed, ref, h } from "vue"
import { caclulateExtendedDetention, calculateLandArea, calculatePondVolume } from "../functions/ponds"

const currencyFormater = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumSignificantDigits: 4,
})

const resultsColumns: DataTableColumns<ScenarioResult> = [
  {
    key: "pondCost",
    title: "Pond Cost",
    render(row) {
      return h("span", currencyFormater.format(row.pondCost))
    },
  },
  {
    key: "usdcCost",
    title: "Underground SDC Cost",
    render(row) {
      return h("span", currencyFormater.format(row.usdcCost))
    },
  },
  {
    key: "maintenanceCost",
    title: "Maintenance Cost",
    render(row) {
      return h("span", currencyFormater.format(row.pondCost))
    },
  },
  {
    key: "landCostSaved",
    title: "Land Value Saved ($)",
    render(row) {
      return h("span", currencyFormater.format(row.landCostSaved))
    },
  },
]

const columns: DataTableColumns<Scenario> = [
  {
    key: "landCost",
    title: "Land Cost ($)",
    render(row, index) {
      return h(NInputNumber, {
        value: row.landCost,
        onUpdateValue(v) {
          scenarios.value[index].landCost = v!
        },
      })
    },
  },
  {
    key: "usdcPermanent",
    title: "USDC Permanent (%)",
    render(row, index) {
      return h(NInputNumber, {
        value: row.usdcPermanent,
        onUpdateValue(v) {
          scenarios.value[index].usdcPermanent = v!
        },
      })
    },
  },
  {
    key: "usdcActive",
    title: "USDC Active (%)",
    render(row, index) {
      return h(NInputNumber, {
        value: row.usdcActive,
        onUpdateValue(v) {
          scenarios.value[index].usdcActive = v!
        },
      })
    },
  },
  {
    key: "aboveUnitCost",
    title: "Pond Capital Cost ($/m3)",
    render(row, index) {
      return h(NInputNumber, {
        value: row.aboveUnitCost,
        onUpdateValue(v) {
          scenarios.value[index].aboveUnitCost = v!
        },
      })
    },
  },
  {
    key: "aboveMaintenanceCost",
    title: "Pond Maintenance Cost ($/m3)",
    render(row, index) {
      return h(NInputNumber, {
        value: row.aboveMaintenanceCost,
        onUpdateValue(v) {
          scenarios.value[index].aboveMaintenanceCost = v!
        },
      })
    },
  },
  {
    key: "usdcUnitCost",
    title: "USDC Capital Cost ($/m3)",
    render(row, index) {
      return h(NInputNumber, {
        value: row.usdcUnitCost,
        onUpdateValue(v) {
          scenarios.value[index].usdcUnitCost = v!
        },
      })
    },
  },
  {
    key: "usdcMaintenanceCost",
    title: "USDC Maintence Cost ($/m3)",
    render(row, index) {
      return h(NInputNumber, {
        value: row.usdcMaintenanceCost,
        onUpdateValue(v) {
          scenarios.value[index].usdcMaintenanceCost = v!
        },
      })
    },
  },
]

interface Pond {
  catchmentArea: number
  imperviousness: number
  permanentHeight: number
}

interface Scenario {
  landCost: number
  usdcPermanent: number
  usdcActive: number
  aboveUnitCost: number
  usdcUnitCost: number
  aboveMaintenanceCost: number
  usdcMaintenanceCost: number
}

interface ScenarioResult {
  landCostSaved: number
  pondCost: number
  usdcCost: number
  maintenanceCost: number
}

const pond = reactive({
  catchmentArea: 10,
  imperviousness: 50,
  permanentHeight: 1.5,
})

const addScenario = () => {
  scenarios.value.push({
    aboveMaintenanceCost: 500,
    aboveUnitCost: 100,
    landCost: 1000,
    usdcActive: 20,
    usdcUnitCost: 1000,
    usdcMaintenanceCost: 50,
    usdcPermanent: 20,
  })
}

const scenarios = ref<Scenario[]>([])

const calculateScenario = (pond: Pond, scenario: Scenario): ScenarioResult => {
  const onlyPond = {
    permVolume: calculatePondVolume(pond.catchmentArea, pond.imperviousness),
    activeVolume: caclulateExtendedDetention(pond.catchmentArea),
    get area() {
      return calculateLandArea(pond.permanentHeight, this.permVolume, this.activeVolume)
    },
    get landCost() {
      return this.area * scenario.landCost
    },
  }

  const permPond = (100 - scenario.usdcPermanent) / 100
  const activePond = (100 - scenario.usdcActive) / 100
  const wetPond = {
    permVolume: onlyPond.permVolume * permPond,
    activeVolume: onlyPond.activeVolume * activePond,
    get totalVolume() {
      return this.permVolume + this.activeVolume
    },
    get area() {
      return calculateLandArea(pond.permanentHeight, this.permVolume, this.activeVolume)
    },
    get landCost() {
      return this.area * scenario.landCost
    },
    get capitalCost() {
      return this.landCost + this.totalVolume * scenario.aboveUnitCost
    },
    get maintenanceCost() {
      return this.totalVolume * scenario.aboveMaintenanceCost
    },
  }

  const permUSDC = scenario.usdcPermanent / 100
  const activeUSDC = scenario.usdcActive / 100
  const usdc = {
    permVolume: onlyPond.permVolume * permUSDC,
    activeVolume: onlyPond.activeVolume * activeUSDC,
    get totalVolume() {
      return this.permVolume + this.activeVolume
    },
    get capitalCost() {
      return this.totalVolume * scenario.usdcUnitCost
    },
    get maintenanceCost() {
      return this.totalVolume * scenario.usdcMaintenanceCost
    },
  }

  const landCostSaved = onlyPond.landCost - wetPond.landCost

  return {
    landCostSaved,
    pondCost: wetPond.capitalCost,
    usdcCost: usdc.capitalCost,
    maintenanceCost: wetPond.maintenanceCost + usdc.maintenanceCost,
    pondArea: wetPond.area,
  }
}

const results = computed(() => {
  return scenarios.value.map((scenario) => calculateScenario(pond, scenario))
})
</script>
