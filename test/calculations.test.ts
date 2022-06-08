import { assert, describe, expect, test } from "vitest"
import { airportMethod } from "../src/calculations/airport"
import { bransbyWilliamMethod } from "../src/calculations/bransbyWilliam"

test.each([
  [
    0.4, // runoff coefficient is 0.4
    400, // watershed length is 400m
    2, // watershed slope is 2%
    36.2253, // t of concentration (min) result by hand calculation
  ],
  [
    0.2, // runoff coefficient is 0.2
    200, // watershed length is 200m
    6, // watershed slope is 6%
    22.8358, // t of concentration (min) result by hand calculation
  ],
])(
  "airportMethod(%i, %i, %i) ->  %d within 2 decimals",
  (runoff, length, slope, expected) => {
    expect(airportMethod(runoff, length, slope)).toBeCloseTo(expected, 2)
  }
)

test("bransbyWilliamMethod", () => {
  expect(bransbyWilliamMethod(100, 5, 20)).toBeCloseTo(3.0618)
})

test.todo("federalAviationMethod")
