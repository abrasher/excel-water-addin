/**
 * Calculate land area of a pond from MOE equations
 * @customfunction
 * @param permanentVolume
 * @param permanentHeight
 * @param extendedVolume
 * @returns Land area in m<sup>2</sup>
 */
function calculatePondLandArea(permanentVolume: number, permanentHeight: number, extendedVolume: number): number {
  const x1 = (256 * permanentHeight ** 4 - 12 * ((64 / 3) * permanentHeight ** 3 - permanentVolume)) ^ (1 / 2)
  const x2 = 16 * permanentHeight ** 2
  const x3 = 6 * permanentHeight

  const x = (x1 - x2) / x3

  const h1 =
    (x + 8 * permanentHeight) ^
    (2 * (3 * x + 8 * permanentHeight) ** 2 + 20 * (3 * x + 8 * permanentHeight) * extendedVolume)
  const h2 = 10 * (3 * x + 8 * permanentHeight)
  const h3 = (x + 8 * permanentHeight) / 10

  const h = h1 ** (1 / 2) / h2 - h3

  const landArea = (x + 8 * permanentHeight + 10 * h) * (3 * x + 8 * permanentHeight + 10 * h)

  return landArea
}

CustomFunctions.associate("CALCULATEPONDLANDAREA", calculatePondLandArea)

function calculatePondVolume(impervious: number) {
  // Storage Equation for 80% SS removal, r-squared of 0.9978
  const storageEquation = (impervious: number) => 13.392 * impervious ** 0.6612

  return storageEquation(storageEquation(impervious))
}

CustomFunctions.associate("CALCULATEPONDVOLUME", calculatePondVolume)
