import { ssrContextKey } from "vue"
import { Catchment } from "../store"
import { CalculationResults } from "./interfaces"
import { kirpich } from "./kirpich"
import { scsTc } from "./scs"
import { upland } from "./upland"

export const calculateCatchment = ({
  length,
  slope,
  name,
  ...params
}: Catchment): CalculationResults => {
  const kirpichHeight = params.kirpichHeightAuto
    ? (slope! / 100) * length!
    : params.kirpichHeight

  const results: CalculationResults = {
    name,
    errors: [],
  }

  // kirpich
  if (params.kirpichEnabled) {
    if (kirpichHeight && slope && length) {
      results.Kirpich = kirpich(
        length,
        kirpichHeight,
        params.kirpichChannelType
      )
    }
  } else {
    results.errors.push({
      method: "Kirpich",
      reason: "One or more of: Length, Slope or Height is not defined",
    })
  }

  // upland
  if (params.uplandEnabled && length && params.uplandType) {
    results.Upland = upland({
      length,
      type: params.uplandType,
      velocity: params.uplandVelocity,
      slope,
    })
  }

  if (params.scsEnabled && params.curveNumber && length && slope) {
    results.SCS = scsTc(length, slope, params.curveNumber)
  }

  return results
}
