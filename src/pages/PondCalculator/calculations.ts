export const calculatePondPermanentVolume = (catchmentArea: number, impervious: number) => {
  return storageLerp(impervious) * catchmentArea
}

export const caclulateExtendedDetention = (catchmentArea: number) => {
  // MOE has 40m3/ha for extended detention
  return 40 * catchmentArea
}

export const storageLerp = (x0: number) => {
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

  const x2Index = x.findIndex((i) => !(i < x0))
  const x1Index = x2Index - 1

  const x1 = x[x1Index]
  const x2 = x[x2Index]

  const y1 = y[x1Index]
  const y2 = y[x2Index]

  if (!x1) return y2

  const alpha = x1 === x2 ? 0 : (x0 - x1) / (x2 - x1)

  return lerp(y1, y2, alpha)
}

type FrustumParameters = {
  bottomWidth: number
  bottomLength: number
  sideSlope: number
  height: number
}

class InvertedFrustum {
  public bottomWidth
  public bottomLength
  public sideSlope
  public height
  public topLength
  public topWidth
  public bottomArea
  public topArea
  public volume

  constructor(params: FrustumParameters) {
    this.bottomWidth = params.bottomWidth
    this.bottomLength = params.bottomLength
    this.sideSlope = params.sideSlope
    this.height = params.height
    this.topLength = this.bottomLength + 2 * this.sideSlope * this.height
    this.topWidth = this.bottomWidth + 2 * this.sideSlope * this.height
    this.bottomArea = this.bottomWidth * this.bottomLength
    this.topArea = this.topWidth * this.topLength
    this.volume =
      (1 / 6) *
      this.height *
      (this.topArea +
        (this.bottomWidth + this.topWidth) * (this.bottomLength + this.topLength) +
        this.bottomArea)
  }

  getWidthAtHeight(height: number) {
    // TODO
  }
  getLengthAtHeight(height: number) {
    // TODO
  }
  getVolumeAtHeight(height: number) {
    // TODO
  }
}

type PondDimensions = {
  lengthToWidth: number
  permanentSlope: number
  activeSlope: number
  freeboardSlope: number
  plantingSlope: number
  bufferWidth: number
}

type PondInput = {
  permanentVolume: number
  permanentHeight: number
  activeVolume: number
  freeboardHeight: number
  plantingWidth: number
  plantingAsStorage: boolean
}

/**
 * It calculates the land area of a building given the permanent height, permanent volume, and extended
 * volume
 * @param {number} permanentHeight - The height of the permanent structure
 * @param {number} permanentVolume - The volume of the permanent part of the building.
 * @param {number} extendedVolume - The volume of the water in the pool when it is full.
 * @returns The land area of a pond in m^^2.
 */
const calculateLandArea = (
  permanentHeight: number,
  permanentVolume: number,
  extendedVolume: number
) => {
  //if (!permanentVolume && !extendedVolume) return 0

  const x11 = 256 * permanentHeight ** 4
  const x12 = (64 / 3) * permanentHeight ** 3 - permanentVolume
  const x13 = 12 * permanentHeight * x12

  const x1 = Math.sqrt(x11 - x13)

  const x2 = 16 * permanentHeight ** 2
  const x3 = 6 * permanentHeight

  const x = (x1 - x2) / x3

  const h11 = (x + 8 * permanentHeight) ** 2
  const h12 = (3 * x + 8 * permanentHeight) ** 2

  const h13 = 20 * (3 * x + 8 * permanentHeight) * extendedVolume

  const h1 = h11 * h12 + h13
  const h2 = 10 * (3 * x + 8 * permanentHeight)
  const h3 = (x + 8 * permanentHeight) / 10

  const h = Math.sqrt(h1) / h2 - h3

  const length = x + 2 * permanentHeight * 4 + 2 * h * 5

  const landArea = (x + 8 * permanentHeight + 10 * h) * (3 * x + 8 * permanentHeight + 10 * h)

  // return landArea

  return {
    active: {
      topArea: landArea,
      topLength: x + 2 * permanentHeight * 4 + 2 * h * 5,
      topWidth: 3 * x + 2 * permanentHeight * 4 + 2 * h * 5,
      height: h,
      bottomLength: 3 * x + 2 * permanentHeight * 4,
      bottomWidth: x + 2 * permanentHeight * 4,
    },
    perm: {
      bottomWidth: x,
      bottomLength: 3 * x,
      topWidth: x + 2 * permanentHeight * 4,
      topLength: 3 * x + 2 * permanentHeight * 4,
    },
  }
}

// const moe =  calculateLandArea(1.2,1000,400)
// const devrived = calculatePond({permanentPoolSlope: 4, activePoolSlope: 5, freeboardSlope: 2, bufferWidth: 10, lengthToWidth: 3})({permanentHeight: 1.2, freeboardHeight: 1, activeVolume: 400, permanentVolume: 1000})

// console.log("MOE vs Derived Active Bottom Length")
// console.log(moe.active.bottomLength, devrived.active.bottomLength)

// console.log("Derived Perm Top vs Active Bottom Area")
// console.log(devrived.active.bottomWidth, devrived.perm.topWidth)
