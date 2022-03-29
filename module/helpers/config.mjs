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

FOE.formulas = {
  hp: {
    regen: "floor(1 + @end / 3)",
    base: "100 + (@end * 2) + (@end * @lvl)"
  },
  stun: {
    base: "@hp.max"
  },
  strain: {
    base: "@end + @int"
  },
  ap: {
    base: "55 + @agi * 3"
  },
  tp: {
    base: "(@cha + @agi) / 2 + @lvl - 1"
  }
}

FOE.formulas.limbs = {
  head: "floor(@hp.max / 2)",
  torso: "floor(@hp.max / 2)",
  default: "floor(@hp.max / 3)"
}

FOE.formulas.misc = {
  trade: {
    buying: "1.55 - @barter * 0.0045",
    selling: "0.45 + @barter * 0.0045"
  },
  flightRank: { base: "0" }, // Can only be increased with perks->effects
  initiative: { base: "round((@agi + @per) / 2)" },
  spiritAffinity: { base: "ceil(@cha / 2)" },
  willpower: { base: "floor((@end + @cha + @int / 2) / 2.5)" },
  versatility: { base: "ceil(@int / 2)" },
  potency: { base: "ceil(@end / 2)" }
}

FOE.formulas.movement = {
  regular: { base: "round(@end / 2 + @agi)" },
  sprint: { base: "round(@end + @agi * 2)" },
  charge: { base: "round(@end + @agi * 2)" },
  jump: { base: "round((@str + @agi) / 2)" },
  climb: { base: "round((@str + @agi + @end) / 2)" },
  drop: { base: "0" },
  standUp: { base: "0" },
  fly: { base: "round((@end + @agi * 2) * @flightRank)" },
  flySprint: { base: "round(((@end + @agi * 2) * 2) * @flightRank)" },
  flyCharge: { base: "round(((@end + @agi * 2) * 2) * @flightRank)" },
  swim: { base: "round(@end + @agi + @str)" }
}

FOE.skillsSubValues = {
  base: {
    label: "FOE.Base",
    readOnly: true
  },
  bonus: {
    label: "FOE.Bonus",
    readOnly: true
  },
  tag: {
    label: "FOE.TagRanks",
  },
  ranks: {
    label: "FOE.Ranks",
  },
  perks: {
    label: "FOE.Perks",
  },
  traits: {
    label: "FOE.Traits",
  },
  books: {
    label: "FOE.Books"
  },
}

FOE.skills = {
  unarmed: {
    label: "FOE.Unarmed",
    formula: "@end + @agi + @luck / 2"
  },
  throwing: {
    label: "FOE.Throwing",
    formula: "@str + @agi + @luck / 2"
  },
  melee: {
    label: "FOE.Melee",
    formula: "@str + @agi + @luck / 2"
  },
  firearms: {
    label: "FOE.Firearms",
    formula: "@per + @agi + @luck / 2"
  },
  mew: {
    label: "FOE.MEW",
    formula: "@per * 2 + @luck / 2"
  },
  explosives: {
    label: "FOE.Explosives",
    formula: "@per * 2 + @luck / 2"
  },
  bSaddles: {
    label: "FOE.BattleSaddles",
    formula: "@per + @end * 2 + @str + @luck / 2 - 10"
  },
  survival: {
    label: "FOE.AlchemySurvivalTraps",
    formula: "@end + @per + @luck / 2"
  },
  barter: {
    label: "FOE.Barter",
    formula: "@cha * 2 + @luck / 2"
  },
  intimidation: {
    label: "FOE.BluffIntimidation",
    formula: "@cha * 2 + @luck / 2"
  },
  persuasion: {
    label: "FOE.NegotiationSeduction",
    formula: "@cha * 2 + @luck / 2"
  },
  sneak: {
    label: "FOE.Sneak",
    formula: "@agi * 2 + @luck / 2"
  },
  lockpick: {
    label: "FOE.Lockpick",
    formula: "@per * 2 + @luck / 2"
  },
  sleightHoof: {
    label: "FOE.SleightOfHoof",
    formula: "@cha + @agi + @luck / 2"
  },
  tech: {
    label: "FOE.HackingMatrixTech",
    formula: "@int * 2 + @luck / 2"
  },
  chem: {
    label: "FOE.Chemistry",
    formula: "@int * 2 + @luck / 2"
  },
  history: {
    label: "FOE.AcademicsLore",
    formula: "@int * 2 + @luck / 2"
  },
  repair: {
    label: "FOE.RepairMechanics",
    formula: "@int * 2 + @luck / 2"
  },
  gambling: {
    label: "FOE.Gambling",
    formula: "@luck * 2 + 3"
  },
  athletics: {
    label: "FOE.Athletics",
    formula: "@str + @agi + @end + @luck / 2 - 5"
  },
  profession: {
    label: "FOE.Profession",
    formula: "@cha * 2 + @luck / 2"
  },
  shamanism: {
    label: "FOE.Shamanism",
    formula: "@cha * 2 + @luck / 2"
  },
  magic: {
    label: "FOE.Magic",
    formula: "@per + @int + @luck / 2"
  },
  flight: {
    label: "FOE.FlightMagic",
    formula: "@end + @agi + @cha + @luck / 2"
  }
}

