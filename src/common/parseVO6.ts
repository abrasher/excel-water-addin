const eventDelimiter = "-------------------------------------------------------------------------------"

export const getMaxStorageUsed = (input: string) => {
  const scenarios = input.split(eventDelimiter)
  const detentionStorm = scenarios[0]

  return detentionStorm
    .split("\n")
    .at(-3)
    ?.split(" ")
    ?.at(-1)
}
