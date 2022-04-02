import { FOE } from "../helpers/config.mjs";
import { fetchAndLocalize } from "../helpers/util.mjs"
import ActiveEffectFoE from "../active-effect.mjs";
/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class FalloutEquestriaItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["foe", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/foe/templates/item";
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.html`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.
    return `${path}/item-${this.item.data.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = context.item.data;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }

    // Add the actor's data to context.data for easier access, as well as flags.
    context.data = itemData.data;
    context.combatSkills = FOE.localizedCombatSkills;
    context.flags = itemData.flags;
    context.conditionModTypes = FOE.localizedConditionModTypes;
    const item = this.object;
    const compatAmmo = {
      "none": game.i18n.localize("FOE.None")
    };

    if (item.type == 'weapon') {
      if (this.actor) {
        for (let [itemId, thatItem] of this.actor.data.items.entries()) {
          const tpe = thatItem.type;
          if (tpe == 'ammo') {
            const thatAmmoType = thatItem.data.data.type;
            const thisAmmoType = item.data.data.ammo.type;
            if (thisAmmoType == thatAmmoType) {
              compatAmmo[itemId] = thatItem.name;
            }
          }
        }
      }
    }

    if (item.type == 'spell') {
      context.attributes = {};
      const subtype = itemData.data.subtype;
      for (let [k, v] of Object.entries(FOE.spellAttributes[subtype])) {
        context.attributes[k] = v;
      }

      fetchAndLocalize(itemData.data.levels, FOE.spellLevels);
      context.levels = itemData.data.levels;
    }

    if (item.type == 'armor') {
      const possibleSlots = foundry.utils.deepClone(FOE.armorLimbs);
      for (let [k, v] of Object.entries(possibleSlots)) {
        possibleSlots[k] = {
          label: game.i18n.localize(v),
          checked: item.data.data.slots.includes(k)
        };
      }
      context.possibleSlots = possibleSlots;
    }

    context.compatAmmo = compatAmmo;

    context.effects = ActiveEffectFoE.prepareActiveEffectCategories(this.object.data.effects);
    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    const slotChecks = html.find("input.slot");
    slotChecks.click(this._onSlotSelect.bind(this));

    html.find(".effect-control").click(ev => {
      if (this.item.isOwned) return ui.notifications.warn("Managing Active Effects within an Owned Item is not currently supported and will be added in a subsequent update.");
      ActiveEffectFoE.onManageActiveEffect(ev, this.item);
    });

    // Roll handlers, click handlers, etc. would go here.
  }

  _onSlotSelect(ev) {
    ev.preventDefault();
    const box = ev.currentTarget;
    const slotId = box.dataset.slot;
    const slots = this.item.data.data.slots;
    if (box.checked) {
      if (!slots.includes(slotId)) {
        slots.push(slotId);
      }
    } else {
      let idx = slots.indexOf(slotId);
      if (idx >= 0) {
        slots.splice(idx, 1);
      }
    }

    return this.item.update({ 'data.slots': slots });
  }
}
