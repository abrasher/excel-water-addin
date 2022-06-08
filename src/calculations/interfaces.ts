export interface CalculationResults {
  name: string
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
