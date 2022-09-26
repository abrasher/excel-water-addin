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

<script setup lang="ts">
import { CopyAdd20Regular, Delete20Regular } from "@vicons/fluent"
import { DataTableBaseColumn, NButton, NIcon, NInputNumber, NSwitch, NTooltip } from "naive-ui"
import { h, reactive, ref } from "vue"
import { formatThousands, parseThousands } from "../../common/utils"
import { Scenario } from "./types"

const sidebar = ref(false)

type ResultsColumn = DataTableBaseColumn<ReturnType<typeof calculateScenario>> & {
  visible: boolean
}

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
</script>
