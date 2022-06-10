<template>
  <n-space vertical class="define">
    <n-select :value="activeCatchmentId" :options="catchmentOptions" @update:value="(val) => setActiveCatchment(val)">
    </n-select>

    <n-form
      v-if="activeCatchment"
      :model="activeCatchment"
      :key="activeCatchment.id"
      label-placement="left"
      label-width="auto"
      class="define-form"
      size="small"
    >
      <n-h3 prefix="bar"><n-text>General Parameters</n-text></n-h3>
      <n-form-item label="Flow Length (m)" path="length">
        <n-input-number v-model:value="activeCatchment.length" />
      </n-form-item>
      <n-form-item label="Slope (%)" path="slope">
        <n-input-number v-model:value="activeCatchment.slope" />
      </n-form-item>
      <!-- SCS -->
      <template v-if="activeCatchment?.scsEnabled">
        <n-h3 prefix="bar">SCS Method Parameters</n-h3>
        <n-form-item label="Curve Number" path="curveNumber">
          <n-input-number v-model:value="activeCatchment.curveNumber" />
        </n-form-item>
      </template>
      <!-- Airport -->
      <template v-if="activeCatchment?.airportEnabled">
        <n-h3 prefix="bar">Airport Method Parameters</n-h3>
        <n-form-item label="Runoff Coeff." path="runoffCofficient">
          <n-input-number v-model:value="activeCatchment.runoffCofficient" />
        </n-form-item>
      </template>
      <!-- Bransby Williams -->
      <template v-if="activeCatchment?.bransbyWilliamsEnabled">
        <n-h3 prefix="bar">Bransby Williams Parameters</n-h3>
        <n-form-item label="Area (ha)" path="area">
          <n-input-number v-model:value="activeCatchment.area" />
        </n-form-item>
      </template>
      <!-- Upland -->
      <template v-if="activeCatchment?.uplandEnabled">
        <n-h3 prefix="bar">Upland Method Parameters</n-h3>
        <n-form-item label="Land Type" path="uplandType">
          <n-select :options="uplandTypeOptions" v-model:value="activeCatchment.uplandType" />
        </n-form-item>
        <n-form-item label="Velocity (m/s)" path="uplandVelocity" v-if="activeCatchment.uplandType === 'other'">
          <n-input-number v-model:value="activeCatchment.uplandVelocity" />
        </n-form-item>
      </template>
      <!-- Kirpich -->
      <template v-if="activeCatchment?.kirpichEnabled">
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
      </template>
      <!-- Kinematic Wave -->
      <template> </template>
    </n-form>
  </n-space>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { NSelect, NForm, NText, NInputNumber, NInput, NH3, NFormItem, NDivider, NSpace, NSwitch } from "naive-ui"
import { catchments, setActiveCatchment, activeCatchmentId, activeCatchment } from "../store"

import { kirpichChannelType } from "../calculations"

const value = ref(null)

const kirpichHeightAutoValue = computed(() => {
  if (!activeCatchment.value?.length || !activeCatchment.value?.slope) return undefined
  return (activeCatchment.value.length * activeCatchment.value.slope) / 100
})

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

const catchmentOptions = computed(() =>
  catchments.map((catchment) => ({
    label: catchment.name,
    value: catchment.id,
  }))
)
</script>

<style>
.define-form {
  padding-left: 5px;
  margin-top: 10px;
}

.define {
  padding-left: 10px;
}
</style>
