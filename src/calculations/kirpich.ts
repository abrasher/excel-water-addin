export enum KIRPICHCHANNELTYPE {
  Normal = 1,
  OverlandGrassed = 2,
  ConcreteAsphalt = 0.4,
  ConcreteLinedChannel = 0.2,
}

export const kirpichChannelType = [
  {
    label: "Normal",
    value: KIRPICHCHANNELTYPE.Normal,
  },
  {
    label: "Overland Grassed",
    value: KIRPICHCHANNELTYPE.OverlandGrassed,
  },
  {
    label: "Concrete or Asphalt",
    value: KIRPICHCHANNELTYPE.ConcreteAsphalt,
  },
  {
    label: "Concrete Lined Channel",
    value: KIRPICHCHANNELTYPE.ConcreteLinedChannel,
  },
]

/**
 * @description Calculates time to concentration in hours using Kirpich's Equation https://www.in.gov/dot/div/contracts/standards/dm-Archived/07%20Metric/Part%204%20Vol.%201/Ch%2029/Ch29.pdf
 *
 * @param length length of the longest waterway from the point of interest to basin divide (m)
 * @param heightChange difference in height between point of interest and the basin divide (m)
 * @return Returns tc in hours
 *
 */
export const kirpich = (
  length: number,
  heightChange: number,
  channelType: KIRPICHCHANNELTYPE = KIRPICHCHANNELTYPE.Normal
): number => {
  const lengthKM = length / 1000

  const tc = ((0.948 * Math.pow(lengthKM, 3)) / heightChange) ** 0.385

  return tc * channelType
}

export const KirpichDef = {
  name: "Kirpich's Equation",
  parameters: [
    {
      name: "length",
      heading: "Length (m)",
      type: "number",
    },
    {
      name: "heightChange",
      heading: "Height Change (m)",
      type: "number",
    },
    {
      name: "channelType",
      heading: "Channel Type",
      type: "list",
      values: [
        {
          name: "Normal",
          value: KIRPICHCHANNELTYPE.Normal,
        },
      ],
    },
  ],
  func: kirpich,
}
