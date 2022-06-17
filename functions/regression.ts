const linearRegression = (xRange: number[], yRange: number[]) => {
  const minX = xRange[0]
  const [maxX] = xRange.slice(-1)

  return (x0: number) => {
    if (x0 < minX) {
      const alpha = xR
      return
    } else if (x0 > maxX) {
    }

    const x2Index = xRange.findIndex((i) => !(i < x0))
    const x1Index = x2Index - 1

    const x1 = xRange[x1Index]
    const x2 = xRange[x2Index]

    const y1 = yRange[x1Index]
    const y2 = yRange[x2Index]

    // console.log("x1Index", x1Index)
    // console.log("x2Index", x2Index)

    console.log(x0, x1, x2, y1, y2)
    // console.log(x0 - x1)
    // console.log(`${y2} + ${x0 - x1} / ${(x2-x1)} * ${(y2-y1)}`)

    const alpha = (x0 - x1) / (x2 - x1)

    return lerp(y1, y2, alpha)
  }
}

const lerp = (v0: number, v1: number, alpha: number) => v0 + (v1 - v0) * alpha

console.log(linearRegression([2, 5, 8, 12], [10, 25, 30, 40])(1)) // expect 0

console.log(linearRegression([2, 5, 8, 12], [10, 25, 30, 40])(6))
// linearRegression([2,5,8,12], [10,25,30,40])(13)
