# Pond Calculator

Consists of

```mermaid
flowchart TD;
lw[/Length to Width Ratio/] --> pBW
pSS[/Permanent Side Slope/] --> pBW
pH[/Permanent Height/] --> pBW
pV[Permanent Volume] --> pBW[Permanent Bottom Width]
pBW --> pTW[Permanent Top Length and Width]
pTW --> aBW[Active Bottom Length and Width]
aBW --> aH
aV[/Active Volume/] --> aH
aSS[/Active Side Slope/] --> aH[Active Height]
aH --> aTW[Active Top Length and Width]
fbH[\Freeboard Height\] --> fbTW
fbSS[\Freeboard Sideslope\] --> fbTW
aTW --> fbTW[Freeboard Top Length Width]
buffer[\Buffer Distance\] --> tTW
fbTW --> tTW[Overall Length and Width]

```

```mermaid
flowchart LR;
uCV[Use Custom Volumes?] -->|yes| cPV[Custom Volumes]
uCV -->|no| uUR["Use Custom Unit Rates?"]
uUR -->|no| moe[Calculate from MOE 80% Guidelines]
uUR -->|yes| uPV[Volumes from Unit Rates]
catchment[\"Catchment Area (ha)"\] --> uPV
imp[\"Imperviousness (%)"\] --> moe
catchment2[\"Catchment Area (ha)"\] --> moe
moe --> volumes
cPV --> volumes
uPV --> volumes[Active and Permanent Volume Used]
```

<!-- $$
V_{truncated} = \frac{1}{6}h(a_{base}+(a+c)(b+d)+a_{top})
$$

where

- $a_{base}:$ area of base
- $a_{top}:$ area of top

$$


\\
a_{base} = a \times b

\\
a_{top}  = c \times d

\\

c = a + 2hs

\\

b = q x a


$$ -->
