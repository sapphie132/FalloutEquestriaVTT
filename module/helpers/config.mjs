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


FOE.abilityAbbreviations = {
  "str": "FOE.AbilityStrAbbr",
  "per": "FOE.AbilityPerAbbr",
  "end": "FOE.AbilityEndAbbr",
  "cha": "FOE.AbilityChaAbbr",
  "int": "FOE.AbilityIntAbbr",
  "agi": "FOE.AbilityAgiAbbr",
  "luck": "FOE.AbilityLuckAbbr",};

FOE.resources = {
  "hp": "FOE.ResourceHP",
  "strain": "FOE.ResourceStrain",
  "stun": "FOE.ResourceStun",
  "illusion": "FOE.ResourceIllusion",
  "TP": "FOE.ResourceTP"
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