export const calculatePondVolume = (catchmentArea: number, impervious: number) => {
  return storageLerp(impervious) * catchmentArea
}

export const caclulateExtendedDetention = (catchmentArea: number) => {
  // MOE has 40m3/ha for extended detention
  return 40 * catchmentArea
}

const storageLerp = (x0: number) => {
  const lerp = (v0: number, v1: number, alpha: number) => v0 + (v1 - v0) * alpha

  const x = [35, 55, 70, 85]
  const y = [100, 150, 185, 210]

  if (x0 < 35) {
    const alpha = (x0 - 35) / (55 - 35)

    return lerp(100, 150, alpha)
  }
  if (x0 > 85) {
    const alpha = (x0 - 85) / (70 - 85)
    return lerp(210, 185, alpha)
  }

  const x2Index = x.findIndex(i => !(i < x0))
  const x1Index = x2Index - 1

  const x1 = x[x1Index]
  const x2 = x[x2Index]

  const y1 = y[x1Index]
  const y2 = y[x2Index]

  if (!x1) return y2

  const alpha = x1 === x2 ? 0 : (x0 - x1) / (x2 - x1)

  return lerp(y1, y2, alpha)
}

export const calculateLandArea = (permanentHeight: number, permanentVolume: number, extendedVolume: number) => {
  if (!permanentVolume && !extendedVolume) return 0

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
