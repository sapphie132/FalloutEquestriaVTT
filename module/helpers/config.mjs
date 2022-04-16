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

FOE.weaponRanges = {
  "short": "FOE.RangeShort",
  "medium": "FOE.RangeMedium",
  "long": "FOE.RangeLong",
  "sniper": "FOE.RangeSniper",
  "none": "FOE.N/A",
  "pointBlank": "FOE.RangePointBlank",
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
  }
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
  horn: "FOE.ArmorHorn",
  head: "FOE.ArmorHead",
  wings: "FOE.ArmorWings",
  body: "FOE.ArmorBody",
  legs: "FOE.ArmorLegs"
}

FOE.resourcesBySpellType = {
  spell: "strain",
  trick: "tp"
}

FOE.arcaneLevelNumber = {
  basic: 1,
  advanced: 2,
  expert: 3,
  gAndP: 4
}

FOE.arcaneSpellApCost = {
  base: 5,
  unlearned: 10,
  perLevel: 10
}

FOE.arcaneSpellUnlearnedSpellCost = 10;

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

FOE.arcaneMagicSchools = {
  "general": "FOE.MagicArcaneSchoolGeneral",
  "offence": "FOE.MagicArcaneSchoolOffence",
  "defence": "FOE.MagicArcaneSchoolDefence",
  "imbuing": "FOE.MagicArcaneSchoolImbuing",
  "manipulation": "FOE.MagicArcaneSchoolManipulation",
  "medical": "FOE.MagicArcaneSchoolMedical",
  "illusion": "FOE.MagicArcaneSchoolIllusion",
  "perception": "FOE.MagicArcaneSchoolPerception",
  "battle": "FOE.MagicArcaneSchoolBattle",
}

FOE.spellAttributes = {
  spell: {
    school: {
      label: "FOE.MagicArcaneSchool",
      dict: FOE.arcaneMagicSchools,
    },
    strainCost: {
      label: "FOE.MagicStrainCost",
    },
  },
  trick: {
    tpCost: {
      label: "FOE.MagicTPCost",
    },
    extraTpCost: {
      label: "FOE.MagicAdditionalTPCost",
    }
  }
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

FOE.firerates = {
  "fullauto": "FOE.FirerateFullAuto",
  "boltaction": "FOE.FirerateBoltAction",
  "burst": "FOE.FirerateBurst",
  "leveraction": "FOE.FirerateLeverAction",
  "pumpaction": "FOE.FireratePumpAction",
  "semiauto": "FOE.FirerateSemiAuto",
  "singleshot": "FOE.FirerateSingleShot",
}

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

FOE.optionalLimbs = {
  horn: "FOE.LimbHorn",
  wings: "FOE.LimbWings",
}

FOE.limbs = {
  horn: "FOE.LimbHorn",
  legs: {
    leftFore: "FOE.LimbLeftForeleg",
    rightFore: "FOE.LimbRightForeleg",
    leftHind: "FOE.LimbLeftHindleg",
    rightHind: "FOE.LimbRightHindleg",
  },
  wings: {
    left: "FOE.LimbLeftWing",
    right: "FOE.LimbRightWing",
  },
  head: "FOE.LimbHead",
  torso: "FOE.LimbTorso"
}

FOE.weaponTypes = {
  none: "FOE.N/A",
  pistol: "FOE.WeaponTypePistol",
  smg: "FOE.WeaponTypeSMG",
  heavy: "FOE.WeaponTypeHeavy",
}

FOE.resistances = {
  fire: "FOE.Fire",
  cold: "FOE.Cold",
  lightning: "FOE.Lightning",
  poison: "FOE.Poison",
}

FOE.radPoison = {
  none: {
    lower: 0,
    effect: {}
  },
  minor: {
    lower: 200,
    effect: {
      "end": -1,
    }
  },
  advanced: {
    lower: 400,
    effect: {
      "end": -1,
      "agi": -1,
    }
  },
  critical: {
    lower: 600,
    effect: {
      "end": -1,
      "agi": -1,
      "str": -1,
    }
  },
  deadly: {
    lower: 800,
    effect: {
      "str": -1,
    }
  },
  fatal: {
    lower: 1000,
    effect: {}
  }
}

FOE.radPoisonLabels = {
  none: "FOE.RadPoisonNone",
  minor: "FOE.RadPoisonMinor",
  advanced: "FOE.RadPoisonAdvanced",
  critical: "FOE.RadPoisonCritical",
  deadly: "FOE.RadPoisonDeadly",
  fatal: "FOE.RadPoisonFatal",
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
