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

    <div style="display: flex; flex-direction: column">
      <pre>{{ JSON.stringify(results, null, 2) }}</pre>
    </div>
  </n-space>
</template>

<script setup lang="tsx">
import { get } from "lodash-es"
import {
  NButton,
  NFormItem,
  NGrid,
  NGridItem,
  NInputNumber,
  NSpace,
  NSwitch,
  useNotification,
} from "naive-ui"
import { storeToRefs } from "pinia"
import { computed } from "vue"
import { getKeyByValue, numberToLetters, pickObjectValues } from "../../common/utils"
import { calculatePondPermanentVolume, storageLerp } from "./calculations"
import { usePondStore } from "./pondStore"
import { calculatePond } from "./StackedFrustum"
import { Pond } from "./types"

const store = usePondStore()

const { pond } = storeToRefs(store)

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

// #endregion Scenarios

// #region Results

const activeResultsColumns = computed(() => {
  return resultsColumns.filter((col) => col.visible)
})

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
    plantingWidth,
    plantingSlope,
    plantingAsStorage,
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
    plantingSlope,
  }

  // Calculate if we only used a pond, needed to get land saved
  const onlyPond = calculatePond({
    permanentSlope,
    activeSlope,
    freeboardSlope,
    bufferWidth,
    lengthToWidth,
    plantingSlope,
    permanentVolume,
    activeVolume,
    freeboardHeight,
    permanentHeight,
    plantingWidth,
    plantingAsStorage,
  })

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
    onlyPond,
    landSaved: (onlyPond.area - pond.area) / 10000,
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
  return scenarios.value.map((scenario) => calculateScenario(pond.value, scenario))
})

// #endregion
</script>
