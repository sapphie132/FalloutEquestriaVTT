import { FOE } from "../helpers/config.mjs";
import { evaluateFormula } from "../helpers/util.mjs";
/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class FalloutEquestriaActor extends Actor {
  constructor(data) {
    super(data);
  }

  /** @override */
  prepareData() {
    this._preparationWarnings = []
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this.data;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    // Make modifications to data here. For example:
    const data = actorData.data;

    // Loop through ability scores, and add their modifiers to our sheet output.
    // for (let [key, ability] of Object.entries(data.abilities)) {
    // Calculate the modifier using d20 rules.
    // ability.mod = Math.floor((ability.value - 10) / 2);
    // }
    const resources = data.resources;
    const abilities = data.abilities;
    const skills = data.skills;

    for (let [key, ability] of Object.entries(abilities)) {
      ability.bonus = ability.bonus ?? 0;
      ability.value = ability.rawValue + ability.bonus;
    }

    const str = data.abilities.str.value;
    const per = data.abilities.per.value;
    const end = data.abilities.end.value;
    const cha = data.abilities.cha.value;
    const int = data.abilities.int.value;
    const agi = data.abilities.agi.value;

    const lvl = data.attributes.level?.value ?? 0;

    resources.strain.base = end + int;
    resources.hp.base = 100 + (end * 2) + (end * lvl);
    resources.ap.base = 55 + (agi * 3);
    resources.stun.base = resources.hp.base;
    resources.tp.base = Math.round((cha + agi) / 2) + lvl - 1;

    if (resources.hp.regen == null) {
      resources.hp.regen = Math.floor(end / 3);
    }

    for (let [key, resource] of Object.entries(resources)) {
      resource.max = resource.base + resource.bonus;
      // First initialisation of a character
      if (resource.value == null) {
        resource.value = resource.max;
      }
      resource.percent = (resource.value / resource.max) * 100;
    }

    for (let [key, limb] of Object.entries(resources.hp.limbs)) {
      const cond = limb.condition;

      if (key != "head" && key != "torso") {
        cond.max = Math.floor(resources.hp.max / 3);
      } else {
        cond.max = Math.floor(resources.hp.max / 2);
      }
      if (cond.value == null) {
        cond.value = cond.max;
      }
      cond.percent = (cond.value / cond.max) * 100;
    }

    // Compute subvalues and totals for each skill
    for (let [key, skill] of Object.entries(skills)) {
      // Compute base value for the skill
      skill.value.base = (function (rollData, warnings) {

        let fallbackFormula = FOE.skills[key].formula;
        let formula = skill.customFormula;

        let [base, isFormulaBad] = evaluateFormula(formula, rollData, fallbackFormula);
        if (isFormulaBad) {
          warnings.push(game.i18n.localize("FOE.WarnBadSkillFormula"));
        }

        return Math.round(base);
      })(this.getRollData(), this._preparationWarnings);

      let total = (skill.tagged ? 15 : 0);
      skill.value.bonus = Number(skill.bonus ?? 0);
      for (let [valKey, _] of Object.entries(FOE.skillsSubValues)) {
        skill.value[valKey] = skill.value[valKey] ?? 0;
        total += skill.value[valKey]
      }

      skill.total = total;
    }

    // Initialise various hard-coded miscellaneous bits of data
    (function (misc) {
      misc.potency.base = Math.ceil(end / 2);
      misc.versatility.base = Math.ceil(int / 2);
      misc.willpower.base = Math.round((end + cha + int / 2) / 2.5);
      misc.spiritaffinity.base = Math.ceil(cha / 2);
      misc.initiative.base = Math.round((agi + per) / 2);
      // TODO: move this to misc
      data.skills.barter.buying = (1.55 - (data.skills.barter.total) * 0.0045).toFixed(2);
      data.skills.barter.selling = (0.45 + (data.skills.barter.total) * 0.0045).toFixed(2);
    })(data.misc);

    for (let [key, attribute] of Object.entries(data.misc)) {
      if (typeof (attribute) == 'object') {
        attribute.value = attribute.bonus + (attribute.base ?? attribute.rawValue);
      }
    }

    // Compute various movement speeds
    // TODO: make configurable and overridable
    (function (movement) {
      movement.regular.base = Math.round(end / 2 + agi);
      movement.sprint.base = Math.round(end + agi * 2);
      movement.charge.base = Math.round(end + agi * 2);
      movement.jump.base = Math.round((str + agi) / 2);
      movement.jump.isFt = true;
      movement.climb.base = Math.round((str + end + agi) / 2);
      movement.drop.base = 0;
      movement.standUp.base = 0;
      // TODO: figure out flight rank properly
      const fr = data.misc.flightRank.value;
      movement.fly.base = Math.round(end + agi * 2 * fr);
      movement.flySprint.base = Math.round(2 * end + agi * 4 * fr);
      movement.flyCharge.base = Math.round(2 * end + agi * 4 * fr);
      movement.swim.base = Math.round(str + end + agi);
    })(data.movement)

    for (let [key, mvt] of Object.entries(data.movement)) {
      mvt.value = mvt.base + mvt.bonus;
      if (mvt.isFt) {
        mvt.valFt = mvt.value;
        mvt.valYds = Math.round(mvt.value / 3);
      } else {
        mvt.valYds = mvt.value;
        mvt.valFt = mvt.value * 3;
      }
    }

    data.attributes.crit = this.critVal(0, data);
    data.attributes.fumble = this.fumbleVal(0, data);
  }

  critVal(extraLuck, data) {
    if (!data) {
      data = this.data.data;
    }
    let effLuck = data.abilities.luck.value;
    if (extraLuck) {
      effLuck += extraLuck;
    }
    return effLuck + data.attributes.critMod;
  }

  fumbleVal(extraLuck, data) {
    if (!data) {
      data = this.data.data;
    }
    let effLuck = data.abilities.luck.value;
    if (extraLuck) {
      effLuck += extraLuck;
    }
    return Math.floor(effLuck / 2) + data.attributes.fumbleMod;
  }
  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const data = actorData.data;
    data.xp = (data.cr * data.cr) * 100;
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.data.type !== 'character') return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = v.value;
      }
    }

    if (data.resources) {
      for (let [k, v] of Object.entries(data.resources)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    if (data.skills) {
      for (let [k, v] of Object.entries(data.skills)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    if (data.attributes) {
      for (let [k, v] of Object.entries(data.attributes)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for easier access, or fall back to 0.
    if (data.attributes.level) {
      data.lvl = data.attributes.level.value ?? 0;
    }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.data.type !== 'npc') return;

    // Process additional NPC data here.
  }

}