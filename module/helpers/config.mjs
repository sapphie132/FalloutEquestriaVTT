export const FOE = {};

/**
 * The set of Ability Scores used within the sytem.
 * @type {Object}
 */
FOE.abilities = {
  "str": "FOE.AbilityStr",
  "per": "FOE.AbilityPer",
  "end": "FOE.AbilityEnd",
  "cha": "FOE.AbilityCha",
  "int": "FOE.AbilityInt",
  "agi": "FOE.AbilityAgi",
  "luck": "FOE.AbilityLuck",
};

FOE.weaponSlots = {
  0: "FOE.Primary",
  1: "FOE.Secondary",
  2: "FOE.Tertiary"
}


FOE.abilityAbbreviations = {
  "str": "FOE.AbilityStrAbbr",
  "per": "FOE.AbilityPerAbbr",
  "end": "FOE.AbilityEndAbbr",
  "cha": "FOE.AbilityChaAbbr",
  "int": "FOE.AbilityIntAbbr",
  "agi": "FOE.AbilityAgiAbbr",
  "luck": "FOE.AbilityLuckAbbr",
};

FOE.skills = {
  unarmed: "FOE.Unarmed",
  throwing: "FOE.Throwing",
  melee: "FOE.Melee",
  firearms: "FOE.Firearms",
  mew: "FOE.MEW",
  explosives: "FOE.Explosives",
  bSaddles: "FOE.BattleSaddles",
  survival: "FOE.AlchemySurvivalTraps",
  barter: "FOE.Barter",
  intimidation: "FOE.BluffIntimidation",
  persuasion: "FOE.NegotiationSeduction",
  sneak: "FOE.Sneak",
  lockpick: "FOE.Lockpick",
  sleightHoof: "FOE.SleightOfHoof",
  tech: "FOE.HackingMatrixTech",
  chem: "FOE.Chemistry",
  history: "FOE.AcademicsLore",
  repair: "FOE.RepairMechanics",
  gambling: "FOE.Gambling",
  athletics: "FOE.Athletics",
  profession: "FOE.Profession",
  shamanism: "FOE.Shamanism",
  magic: "FOE.Magic",
  flightMagic: "FOE.FlightMagic"
}

FOE.combatSkills = ["unarmed", "melee", "throwing", "firearms", "mew", "explosives", "bSaddles"];

FOE.resources = {
  "hp": "FOE.ResourceHP",
  "strain": "FOE.ResourceStrain",
  "stun": "FOE.ResourceStun",
  "illusion": "FOE.ResourceIllusion",
  "TP": "FOE.ResourceTP",
  "ap": "FOE.ActionPoints",
}

FOE.conditionModTypes = {
  damage: "FOE.Damage",
  hit: "FOE.Hit"
}

FOE.ratesOfFire = {
  fullAuto: "FOE.FullAuto",
  boltAction: "FOE.BoltAction",
  leverAction: "FOE.LeverAction",
  pumpAction: "FOE.PumpAction",
  semiAuto: "FOE.SemiAuto",
  singleShot: "FOE.SingleShot",
  burst: "FOE.Burst",
}

FOE.rollDifficulties = {
  vEasy: "FOE.VeryEasy",
  easy: "FOE.Easy",
  normal: "FOE.Normal",
  none: "FOE.Default",
  difficult: "FOE.Difficult",
  hard: "FOE.Hard",
  vHard: "FOE.VeryHard",
}

FOE.specialDifficulties = {
  vEasy: 3,
  easy: 2,
  normal: 1,
  none: 0,
  difficult: -1,
  hard: -2,
  vHard: -3
}

FOE.skillDifficulties = {
  vEasy: 30,
  easy: 20,
  normal: 10,
  none: 0,
  difficult: -10,
  hard: -20,
  vHard: -30
}

// Note: Lower is excluded, upper is included
FOE.conditionModifiers = {
  perfect: {
    lower: 100,
    upper: 120,
    extraLuck: 3,
    DTModAdd: 2,
    DTModMul: 1,
    damageMod: 1.1,
    hitMod: 5,
    skillToRepair: 100,
  },
  good: {
    lower: 75,
    upper: 100,
    extraLuck: 1,
    DTModAdd: 0,
    DTModMul: 1,
    damageMod: 1.0,
    hitMod: 0,
    skillToRepair: 75,
  },
  used: {
    lower: 50,
    upper: 75,
    extraLuck: 0,
    DTModAdd: -2,
    DTModMul: 1,
    damageMod: 0.9,
    hitMod: -5,
    skillToRepair: 50,
  },
  heavilyUsed: {
    lower: 25,
    upper: 50,
    extraLuck: -1,
    DTModAdd: 0,
    DTModMul: 0.5,
    damageMod: 0.5,
    hitMod: -10,
    skillToRepair: 25,
  },
  poor: {
    lower: -1,
    upper: 25,
    extraLuck: 3,
    DTModAdd: 0,
    DTModMul: 1 / 3,
    damageMod: 1 / 3,
    hitMod: -15,
    skillToRepair: 0,
  }
}
