export interface CalculationResults {
  name: string
  length?: number
  area?: number
  slope?: number
  ["runoffCoefficient"]?: number
  Airport?: number
  ["Bransby William"]?: number
  SCS?: number
  Kirpich?: number
  Upland?: number
  errors: {
    method: string
    reason: string
  }[]
  warnings: {
    method: string
    reason: string
  }[]
}
