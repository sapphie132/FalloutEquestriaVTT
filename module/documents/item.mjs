import { skillRoll } from "../dice.mjs";
import { FOE } from "../helpers/config.mjs";

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class FalloutEquestriaItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
    const condition = this.data.data.condition;
    if (typeof (condition) == 'number') {
      this.conditionValues = FOE.conditionModifiers.perfect;
    }
    for (let [k, v] of Object.entries(FOE.conditionModifiers)) {
      if (condition > v.lower && condition <= v.upper) {
        this.data.conditionValues = foundry.utils.deepClone(v)
      }
    }

  }

  /**
   * Prepare a data object which is passed to any Roll formulas which are created related to this Item
   * @private
   */
  getRollData() {
    // If present, return the actor's roll data.
    if (!this.actor) return null;
    const rollData = this.actor.getRollData();
    rollData.item = foundry.utils.deepClone(this.data.data);

    return rollData;
  }

  // returns the equivalent extra luck for item condition
  get extraLuck() {
    return this.conditionValues.extraLuck;
  }

  get damageMod() {
    return this.conditionValues.damageMod;
  }

  get hitMod() {
    return this.conditionValues.hitMod;
  }

  get damageString() {
    const dmg = this.data.data.damage;
    if (dmg) {
      return `${dmg.base}${'+'.repeat(dmg.d10)}`
    } else {
      return ""
    }
  }

  async decrementBullets(enabled) {
    if (enabled) {
      const item = this.data;
      const ammoCap = item.data.ammo.capacity;
      const decAmount = item.data.ammo.perShot;
      if (ammoCap.value >= decAmount) {
        const newAmount = ammoCap.value - decAmount;
        ammoCap.value = newAmount;
        return this.update({ "data.ammo.capacity": ammoCap }).then(() => true);
      } else {
        return false;
      }
    } else {
      return true
    }
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll({ damageOrAttack = "attack", critical, isWeapon } = {}) {
    const item = this.data;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    let label = `[${item.type}] ${item.name}`;

    // If there's no roll data, send a chat message.
    if (!(item.data.formula || isWeapon)) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: item.data.description ?? ''
      });
    }
    // Otherwise, create a roll and send a chat message from it.
    else {
      // Retrieve roll data.
      const rollData = this.getRollData();

      // Invoke the roll and submit it to chat.
      let roll;
      if (isWeapon) {
        const conditionModifierType = item.data.conditionMod;
        if (damageOrAttack == "damage") {
          label = `[damage] ${item.name} (${this.actor.name})`;
          const n = item.data.damage.d10;
          let formula = `${item.data.damage.base}`;
          if (n > 0) {
            formula += `+${n}d10`
          }

          if (conditionModifierType == "damage") {
            formula = `${this.damageMod}*(${formula})`
          }

          if (critical) {
            formula = `${item.data.critMult}*(${formula})`
          }
          roll = new Roll(formula, rollData).roll({ async: false });
        } else if (damageOrAttack == "attack") {
          label = `[${item.data.rollSkill}] ${item.name} (${this.actor.name})`;
          if (this.actor) {
            rollData.fumble = this.actor.fumbleVal(this.extraLuck) - item.data.critFailMod;
            rollData.crit = this.actor.critVal(this.extraLuck) + item.data.critHitMod;
          }

          let targetMod;
          if (conditionModifierType == "hit") {
            targetMod = this.hitMod;
          }
          roll = await skillRoll(item.data.rollSkill, label, rollData, targetMod, true, this.decrementBullets.bind(this));
        } else {
          throw new Error(`Invalid roll mode: ${damageOrAttack}`);
        }
      } else {
        roll = new Roll(rollData.item.formula, rollData).roll();
      }
      if (roll) {
        roll.toMessage({
          speaker: speaker,
          rollMode: rollMode,
          flavor: label,
        });
      }
      return roll;
    }
  }
}
