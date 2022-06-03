import { computed, reactive, ref } from "vue"
import { KIRPICHCHANNELTYPE } from "./calculations"

export interface Catchment {
  id: string
  name: string
  length?: number
  slope?: number

  scsEnabled: boolean
  curveNumber?: number
  manningsEnabled: boolean
  manningsKinematic?: {
    mannings: number
  }
  uplandEnabled: boolean
  uplandType?: "paved" | "unpaved" | "other"
  uplandVelocity?: number
  kirpichEnabled: boolean
  kirpichHeight?: number
  kirpichHeightAuto?: boolean
  kirpichHeightAutoValue?: number
  kirpichChannelType?: KIRPICHCHANNELTYPE
}

export const catchments = reactive<Catchment[]>([])
export const activeCatchmentId = ref<string | null>(null)

export const setActiveCatchment = (id: string) => {
  activeCatchmentId.value = id
}

export const addCatchment = () => {
  const base: Catchment = {
    id: crypto.randomUUID(),
    name: "Default Name",
    scsEnabled: false,
    manningsEnabled: false,
    uplandEnabled: false,
    kirpichEnabled: false,
  }
  catchments.push(base)
}

const getCatchment = (id: string | null): Catchment | undefined =>
  catchments.find((catchment) => catchment.id === id)

export const activeCatchment = computed(() =>
  getCatchment(activeCatchmentId.value)
)

if (process.env.NODE_ENV === "development") {
  catchments.push(
    {
      id: crypto.randomUUID(),
      name: "Catchment 1",
      scsEnabled: true,
      manningsEnabled: true,
      uplandEnabled: true,
      kirpichEnabled: true,
    },
    {
      id: crypto.randomUUID(),
      name: "Catchment 2",
      scsEnabled: false,
      manningsEnabled: true,
      uplandEnabled: false,
      kirpichEnabled: true,
    }
  )
  activeCatchmentId.value = catchments[0].id
}
