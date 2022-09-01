export interface Catchment {
  id: string
  name: string
  length?: number
  slope?: number
  area?: number
  scsEnabled?: boolean
  curveNumber?: number
  manningsEnabled?: boolean
  manningsCoefficient?: number
  uplandEnabled?: boolean
  uplandType?: "paved" | "unpaved" | "other"
  uplandVelocity?: number
  kirpichEnabled?: boolean
  kirpichHeight?: number
  kirpichHeightAuto?: boolean
  kirpichHeightAutoValue?: number
  kirpichChannelType?: KIRPICHCHANNELTYPE
  airportEnabled?: boolean
  runoffCoefficient?: number
  bransbyWilliamsEnabled?: boolean
}

export enum KIRPICHCHANNELTYPE {
  Normal = 1,
  OverlandGrassed = 2,
  ConcreteAsphalt = 0.4,
  ConcreteLinedChannel = 0.2,
}
