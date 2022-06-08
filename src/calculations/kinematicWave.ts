// https://docs.bentley.com/LiveContent/web/Drainage%20and%20Utilities%20CONNECT%20Edition%20Help-v3/en/GUID-11FA1480-C87E-439D-97C3-D7F636311FA6.html

interface KinematicWaveParameters {
  length: number
  mannings: number
  rainfallIntensity: number
  slope: number
}

export const kinematicWaveTc = ({
  length,
  mannings,
  rainfallIntensity,
  slope,
}: KinematicWaveParameters) => {
  const numerator = 6.94 * mannings * Math.pow(length, 0.6)
  const denominator =
    Math.pow(rainfallIntensity, 0.4) * Math.pow(slope / 100, 0.3)
  return numerator / denominator
}
