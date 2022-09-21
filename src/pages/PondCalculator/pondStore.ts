import { defineStore } from "pinia"
import { ref } from "vue"
import { Pond } from "./types"

export const usePondStore = defineStore("pond", () => {
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

  return { pond }
})
