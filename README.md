# FalloutEquestria System

This system is a foe system that you can use as a starting point for building your own custom systems. It's similar to Simple World-building, but has examples of creating attributes in code rather than dynamically through the UI.
## Blah blah blah
Anyway you can download it from here: 

`https://raw.githubusercontent.com/sapphie132/FalloutEquestriaVTT/master/system.json`
## Usage

### Effects
Effects are the primary way to increase your various stats.
Some stats, such as Skills and S.P.E.C.I.A.L stats can be edited directly,
however it is recommended to use effects for stat changes gained from perks,
as they allow to keep track of the effects individually.

The data keys for each character attribute are listed below.
#### S.P.E.C.I.A.L
For Strength, the primary attribute key is `str`, meaning that the data key is
`data.abilities.str.bonus`. The bonus gets added as a flat value on top of the
base score. There is no way to currently override your total score, but you can
override the raw value (the one visible and editable on your character sheet) by
using the data key `data.abilities.str.rawValue`.

![](readme_images/special_score_effect.png)