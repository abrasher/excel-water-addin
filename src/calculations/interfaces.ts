export interface CalculationResults {
  name: string
  SCS?: number
  Kirpich?: number
  Upland?: number
  errors: {
    method: string
    reason: string
  }[]
}
