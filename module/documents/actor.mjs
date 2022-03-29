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
  applyActiveEffects() {
    this.effects.forEach(e => {e.determineSuppression()})
    return super.applyActiveEffects()
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
    let rollData = this.getRollData.bind(this);

    const resources = data.resources;
    const abilities = data.abilities;

    for (let [_, ability] of Object.entries(abilities)) {
      ability.bonus = Number(ability.bonus ?? 0);
      ability.value = ability.rawValue + ability.bonus;
    }

    const str = data.abilities.str.value;
    const end = data.abilities.end.value;
    const agi = data.abilities.agi.value;

    // Compute resource maximums
    (function (rollData, resources) {
      for (let [resourceKey, resource] of Object.entries(resources)) {
        for (let [resourceSubKey, formula] of Object.entries(FOE.formulas[resourceKey] ?? {})) {
          resource[resourceSubKey] = evaluateFormula(formula, rollData());
        }
        resource.max = resource.base + resource.bonus;
        if (!resource.value && resource.value !== 0) {
          resource.value = resource.max;
        }
        resource.percent = (resource.value / resource.max) * 100;
      }
    })(rollData, data.resources);

    (function (rollData, limbs) {
      for (let [limbKey, limb] of Object.entries(limbs)) {
        const cond = limb.condition;
        let formula = FOE.formulas.limbs[limbKey] ?? FOE.formulas.limbs.default;
        cond.base = evaluateFormula(formula, rollData());
        cond.bonus = cond.bonus ?? 0;
        cond.max = cond.base + cond.bonus;
        if (cond.value == null) {
          cond.value = cond.max;
        }
        cond.percent = (cond.value / cond.max) * 100;
      }
    })(rollData, resources.hp.limbs);

    // Compute subvalues and totals for each skill
    (function (rollData, skills) {
      for (let [key, skill] of Object.entries(skills)) {

        // Compute base value for the skill
        let fallbackFormula = FOE.skills[key].formula;
        let formula = skill.customFormula;
        let [base, isFormulaBad] = evaluateFormula(formula, rollData(), fallbackFormula);
        if (isFormulaBad) {
          warnings.push(game.i18n.localize("FOE.WarnBadSkillFormula"));
        }
        skill.value.base = Math.round(base);

        // Sum the subvalues to produce the main value
        let total = (skill.tagged ? 15 : 0);
        skill.value.bonus = Number(skill.bonus ?? 0);
        for (let [valKey, _] of Object.entries(FOE.skillsSubValues)) {
          skill.value[valKey] = skill.value[valKey] ?? 0;
          total += skill.value[valKey]
        }
        skill.total = total;
      }
    })(rollData, data.skills);

    // Initialise various hard-coded miscellaneous bits of data
    (function (rollData, misc) {
      for (let [miscKey, miscItem] of Object.entries(misc)) {
        for (let [miscSubkey, formula] of Object.entries(FOE.formulas.misc[miscKey] ?? {})) {
          miscItem[miscSubkey] = evaluateFormula(formula, rollData());
        }

        if (miscItem.base || miscItem.base === 0) {
          miscItem.value = miscItem.bonus + miscItem.base;
        }
      }
    })(rollData, data.misc);

    // Compute various movement speeds
    // TODO: make configurable and overridable
    (function (rollData, movement) {
      for (let [mvtKey, mvtItem] of Object.entries(movement)) {
        for (let [mvtSubkey, formula] of Object.entries(FOE.formulas.movement[mvtKey] ?? {})) {
          mvtItem[mvtSubkey] = evaluateFormula(formula, rollData())
        }
        mvtItem.value = mvtItem.base + mvtItem.bonus;
        if (mvtItem.isFt) {
          mvtItem.valFt = mvtItem.value;
          mvtItem.valYds = Math.round(mvtItem.value / 3);
        } else {
          mvtItem.valYds = mvtItem.value;
          mvtItem.valFt = mvtItem.value * 3;
        }
      }
    })(rollData, data.movement)

    data.attributes.crit = this.critVal(0);
    data.attributes.fumble = this.fumbleVal(0);
  }

  async sleep(hoursSlept, hadMedicalAid, sleepQuality) {
    const hp = this.data.data.resources.hp;
    const healPerHour = hadMedicalAid ? hp.regen * 2 : hp.regen;
    const amountHealed = healPerHour * hoursSlept;
    // Clipping happens later
    hp.value += amountHealed;
    if (hp.value > hp.max) { hp.value = hp.max};
    const limbCount = Object.keys(hp.limbs).size;

    // Regenerate each limb, but do not cross the crippled threshold
    for (let [_, limb] of Object.entries(hp.limbs)) {
      const cond = limb.condition;
      const isCrippled = cond.value <= cond.max / 2;
      cond.value += Math.floor(amountHealed / limbCount)
      const actualMax = isCrippled ? Math.floor(cond.max / 2) : cond.max;
      cond.value = Math.min(cond.value, actualMax);
    }

    const tp = this.data.data.resources.tp;
    tp.value += FOE.trickPointRecovery[sleepQuality] * hoursSlept;

    const stun = this.data.data.resources.stun;
    if (sleepQuality === "good") {
      stun.value = stun.max;
    }
    // This method doesn't directly update the value, instead it lets passTime handle it
    return this.passTime(hoursSlept, "sleep")
  }

  async passTime(numHours, activityLevel) {
    const resources = this.data.data.resources;
    // AP replenishes after a single turn in combat having it
    // also replenish after a longer time is convenient
    resources.ap.value = resources.ap.max;
    resources.strain.value += FOE.strainRecovery[activityLevel] * numHours;

    this.clipResources();
    await this.update({"data.resources": deepClone(resources)});
  }

  clipResources() {
    const resources = this.data.data.resources;
    for (let [_, resource] of Object.entries(resources)) {
      resource.value = Math.min(resource.max, resource.value);
    }
  }


  critVal(extraLuck) {
    let data = this.data.data
    let effLuck = data.abilities.luck.value;
    if (extraLuck) {
      effLuck += extraLuck;
    }
    return effLuck + data.attributes.critMod;
  }

  fumbleVal(extraLuck) {
    let data = this.data.data
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
        data[k] = foundry.utils.deepClone(v.total);
      }
    }

    if (data.attributes) {
      for (let [k, v] of Object.entries(data.attributes)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    for (let [k, v] of Object.entries(data.misc)) {
      data[k] = v.value;
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