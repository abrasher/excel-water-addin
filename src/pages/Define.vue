<template>
  <n-select
    :value="activeCatchmentId"
    :options="catchmentOptions"
    @update:value="(val) => setActiveCatchment(val)"
  >
  </n-select>

  <n-form
    v-if="activeCatchment"
    :model="activeCatchment"
    label-placement="left"
    label-width="auto"
    class="define-form"
  >
    <n-h3 prefix="bar"><n-text>General Parameters</n-text></n-h3>
    <n-form-item label="Flow Length (m)" path="length">
      <n-input-number v-model:value="activeCatchment.length" />
    </n-form-item>
    <n-form-item label="Slope %" path="slope">
      <n-input-number v-model:value="activeCatchment.slope" />
    </n-form-item>
    <!-- SCS -->
    <template v-if="activeCatchment?.scsEnabled">
      <n-h3>SCS Method Parameters</n-h3>
      <n-form-item label="Curve Number" path="curveNumber">
        <n-input-number v-model:value="activeCatchment.curveNumber" />
      </n-form-item>
    </template>
    <!-- Upland -->
    <template v-if="activeCatchment?.uplandEnabled">
      <n-h3>Upland Method Parameters</n-h3>
      <n-form-item label="Land Type" path="type">
        <n-select
          :options="uplandTypeOptions"
          v-model:value="activeCatchment.uplandType"
        />
      </n-form-item>
      <n-form-item
        label="Velocity"
        path="type"
        v-if="activeCatchment.uplandType === 'other'"
      >
        <n-input-number v-model:value="activeCatchment.uplandVelocity" />
      </n-form-item>
    </template>
    <!-- Kirpich -->
    <template v-if="activeCatchment?.kirpichEnabled">
      <n-h3><n-text>Kirpich Parameters</n-text></n-h3>
      <n-form-item label="Channel Type">
        <n-select
          v-model:value="activeCatchment.kirpichChannelType"
          :options="kirpichChannelType"
        ></n-select>
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
        <n-input-number
          v-else
          v-model:value="activeCatchment.kirpichChannelType"
        ></n-input-number>
      </n-form-item>
    </template>
  </n-form>
  {{ catchments }}
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import {
  NDataTable,
  NSelect,
  NForm,
  NText,
  NInputNumber,
  NInput,
  NH3,
  NFormItem,
  NDivider,
  NSwitch,
} from "naive-ui"
import {
  catchments,
  setActiveCatchment,
  activeCatchmentId,
  activeCatchment,
} from "../store"

import { kirpichChannelType } from "../calculations"

const value = ref(null)

const kirpichHeightAutoValue = computed(() => {
  if (!activeCatchment.value?.length || !activeCatchment.value?.slope)
    return undefined
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
  padding-left: 12px;
  margin-top: 10px;
}
</style>
