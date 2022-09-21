export const calculatePond = (input: PondInput) => {
  return new Pond(input)
}

type PondInput = {
  permanentVolume: number
  permanentHeight: number
  activeVolume: number
  freeboardHeight: number
  plantingWidth: number
  lengthToWidth: number
  permanentSlope: number
  activeSlope: number
  freeboardSlope: number
  plantingSlope: number
  plantingAsStorage: boolean
  bufferWidth: number
}

class Pond {
  permanent: InvertedFrustum
  planting: InvertedFrustum
  active: InvertedFrustum
  freeboard: InvertedFrustum
  readonly length: number
  readonly width: number
  readonly area: number

  constructor(def: PondInput) {
    this.permanent = calculatePondWithoutWidth({
      volume: def.permanentVolume,
      lengthToWidth: def.lengthToWidth,
      sideSlope: def.permanentSlope,
      height: def.permanentHeight,
    })

    this.planting = new InvertedFrustum({
      bottomWidth: this.permanent.topWidth,
      bottomLength: this.permanent.topLength,
      sideSlope: def.plantingSlope,
      height: def.plantingWidth / def.plantingSlope,
    })

    const activeRequiredVolume = def.plantingAsStorage
      ? def.activeVolume - this.planting.volume
      : def.activeVolume

    this.active = calculatePondWithoutHeight({
      bottomWidth: this.planting.topWidth,
      bottomLength: this.planting.topLength,
      volume: activeRequiredVolume,
      sideSlope: def.activeSlope,
    })

    this.freeboard = new InvertedFrustum({
      bottomWidth: this.active.topWidth,
      bottomLength: this.active.topLength,
      height: def.freeboardHeight,
      sideSlope: def.freeboardSlope,
    })

    this.length = this.freeboard.topLength + def.bufferWidth
    this.width = this.freeboard.topWidth + def.bufferWidth

    this.area = this.length * this.width
  }
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
const calculateFrustumHeight = ({
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
  const height = calculateFrustumHeight({ bottomWidth, bottomLength, volume, sideSlope })

  return new InvertedFrustum({ bottomWidth, bottomLength, height, sideSlope })
}
