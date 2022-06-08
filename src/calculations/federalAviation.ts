export const federalAviationMethod = (
  runoffCoefficent: number,
  length: number,
  slope: number
) => {
  const numerator = (1.1 - runoffCoefficent) * Math.pow(length, 0.5)
  const denominator = 1.44 * Math.pow(slope, 0.33)

  return numerator / denominator
}
