import type { SelectOption } from "naive-ui"

export const airportMethod = (
  runoffCoefficent: number,
  length: number,
  slope: number
) => {
  const numerator = 3.26 * (1.1 - runoffCoefficent) * Math.pow(length, 0.5)
  const denom = Math.pow(slope, 1 / 3)

  return numerator / denom
}

// const runoffCoefficient: SelectOption[] = [
//   {
//     label: "Lawns",
//     value:
//   }
// ]

// Ground Cover	Runoff Coefficient, c
// Lawns	0.05 - 0.35
// Forest	0.05 - 0.25
// Cultivated land	0.08-0.41
// Meadow	0.1 - 0.5
// Parks, cemeteries	0.1 - 0.25
// Unimproved areas	0.1 - 0.3
// Pasture	0.12 - 0.62
// Residential areas	0.3 - 0.75
// Business areas	0.5 - 0.95
// Industrial areas	0.5 - 0.9
// Asphalt streets	0.7 - 0.95
// Brick streets	0.7 - 0.85
// Roofs	0.75 - 0.95
// Concrete streets	0.7 - 0.95
// https://www.lmnoeng.com/Hydrology/rational.php
