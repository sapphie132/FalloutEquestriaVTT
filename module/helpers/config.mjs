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
  initiative: "FOE.Initiative"
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
