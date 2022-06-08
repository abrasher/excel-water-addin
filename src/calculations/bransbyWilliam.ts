/**
 *
 * @param length catchment or watershed length, m
 * @param slope catchment or water slope, %
 * @param area catchment or watershed area, ha
 * @description Bransby William Formula to calculate time to concentration. Only use when runoff coefficent is greater than 0.4
 */
export const bransbyWilliamMethod = (
  length: number,
  slope: number,
  area: number
) => {
  const numerator = 0.057 * length
  const denominator = Math.pow(slope, 0.2) * Math.pow(area, 0.1)
  return numerator / denominator
}
