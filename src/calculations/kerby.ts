//http://onlinemanuals.txdot.gov/txdotmanuals/hyd/time_of_concentration.htm
//https://files.carlsonsw.com/mirror/manuals/Carlson_2022/source/Hydrology/Watershed/Time_of_Concentration_Kerby_Kirpich/Time_of_Concentration_Kerby_Kirpich.html

export const kerbyMethod = (
  length: number,
  retardance: number,
  slope: number
) => {
  const numerator = 1.44 * Math.pow(length * retardance, 0.467)
  const denominator = Math.pow(slope, 0.235)
  return numerator / denominator
}

// Generalized terrain description
// Dimensionless retardance coefficient (N)
// Pavement 0.02
// Smooth, bare, packed soil 0.10
// Poor grass, cultivated row crops, or moderately rough packed surfaces 0.20
// Pasture, average grass 0.40
// Deciduous forest 0.60
// Dense grass, coniferous forest, or deciduous forest with deep litter 0.80
