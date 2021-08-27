import { FOE } from "../helpers/config.mjs";
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
    context.conditionModTypes = FOE.conditionModTypes;
    const item = this.object;
    const compatAmmo = {};
    if (item.type == 'weapon') {
      for (let [itemId, thatItem] of this.actor.data.items.entries()) {
        const tpe = thatItem.type;
        if (tpe == 'ammo') {
          const thatAmmoType = thatItem.data.data.type;
          const thisAmmoType = item.data.data.ammoType;
          if (thisAmmoType == thatAmmoType) {
            compatAmmo[itemId] = thatItem.name;
          }
        }
      }
    }

    context.compatAmmo = compatAmmo;

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers, click handlers, etc. would go here.
  }
}
