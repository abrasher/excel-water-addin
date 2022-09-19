export interface Scenario {
  landCost: number
  usdcDepth: number
  usdcPermanent: number
  usdcActive: number
  noUSDCPermanent: boolean
  aboveUnitCost: number
  usdcUnitCost: number
}

export type Pond = {
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
