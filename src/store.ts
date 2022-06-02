import { reactive } from "vue"
import { KirpichChannelType } from "./common/calculations"

export interface Catchment {
  id: string
  name: string
  length?: number
  slope?: number

  scsEnabled: boolean
  scs?: {
    curveNumber: number
  }
  manningsEnabled: boolean
  manningsKinematic?: {
    mannings: number
  }
  uplandEnabled: boolean
  upland?: {
    type: "paved" | "unpaved" | number
    velocity?: number
  }
  kirpichEnabled: boolean
  kirpich?: {
    length?: number
    height?: number
    channelType?: KirpichChannelType
  }
}

export const catchments = reactive<Catchment[]>([])

export const addCatchment = () => {
  const base: Catchment = {
    id: crypto.randomUUID(),
    name: "",
    scsEnabled: false,
    manningsEnabled: false,
    uplandEnabled: false,
    kirpichEnabled: false,
  }
  catchments.push(base)
}
