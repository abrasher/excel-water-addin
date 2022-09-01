import { readonly } from "vue"

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

interface FrustumParameters {
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

// c = (sqrt(3 h^4 (3 q^2 - 10 q + 3) s^2 + 36 h q v) - 3 h^2 (q + 1) s)/(6 h q) and h q!=0
/**
 * `calculatePondWithoutWidth` calculates the width of a pond given the volume, the slope, the bottom
 * length, and the height
 * @param {number} v - volume
 * @param {number} q - bottom length / bottom width
 * @param {number} s - slope
 * @param {number} h - height of the pond
 * @returns An object with the following properties:
 * volume: number
 * q: number
 * s: number
 * bottomWidth: number
 * h: number
 * bottomLength: number
 * widthTop: number
 * lengthTop: number
 * bottomArea: number
 * topArea: number
 */
const calculatePondWithoutWidth = ({
  volume,
  lengthToWidth,
  sideSlope,
  height,
}: Record<string, number>) => {
  const v = volume
  const s = sideSlope
  const h = height
  const q = lengthToWidth

  // sqrt(3 h^4 (3 q^2 - 10 q + 3) s^2 + 36 h q v)
  const p1 = Math.sqrt(3 * h ** 4 * (3 * q ** 2 - 10 * q + 3) * s ** 2 + 36 * h * q * v)
  // 3 h^2 (q + 1) s
  const p2 = 3 * h ** 2 * (q + 1) * s
  // (6 h q)
  const p3 = 6 * h * q

  const bottomWidth = (p1 - p2) / p3

  return new InvertedFrustum({
    bottomWidth,
    bottomLength: q * bottomWidth,
    sideSlope,
    height,
  })
}

/**
 * It calculates the height for a specific volume of a frustum with defined side slope, bottom length and width
 * @param {number} c - bottom width (unit)
 * @param {number} d - bottom length (unit)
 * @param {number} v - volume (unit ^ 3)
 * @param {number} s - side slope (s:1, i.e. 4:1 is 4)
 * @returns The required height of the frustum and dimensions
 * NOTE: approximation
 */
const calculateHeight = ({
  bottomWidth,
  bottomLength,
  volume,
  sideSlope,
}: Record<string, number>) => {
  const c = bottomWidth
  const d = bottomLength
  const v = volume
  const s = sideSlope
  return (
    (1 / 4) * (-c * s - d * s) * s ** -2 +
    (220328269 / 1110384896) *
      (-12 * (-c * s - d * s) * c * d * s ** 2 +
        2 * (-c * s - d * s) ** 3 +
        48 * s ** 4 * v +
        Math.sqrt(
          (-12 * (-c * s - d * s) * c * d * s ** 2 + 2 * (-c * s - d * s) ** 3 + 48 * s ** 4 * v) **
            2 -
            4 * ((-c * s - d * s) ** 2 - 4 * c * d * s ** 2) ** 3
        )) **
        (1 / 3) *
      s ** -2 +
    (69399056 / 220328269) *
      ((-12 * (-c * s - d * s) * c * d * s ** 2 +
        2 * (-c * s - d * s) ** 3 +
        48 * s ** 4 * v +
        Math.sqrt(
          (-12 * (-c * s - d * s) * c * d * s ** 2 + 2 * (-c * s - d * s) ** 3 + 48 * s ** 4 * v) **
            2 -
            4 * ((-c * s - d * s) ** 2 - 4 * c * d * s ** 2) ** 3
        )) **
        (1 / 3) *
        s ** 2) **
        -1 *
      ((-c * s - d * s) ** 2 - 4 * c * d * s ** 2)
  )
}

const calculatePondWithoutHeight = ({
  bottomWidth,
  bottomLength,
  volume,
  sideSlope,
}: Record<string, number>) => {
  const height = calculateHeight({ bottomWidth, bottomLength, volume, sideSlope })

  return new InvertedFrustum({ bottomWidth, bottomLength, height, sideSlope })
}

type PondDimensions = {
  lengthToWidth: number
  permanentSlope: number
  activeSlope: number
  freeboardSlope: number
  bufferWidth: number
}

type PondInput = {
  permanentVolume: number
  permanentHeight: number
  activeVolume: number
  freeboardHeight: number
}

export const calculatePond = ({
  permanentSlope,
  activeSlope,
  freeboardSlope,
  bufferWidth,
  lengthToWidth,
}: PondDimensions) => {
  return ({ permanentVolume, permanentHeight, activeVolume, freeboardHeight }: PondInput) => {
    const ppFrustum = calculatePondWithoutWidth({
      volume: permanentVolume,
      lengthToWidth,
      sideSlope: permanentSlope,
      height: permanentHeight,
    })

    const activeFrustum = calculatePondWithoutHeight({
      bottomWidth: ppFrustum.topWidth,
      bottomLength: ppFrustum.topLength,
      volume: activeVolume,
      sideSlope: activeSlope,
    })

    const freeboardFrustum = new InvertedFrustum({
      bottomWidth: activeFrustum.topWidth,
      bottomLength: activeFrustum.topLength,
      height: freeboardHeight,
      sideSlope: freeboardSlope,
    })

    const top = {
      length: freeboardFrustum.topLength + bufferWidth,
      width: freeboardFrustum.topWidth + bufferWidth,
      get area() {
        return this.width * this.length
      },
    }

    return {
      permanent: ppFrustum,
      active: activeFrustum,
      freeboard: freeboardFrustum,
      top,
    }
  }
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
