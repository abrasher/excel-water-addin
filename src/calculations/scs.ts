const calcTcSCS = (length: number, slope: number, curveNumber: number) => {
  const numerator =
    Math.pow(length, 0.8) * Math.pow(1000 / curveNumber - 9, 0.7)
  const denom = 441 * Math.pow(slope, 0.5)
  return numerator / denom
}
