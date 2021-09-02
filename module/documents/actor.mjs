import { FOE } from "../helpers/config.mjs";
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
    const data = actorData.data;
    const flags = actorData.flags.foe || {};

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
    for (let [key, resource] of Object.entries(resources)) {
      resource.bonus.tot = resource.bonus.temp + resource.bonus.perm;
    }

    for (let [key, ability] of Object.entries(abilities)) {
      const bonus = ability.bonus;
      bonus.tot = bonus.perm + bonus.temp;
      ability.tot = ability.value + bonus.tot;
    }

    const end = data.abilities.end.tot;
    const int = data.abilities.int.tot;
    const lvl = data.attributes.level?.value ?? 0;
    const agi = data.abilities.agi.tot;

    resources.strain.base = end + int;
    resources.hp.base = 100+(end*2)+(end*lvl);
    resources.ap.base = 55+(agi*3);

    if (resources.hp.regen == null) {
      resources.hp.regen = Math.floor(end/3);
    }

    for (let [key, resource] of Object.entries(resources)) {
      resource.max = resource.base + resource.bonus.tot;
      resource.percent = (resource.value / resource.max) * 100;
    }

    for (let [key, limb] of Object.entries(resources.hp.limbs)) {
      const cond = limb.condition;
      
      cond.max = Math.floor(resources.hp.max/2);
      cond.percent = (cond.value / cond.max) * 100;
    }

    for (let [key, skill] of Object.entries(skills)) {
      const bonus = skill.bonus;
      bonus.tot = bonus.perm + bonus.temp;
      skill.tot = skill.value + bonus.tot;
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
    return Math.floor(effLuck/2) + data.attributes.fumbleMod;
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
        data[k] = foundry.utils.deepClone(v);
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