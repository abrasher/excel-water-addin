import { ssrContextKey } from "vue"
import { Catchment } from "../store"
import { airportMethod } from "./airport"
import { bransbyWilliamMethod } from "./bransbyWilliam"
import { CalculationResults } from "./interfaces"
import { kirpich } from "./kirpich"
import { scsTc } from "./scs"
import { upland } from "./upland"

export const calculateCatchment = ({
  length,
  slope,
  name,
  area,
  ...params
}: Catchment): CalculationResults => {
  const results: CalculationResults = {
    name,
    errors: [],
    warnings: [],
  }

  // airport
  if (params.airportEnabled) {
    if (params.runoffCofficient && length && slope) {
      if (params.runoffCofficient > 0.4) {
        results.warnings.push({
          method: "Airport",
          reason:
            "Airport Method should only be used when runoff coefficient is less than 0.4",
        })
      }

      results.Airport = airportMethod(params.runoffCofficient, length, slope)
    } else {
      results.errors.push({
        method: "Airport",
        reason:
          "One or more of: Length, Slope or Runoff Coefficient not defined",
      })
    }
  }

  // bransby
  if (params.bransbyWilliamsEnabled) {
    if (area && length && slope) {
      if (params.runoffCofficient && params.runoffCofficient <= 0.4) {
        results.warnings.push({
          method: "Bransby Williams",
          reason:
            "Airport Method should be used instead when coefficient is less than 0.4",
        })
      }

      results["Bransby William"] = bransbyWilliamMethod(length, slope, area)
    } else {
      results.errors.push({
        method: "Bransby Williams",
        reason: "One or more of: Length, Slope or Area not defined",
      })
    }
  }

  // kirpich
  if (params.kirpichEnabled) {
    const kirpichHeight = params.kirpichHeightAuto
      ? (slope! / 100) * length!
      : params.kirpichHeight

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
