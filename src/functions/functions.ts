import { calculatePondVolume } from "./ponds"

/**
 * Calculate pond volume from MOE estimates
 * @customfunction
 * @param impervious Percent impervious non-demical
 * @returns Land area in m<sup>2</sup>
 */
function calcPondVolume(catchmentArea: number, impervious: number) {
  return calculatePondVolume(catchmentArea, impervious)
}

CustomFunctions.associate("CALCULATEPONDVOLUME", calcPondVolume)
