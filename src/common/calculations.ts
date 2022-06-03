export interface CalculationMethod {
  name: string
  parameters: Parameter[]
}

interface Parameter {
  name: string
  heading: string
  type: "number"
}

type UplandParams = {
  length: number
  type: "paved" | "unpaved" | "other"
  slope?: number
  velocity?: number
}

const upland = ({ length, type, velocity, slope }: UplandParams) => {
  if (type === "other") {
    if (!velocity) {
      throw Error("Velcity is not defined with other")
    }
    return length / velocity
  } else {
    if (!slope) {
      throw Error("Slope is not defined")
    }
    if (type === "paved") {
      const velocity = 6.1961 * Math.pow(slope, 0.5)
      return length / velocity
    } else if (type === "unpaved") {
      const velocity = 4.9178 * Math.pow(slope, 0.5)
      return length / velocity
    } else {
      throw Error("Unknown 'type' for upland method")
    }
  }
}
