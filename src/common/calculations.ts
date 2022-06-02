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

export enum KirpichChannelType {
  Normal = 1,
  OverlandGrassed = 2,
  ConcreteAsphalt = 0.4,
  ConcreteLinedChannel = 0.2,
}

/**
 * @description Calculates time to concentration in hours using Kirpich's Equation https://www.in.gov/dot/div/contracts/standards/dm-Archived/07%20Metric/Part%204%20Vol.%201/Ch%2029/Ch29.pdf
 *
 * @param length length of the longest waterway from the point of interest to basin divide (m)
 * @param heightChange difference in height between point of interest and the basin divide (m)
 * @return Returns tc in hours
 *
 */
export const kirpich = (
  length: number,
  heightChange: number,
  channelType: KirpichChannelType = KirpichChannelType.Normal
): number => {
  const lengthKM = length / 1000

  const tc = ((0.948 * Math.pow(lengthKM, 3)) / heightChange) ** 0.385

  return tc * channelType
}

export const KirpichDef = {
  name: "Kirpich's Equation",
  parameters: [
    {
      name: "length",
      heading: "Length (m)",
      type: "number",
    },
    {
      name: "heightChange",
      heading: "Height Change (m)",
      type: "number",
    },
    {
      name: "channelType",
      heading: "Channel Type",
      type: "list",
      values: [
        {
          name: "Normal",
          value: KirpichChannelType.Normal,
        },
      ],
    },
  ],
  func: kirpich,
}

export const Calculations = [KirpichDef]