FOE.armorLimbs = {
  horn: "FOE.Horn",
  head: "FOE.Head",
  wings: "FOE.Wings",
  body: "FOE.Body",
  legs: "FOE.Legs"
}

FOE.spellLevels = {
  basic: "FOE.MagicBasic",
  advanced: "FOE.MagicAdvanced",
  expert: "FOE.MagicExpert",
  gAndP: "FOE.MagicGreatAndPowerful",
}

FOE.magicTypes = {
  arcaneMagic: "FOE.Spell",
  flightMagic: "FOE.Trick",
}

FOE.spellAttributes = {
  arcaneMagic: {
    school: {
      label: "FOE.School",
      type: "String",
    },
    strainCost: {
      label: "FOE.StrainCost",
      type: "Number",
    },
    duration: {
      label: "FOE.Duration",
      type: "String",
    },
  },
  flightMagic: {
    tpCost: {
      label: "FOE.TPCost",
      type: "Number",
    },
    extraTpCost: {
      label: "FOE.AdditionalTPCost",
      type: "String",
    }
  }
}


FOE.commonSpellAttributes = {
  level: {
    label: "FOE.Level",
    type: "String",
  },
}


FOE.skillValueLabels = {
  base: "FOE.Base",
  tag: "FOE.Tag",
  total: "FOE.Total",
  tagged: "FOE.Tagged?",
  ranks: "FOE.Ranks",
  perks: "FOE.Perks",
  traits: "FOE.Traits",
  books: "FOE.Books",
  items: "FOE.Items"
}

FOE.combatSkills = ["unarmed", "melee", "throwing", "firearms", "mew", "explosives", "bSaddles"];

FOE.resources = {
  "hp": "FOE.ResourceHP",
  "strain": "FOE.ResourceStrain",
  "stun": "FOE.ResourceFatigue",
  "illusion": "FOE.ResourceIllusion",
  "tp": "FOE.ResourceTP",
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

FOE.limbs = {
  horn: "FOE.Horn",
  lForeleg: "FOE.LeftForeleg",
  rForeleg: "FOE.RightForeleg",
  lHindleg: "FOE.LeftHindleg",
  rHindleg: "FOE.RightHindleg",
  rWing: "FOE.RightWing",
  lWing: "FOE.LeftWing",
  head: "FOE.Head",
  torso: "FOE.Torso"
}

FOE.resistances = {
  fire: "FOE.Fire",
  cold: "FOE.Cold",
  lightning: "FOE.Lightning"
}

FOE.movementTypes = {
  regular: {
    name: "FOE.Regular",
    apCost: 15
  },
  sprint: {
    apCost: 15,
    name: "FOE.Sprint",
    extra: {
      name: "FOE.SlowDown",
      cost: 15
    }
  },
  charge: {
    apCost: 10,
    name: "FOE.Charge"
  },
  jump: {
    apCost: 15,
    name: "FOE.Jump"
  },
  climb: {
    apCost: 30,
    name: "FOE.Climb"
  },
  drop: {
    apCost: 0,
    name: "FOE.Drop"
  },
  standUp: {
    apCost: 10,
    name: "FOE.StandUp",
    extra: {
      name: "FOE.Lying",
      cost: 20
    }
  },
  fly: {
    apCost: 15,
    name: "FOE.Fly"
  },
  flySprint: {
    name: "FOE.FlySprint",
    apCost: 15,
    extra: {
      name: "FOE.SlowDown",
      cost: 15
    }
  },
  flyCharge: {
    name: "FOE.FlyCharge",
    apCost: 10,
  },
  swim: {
    name: "FOE.Swim",
    apCost: 15
  }
}

FOE.localizedMovementTypes = FOE.movementTypes;

FOE.misc = {
  potency: "FOE.Potency",
  versatility: "FOE.Versatility",
  spiritaffinity: "FOE.SpiritAffinity",
  initiative: "FOE.Initiative",
  willpower: "FOE.Willpower"
}

FOE.rollDifficulties = {
  vEasy: "FOE.DifficultyVeryEasy",
  easy: "FOE.DifficultyEasy",
  normal: "FOE.DifficultyNormal",
  none: "FOE.DifficultyDefault",
  difficult: "FOE.DifficultyDifficult",
  hard: "FOE.DifficultyHard",
  vHard: "FOE.DifficultyVeryHard",
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

FOE.details = {
  race: "FOE.Race",
  coatColor: "FOE.CoatColor",
  maneColor: "FOE.ManeColor",
  cutieMark: "FOE.CutieMark",
  eyeColor: "FOE.EyeColor",
  weight: "FOE.Weight",
  age: "FOE.Age",
  gender: "FOE.Gender",
  virtue: "FOE.Virtue",
  player: "FOE.Player",
  height: "FOE.Height",
  karma: "FOE.Karma"
}

FOE.activityLevels = {
  "normal": "FOE.ActivityNormal",
  "light": "FOE.ActivityLight",
  "rest": "FOE.ActivityRest",
  "sleep": "FOE.ActivitySleep"
}

FOE.sleepTypes = { "light": "FOE.SleepLight", "good": "FOE.SleepGood" }

FOE.strainRecovery = {
  "normal": 5,
  "light": 10,
  "rest": 15,
  "sleep": 20,
}

FOE.trickPointRecovery = {
  "light": 1,
  "good": 3,
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
