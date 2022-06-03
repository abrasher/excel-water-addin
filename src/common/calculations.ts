export interface CalculationMethod {
  name: string
  parameters: Parameter[]
}

interface Parameter {
  name: string
  heading: string
  type: "number"
}
