import { FOE } from "../helpers/config.mjs";
import { localizeAll, fetchAndLocalize, fetchLabels } from "../helpers/util.mjs"
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
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes" }]
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
      context.weaponRanges = localizeAll(FOE.weaponRanges);
      context.firerates = localizeAll(FOE.firerates);
      context.weaponTypes = localizeAll(FOE.weaponTypes);
    }

    if (item.type === 'spell') {
      fetchLabels(itemData.data.levels, FOE.spellLevels);
      context.levels = itemData.data.levels;
      context.data = itemData.data;
      context.schools = localizeAll(FOE.arcaneMagicSchools);
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

    let notSelectedLabel = game.i18n.localize("FOE.NothingSelected")
    let possibleTraitPerkReqs = { 'traits': {}, 'perks': {} };
    if (item.type === 'perk') {
      for (let itm of game.items.values()) {
        let item = itm.data
        let cat = item.type + "s"
        let container = possibleTraitPerkReqs[cat]
        if (container && !item.isEmbedded && item._id !== itemData._id) {
          container[item._id] = item.name
        }
      }

      const requirements = { 'traits': [], 'perks': [] }
      for (let [key, reqs] of Object.entries(requirements)) {
        for (let [_, req] of Object.entries(item.data.data.requirements[key])) {
          let reqObj = {}
          let exists = !!possibleTraitPerkReqs[key][req]
          if (exists) {
            reqObj.id = req
          } else {
            reqObj.id = this.noRequirementId;
          }
          reqObj.options = deepClone(possibleTraitPerkReqs[key]);
          reqObj.options[this.noRequirementId] = notSelectedLabel;

          if (exists) {
            delete possibleTraitPerkReqs[key][req]
          }
          reqs.push(reqObj)
        }
      }
      context.requirements = requirements;
    }


    context.compatAmmo = compatAmmo;

    context.effects = ActiveEffectFoE.prepareActiveEffectCategories(this.object.data.effects);
    context.owned = !!this.actor;
    return context;
  }

  noRequirementId = null;
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

    html.find(".add-req").click(this._onAddReq.bind(this))
    html.find(".del-req").click(this._onDelReq.bind(this))

    // Roll handlers, click handlers, etc. would go here.
  }

  async _onDelReq(ev) {
    ev.preventDefault();
    const idx = ev.currentTarget.dataset.idx;
    const type = ev.currentTarget.dataset.type;
    const key = type + 's'
    const list = this.item.data.data.requirements[key];
    console.log(list)
    console.log(idx)
    delete list[idx]
    console.log(list)
    await this.updateReqList(list, key);
  }

  async _onAddReq(ev) {
    ev.preventDefault();
    const type = ev.currentTarget.dataset.type;
    const key = type + 's'
    const list = this.item.data.data.requirements[key];
    list.push(this.noRequirementId)
    await this.updateReqList(list, key);
  }

  async updateReqList(list, key) {
    const dataKey = 'data.requirements.' + key;
    const newData = {}
    newData[dataKey] = list
    await this.item.update(newData, {'recursive': false})
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
