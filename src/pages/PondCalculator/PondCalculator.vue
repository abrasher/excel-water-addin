<template>
  <n-space vertical>
    <h1 class="text-center text-2xl">Pond Calculator</h1>

    <!-- <n-space>
      <n-button @click="importFromExcel">Import from Excel</n-button>
      <n-button @click="exportToExcel">Export to Excel</n-button>
    </n-space> -->
    <n-grid :cols="24">
      <n-grid-item :span="6">
        <n-form-item label="Override Volume?">
          <n-switch v-model:value="pond.overrideVolume" />
        </n-form-item>
        <n-form-item label="Volume Permanent (m3)">
          <n-input-number
            :value="pond.overrideVolume ? pond.customPermanentVolume : displayedVolume.permanent"
            :disabled="!pond.overrideVolume"
            @update:value="(value) => (pond.customPermanentVolume = value)"
          />
        </n-form-item>
        <n-form-item label="Volume Active (m3)">
          <n-input-number
            :value="pond.overrideVolume ? pond.customActiveVolume : displayedVolume.active"
            :disabled="!pond.overrideVolume"
            @update:value="(value) => (pond.customActiveVolume = value)"
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
              pond.overrideUnitRate ? pond.permanentUnitRate : displayedVolume.permanentUnitRate
            "
            :disabled="!pond.overrideUnitRate || pond.overrideVolume"
            @update-value="(value) => (pond.permanentUnitRate = value)"
          />
        </n-form-item>
        <n-form-item label="Active Vol. by Area (m3/ha)">
          <n-input-number
            :value="pond.overrideUnitRate ? pond.activeUnitRate : displayedVolume.activeUnitRate"
            :disabled="!pond.overrideUnitRate || pond.overrideVolume"
            @update-value="(value) => (pond.activeUnitRate = value)"
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
    <n-tabs>
      <n-tab-pane
        name="information"
        tab="Information"
      >
        <PondGeometry />
      </n-tab-pane>
      <n-tab-pane
        name="scenarios"
        tab="Scenarios"
      >
        <ScenarioCosts />
      </n-tab-pane>
    </n-tabs>
  </n-space>
</template>

<script setup lang="tsx">
import {
  NFormItem,
  NGrid,
  NGridItem,
  NInputNumber,
  NSpace,
  NSwitch,
  NTabPane,
  NTabs,
} from "naive-ui"
import { storeToRefs } from "pinia"
import { computed } from "vue"
import { calculatePondPermanentVolume, storageLerp } from "./calculations"
import PondGeometry from "./PondGeometry.vue"
import { usePondStore } from "./pondStore"
import ScenarioCosts from "./ScenarioCosts.vue"

const store = usePondStore()

const { pond } = storeToRefs(store)

const displayedVolume = computed(() => {
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
</script>
