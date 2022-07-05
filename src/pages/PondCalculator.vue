<template>
  <div class="pl-2">
    <n-form :model="data" class="flex">
      <n-form-item label="Catchment Area (ha)" path="catchmentArea">
        <n-input-number v-model:value="data.catchmentArea" placeholder="40" />
      </n-form-item>
      <n-form-item label="Impervious (%)" path="imperviousness">
        <n-input-number step="5" v-model:value="data.imperviousness" placeholder="40" />
      </n-form-item>
      <n-form-item label="Permanent Water Height (m)" path="permanentHeight">
        <n-input-number step="0.1" v-model:value="data.permanentHeight" placeholder="1.5" />
      </n-form-item>
      <n-form-item label="Permanent Volume Underground (%)" path="undergroundPermanent">
        <n-input-number step="5" v-model:value="data.undergroundPermanent" placeholder="1.5" />
      </n-form-item>
      <n-form-item label="Active Volume Underground (%)" path="undergroundActive">
        <n-input-number step="5" v-model:value="data.undergroundActive" placeholder="1.5" />
      </n-form-item>
      <n-form-item label="Land Cost ($/ha)" path="landCost">
        <n-input-number step="100000" v-model:value="data.landCost" placeholder="40" />
      </n-form-item>
    </n-form>

    <p>Permanent Volume (m<sup>3</sup>): {{ permanentVolume.toFixed(0) }}</p>
    <p>Active Volume (m<sup>3</sup>): {{ activeVolume.toFixed(0) }}</p>
    <h1 class="text-xl">Above Ground:</h1>
    <p>Permanent Volume (m<sup>3</sup>): {{ abovePermanentVolume.toFixed(0) }}</p>
    <p>Active Volume (m<sup>3</sup>): {{ aboveActiveVolume.toFixed(0) }}</p>
    <h1 class="text-xl">Below Ground:</h1>
    <p>Permanent Volume (m<sup>3</sup>): {{ undergroundPermanentVolume.toFixed(0) }}</p>
    <p>Active Volume (m<sup>3</sup>): {{ undergroundActiveVolume.toFixed(0) }}</p>
    <h1 class="text-xl">Land</h1>
    <p>Land Saved (m<sup>2</sup>): {{ landSaved.toFixed(0) }}</p>
    <p>Land Saved Value ($): {{ currencyFormater.format(landSavedValue) }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "@vue/reactivity"
import { NForm, NFormItem, NInputNumber } from "naive-ui"
import { reactive } from "vue"
import { caclulateExtendedDetention, calculateLandArea, calculatePondVolume } from "../functions/ponds"

const data = reactive({
  catchmentArea: 10,
  imperviousness: 50,
  permanentHeight: 1.5,
  landCost: 2000000,
  undergroundPermanent: 30,
  undergroundActive: 30,
  aboveUnitCost: 50000,
  undergroundUnitCost: 500000,
})

const currencyFormater = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumSignificantDigits: 4,
})

const permanentVolume = computed(() => calculatePondVolume(data.catchmentArea, data.imperviousness))
const activeVolume = computed(() => caclulateExtendedDetention(data.catchmentArea))

const undergroundPermanentVolume = computed(() => (data.undergroundPermanent / 100) * permanentVolume.value)
const undergroundActiveVolume = computed(() => (data.undergroundActive / 100) * activeVolume.value)

const abovePermanentVolume = computed(() => permanentVolume.value - undergroundPermanentVolume.value)
const aboveActiveVolume = computed(() => activeVolume.value - undergroundActiveVolume.value)

const originalArea = computed(() => calculateLandArea(data.permanentHeight, permanentVolume.value, activeVolume.value))
const resizedArea = computed(() =>
  calculateLandArea(data.permanentHeight, abovePermanentVolume.value, aboveActiveVolume.value)
)

const landSaved = computed(() => originalArea.value - resizedArea.value)
const landSavedValue = computed(() => (data.landCost * landSaved.value) / 10000)
</script>
