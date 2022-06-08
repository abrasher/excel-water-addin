import { computed, reactive, ref, watch } from "vue"
import { KIRPICHCHANNELTYPE } from "./calculations"

export interface Catchment {
  id: string
  name: string
  length?: number
  slope?: number
  area?: number

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
  airportEnabled: boolean
  runoffCofficient?: number
  bransbyWilliamsEnabled: boolean
}

const getStoredCatchments = () => {
  const stored = localStorage.getItem("catchments")
  return stored ? (JSON.parse(stored) as Catchment[]) : undefined
}

export const catchments = reactive<Catchment[]>(getStoredCatchments() ?? [])
export const activeCatchmentId = ref<string | null>(null)

watch(catchments, (value) => {
  localStorage.setItem("catchments", JSON.stringify(value))
})

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
    airportEnabled: false,
    bransbyWilliamsEnabled: false,
  }
  catchments.push(base)
}

const getCatchment = (id: string | null): Catchment | undefined =>
  catchments.find((catchment) => catchment.id === id)

export const activeCatchment = computed(() =>
  getCatchment(activeCatchmentId.value)
)

export const removeCatchment = (id: string) => {
  for (const [index, catchment] of catchments.entries()) {
    console.log(catchment.id, id)
    if (catchment.id === id) {
      catchments.splice(index, 1)
    }
  }
}

if (process.env.NODE_ENV === "development") {
  if (!localStorage.getItem("catchments")) {
    catchments.push(
      {
        id: crypto.randomUUID(),
        name: "Catchment 1",
        scsEnabled: false,
        manningsEnabled: false,
        uplandEnabled: false,
        kirpichEnabled: false,
        airportEnabled: false,
        bransbyWilliamsEnabled: true,
      },
      {
        id: crypto.randomUUID(),
        name: "Catchment 2",
        scsEnabled: false,
        manningsEnabled: false,
        uplandEnabled: false,
        kirpichEnabled: false,
        airportEnabled: true,
        bransbyWilliamsEnabled: false,
      }
    )
  }

  activeCatchmentId.value = catchments[0].id
}
