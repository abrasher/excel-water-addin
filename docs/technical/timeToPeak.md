---
lang: en-CA
title: Time to Peak / Time of Concentration
description: Technical Documentation for Time to Peak and Time of Concentration
date: 2022-09-12
---

# Time of Concentration / Time to Peak

## Airport Method

> For catchments where the runoff coefficient, C, is less than 0.40, the Airport formula may provide a better estimate of the time of concentration. This method was developed for airfields and calculates time of concentration as a function of runoff coefficient, length, and slope.

[reference](https://www.manula.com/manuals/smart-city-water/visualotthymo/6/en/topic/1-3-3-airport-method)

$T_c=\frac{3.26(1.1-C)L^{0.5}}{S_{w}^{0.33}}$

where

- $C$, runoff coefficient
- $L$, catchment length (m)
- $S$, catchment slope (%)

## Bransby-Williams

> This equation assumes catchment runoff is quickly concentrated into channel flow. It is most applicable where channels exist, or the drainage area has a steep grade.

$T_c=\frac{0.057L}{S^{0.2}A^{0.1}}$

where

- $L$, channel flow length (m)
- $A$, drainage area (sq. miles)
- $S$, slope (%)

## Federal Aviation

> Developed from airport drainage data, and it is probably best suited for small drainage areas with fairly homogeneous surfaces.

[reference 29-7.06](https://www.in.gov/dot/div/contracts/standards/dm-Archived/07%20Metric/Part%204%20Vol.%201/Ch%2029/Ch29.pdf)

$T_o=\frac{(1.1-C)L^{0.5}}{1.44S^{0.33}}$

where

- $T_o$, overland flow travel time (minutes)
- $L$, overland flow path (m)
- $S$, slope ($\frac{m}{m}$)
- $C$, rational method runoff coefficient

## Kerby

> Watersheds of less than 4 ha were used to calibrate the model; slopes were less than 1%; N values were 0.8 or less; and surface flow dominated.

[reference](https://www.in.gov/dot/div/contracts/standards/dm-Archived/07%20Metric/Part%204%20Vol.%201/Ch%2029/Ch29.pdf)

$T_o = 1.44(\frac{LN}{\sqrt(S)})^{0.467}$

where

- $T_o$, time of overland flow (minutes)
- $L$, length of flow (m)
- $N$, roughness coefficient, see below
- $S$, slope $(\frac{m}{m})$

| Type of Surface                                                                  | N    |
| -------------------------------------------------------------------------------- | ---- |
| Smooth, impervious surface                                                       | 0.02 |
| Smooth, bare, packed soil                                                        | 0.1  |
| Poor grass, cultivated row crops, or moderately rough, bare surface              | 0.20 |
| Deciduous timberland                                                             | 0.60 |
| Pasture or overage grass                                                         | 0.40 |
| Conifer timberland, deciduous timberland with deep forest litter, or dense grass | 0.8  |

## Kinematic Wave

> This equation applies to planes of sheet flow of homogenous slope and roughness. Cumulative watershed travel time should be summation of sub-areas with different slopes or overland roughness.

$T_c=\frac{6.94nL^{0.6}}{i^{0.4}S^{0.3}}$

where

- $L$, overland sheet flow path length (m)
- $n$, manning's surface roughness
- $i$, rainfall intensity (mm/hr)
- $S$, slope (m/m)

## Kirpich

> Kirpich’s Equation is an empirical watershed equation based on data which accounted for length, slope and soil cover. It derives from work to determine the rates of runoff from small agricultural watersheds. The Equation is considered applicable to watersheds from 1 ha to 80 ha.

[reference 29-7.13](https://www.in.gov/dot/div/contracts/standards/dm-Archived/07%20Metric/Part%204%20Vol.%201/Ch%2029/Ch29.pdf)

$T_c=(\frac{0.948L^3}{H})^{0.385}$

where

- $T_c$, time of concentration, hours
- $L$, length of the longest waterway from the point in question to the basin divide, km
- $H$, difference in elevation between the point in question and the basin divide (omitting drops due to gully overfalls, waterfalls, etc.), m

Kirpich’s Equation works fairly well for natural, rural basins with well-defined channels, for overland flow on bare earth, and for mowed earth roadside channels. Using the Equation, a paved basin and a forested one will have identical times of concentration if the lengths and reliefs are the same. Common sense dictates that this cannot occur; therefore, the Equation should be adjusted if it is used elsewhere using the following guidelines:

- For overland flow on grassed surfaces, multiply tC by 2.0.

## NRCS Velocity Method

## SCS Lag

## Upland

> Types of flow considered in the upland method are: overland; through grassed waterways; over paved areas; and through small upland gullies. Upland flow employed in this method can be a cambination of these various surface runoff conditions.

### When to Use

> The upland method should be limited to small watersheds (800 ha or less)

[reference - 202-2.05(02) Shallow-Concentrated-Flow Method](https://www.in.gov/dot/div/contracts/design/Part%202/Chapter%20202%20-%20Hydrology.pdf)

$T_c=\frac{3.048 \times L}{V}$

where

- $L$, length of flow path (m)
- $V$, average velocity (ft/s)

#### Determination of Velocity

$V=K_{feet}\sqrt{S}$

where

- $K$ is flow type coefficient
- ${S}$ is catchment slope, ($\frac{m}{m}$)

Refer to table below for $K_{feet}$

| Flow Type                                                              | Depth (m) | Manning's n | Coefficient $K_{feet}$ |
| ---------------------------------------------------------------------- | --------- | ----------- | ---------------------- |
| Pavement and small upland gullies                                      | 0.2       | 0.025       | 20.238                 |
| Grassed waterways (and unpaved urban areas)                            | 0.4       | 0.05        | 16.135                 |
| Nearly bare and untilled (overland flow); and alluvial fans            | 0.2       | 0.051       | 9.965                  |
| Cultivated straight row crops                                          | 0.2       | 0.058       | 8.762                  |
| Short-grass prairie                                                    | 0.2       | 0.073       | 6.962                  |
| "Minimum tillage cultivation, contour or strip-cropped, and woodlands" | 0.2       | 0.101       | 5.032                  |
| Forest with heavy ground litter and hay meadows                        | 0.2       | 0.202       | 2.516                  |
