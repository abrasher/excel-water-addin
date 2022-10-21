import { useNotification } from "naive-ui"
import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { calculatePondPermanentVolume } from "./calculations"
import { calculatePond } from "./StackedFrustum"
import { Pond, Scenario } from "./types"

// const excelLabels = {
//   overrideVolume: "Override Volume?",
//   customActiveVolume: "Overridden Active Volume",
//   customPermanentVolume: "Overriden Permanent Volume",
//   imperviousness: "Imperviousness",
//   catchmentArea: "Catchment Area",
//   overrideUnitRate: "Use Custom Unit Rate?",
//   permanentUnitRate: "Permanent Storage by Area",
//   activeUnitRate: "Active Storage by Area",
//   lengthToWidth: "Length to Width",
//   permanentSlope: "Permanent Slope",
//   activeSlope: "Active Slope",
//   freeboardSlope: "Freeboard Slope",
//   permanentHeight: "Permanent Height",
//   freeboardHeight: "Freeboard Height",
//   bufferWidth: "Buffer Width",
// }

export const usePondStore = defineStore("pond", () => {
  const notification = useNotification()

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
    plantingSlope: 7,
    plantingWidth: 2,
    plantingAsStorage: true,
  })

  const result = computed(() => {
    const {
      overrideUnitRate,
      overrideVolume,
      customPermanentVolume,
      permanentUnitRate,
      catchmentArea,
      imperviousness,
      customActiveVolume,
      activeUnitRate,
    } = pond.value

    // Use custom permanent volume if chosen, if not use custom unit rate, if not calculate based on imperviousnes
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

    return calculatePond({
      ...pond.value,
      activeVolume,
      permanentVolume,
    })
  })

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

  return { pond, scenarios, result }
})
