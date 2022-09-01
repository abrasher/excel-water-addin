export type CellType = string | number | boolean

import { get } from "lodash-es"

export const numberToLetters = (n: number) => {
  let num = n - 1
  let letters = ""
  while (num >= 0) {
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[num % 26] + letters
    num = Math.floor(num / 26) - 1
  }
  return letters
}

export const getColumnLetter = (num: number) => {
  var s = "",
    t

  while (num > 0) {
    t = (num - 1) % 26
    s = String.fromCharCode(65 + t) + s
    num = ((num - t) / 26) | 0
  }
  return s || undefined
}

const lettersToNumber = (letters: string) => {
  return letters.split("").reduce((r, a) => r * 26 + parseInt(a, 36) - 9, 0)
}

export const addressToXY = (address: string) => {
  const regex = /([A-z]+)(\d+)/

  const match = address.match(regex)

  if (match === null) throw new Error()

  const col = lettersToNumber(match[1])
  const row = Number.parseInt(match[2])

  return [col, row] as const
}

/**
 * If keysOrder is defined, return an array of the values of obj in the order of keysOrder, otherwise
 * return an array of the values of obj.
 * @param {RowData} obj - {
 * @param {string[]} [keysOrder] - ['id', 'name', 'age']
 * @returns An array of values from the object.
 */
export const objectToArray = <T extends Record<string, CellType>>(
  obj: T,
  keysOrder?: (keyof T)[]
) => {
  if (keysOrder) {
    return keysOrder.map((key) => obj[key])
  }

  return Object.values(obj)
}

export const pickObjectValues = <T extends {}>(obj: T, keys: string[]) =>
  keys.map((key) => get(obj, key)) as CellType[]

export const getKeyByValue = <T extends Record<string, string>>(obj: T, value: T[keyof T]) => {
  return Object.keys(obj).find((key) => obj[key] === value)
}
