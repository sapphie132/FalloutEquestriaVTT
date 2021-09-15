import { onManageActiveEffect, prepareActiveEffectCategories } from "../helpers/effects.mjs";
import { skillRoll, specialRoll } from "../dice.mjs"
import { FOE } from "../helpers/config.mjs";
import { fetchAndLocalize } from "../helpers/util.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class FalloutEquestriaActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["foe", "sheet", "actor"],
      template: "systems/foe/templates/actor/actor-sheet.html",
      width: 720,
      height: 810,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "vital" }]
    });
  }

  /** @override */
  get template() {
    return `systems/foe/templates/actor/actor-${this.actor.data.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = context.actor.data;

    // Add the actor's data to context.data for easier access, as well as flags.
    context.data = actorData.data;
    context.flags = actorData.flags;

    // Prepare character data and items.
    if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(this.actor.effects);

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(context) {
    // Handle ability scores.
    fetchAndLocalize(context.data.abilities, CONFIG.FOE.abilities)
    fetchAndLocalize(context.data.resources, CONFIG.FOE.resources)
    fetchAndLocalize(context.data.skills, CONFIG.FOE.skills)
    fetchAndLocalize(context.data.resources.hp.limbs, CONFIG.FOE.limbs)
    fetchAndLocalize(context.data.attributes.resistances, CONFIG.FOE.resistances)
    fetchAndLocalize(context.data.misc, CONFIG.FOE.misc)


    const movementTypes = foundry.utils.deepClone(FOE.localizedMovementTypes);
    for (let [k, v] of Object.entries(context.data.movement)) {
      movementTypes[k].totYds = v.totYds;
      movementTypes[k].totFt = v.totFt;
    }

    const values = {
      total: {},
      base: {},
      tag: {},
      tagRanks: {},
      ranks: {},
      perks: {},
      traits: {},
      books: {},
      items: {},
    }

    fetchAndLocalize(values, FOE.skillValueLabels);

    context.movementTypes = movementTypes;

    context.limbs = context.data.resources.hp.limbs;
    context.values = values;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    const equipped = foundry.utils.deepClone(context.data.equipped);
    // Initialize containers.
    const inventory = {
      weapon: {
        label: "FOE.Weapons",
        extra: true,
        content: []
      },
      armor: {
        label: "FOE.Armor",
        extra: true,
        content: []
      },
      consumable: {
        label: "FOE.FoodAlcDrugs",
        content: []
      },
      crafting: {
        label: "FOE.GearCraftingSupplies",
        content: []
      },
      misc: {
        label: "FOE.Misc",
        content: []
      },
      ammo: {
        label: "FOE.Ammunition",
        content: []
      }
    };

    const magic = {
      arcaneMagic: {
        content: {},
        attributes: {},
      },
      flightMagic: {
        content: {},
        attributes: {},
      },
    }

    // for (let [k, v] of Object.entries(FOE.commonSpellAttributes)) {
    // magic.arcaneMagic.attributes[k] = { label: game.i18n.localize(v.label) };
    // magic.flightMagic.attributes[k] = { label: game.i18n.localize(v.label) };
    // }

    for (let [magicKey, attributes] of Object.entries(FOE.spellAttributes)) {
      for (let [k, v] of Object.entries(attributes)) {
        magic[magicKey].attributes[k] = { label: game.i18n.localize(v.label) };
      }
    }

    fetchAndLocalize(magic, FOE.magicTypes);
    const equippable = {
      weapon: {},
      armor: {},
    }

    const perks = {
      perk: {
        label: "FOE.Perks",
        addLabel: "FOE.AddPerk",
        content: {}
      },
      questPerk: {
        label: "FOE.QuestPerks",
        addLabel: "FOE.AddQuestPerk",
        content: {}
      },
      trait: {
        label: "FOE.Traits",
        addLabel: "FOE.AddTrait",
        content: {}
      },
    }

    const details = {};
    for (let [k, v] of Object.entries(context.data.details)) {
      details[k] = foundry.utils.deepClone(v);
      if (typeof (details[k]) != "object") {
        details[k] = {}
      }
      details[k].label = FOE.details[k] ?? k;
      details[k].isCutieMark = k == "cutieMark";
    }

    // Set up the slots dropdowns
    for (let j = 0; j < 3; j++) {
      equippable.weapon[j] = {
        options: {
          "none": "None"
        },
        label: FOE.weaponSlots[j],
        item: equipped.weapons[j]
      }
    }

    for (let [k, v] of Object.entries(equipped.armor)) {
      equippable.armor[k] = {
        options: {
          "none": "None"
        },
        label: game.i18n.localize(FOE.armorLimbs[k] ?? k),
        item: v,
      }
    }

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (inventory[i.type]) {
        // Add it to the proper inventory
        inventory[i.type].content.push(i);

        // If it's a weapon or a piece of armour, add it
        // to the proper slot as an option
        if (i.type == "weapon") {
          for (let j = 0; j < 3; j++) {
            // Add the weapon to each selectable slot
            const currSlot = equippable[i.type][j];
            currSlot.options[i._id] = i.name;

            // If the weapon is already equipped for this slot,
            // then create a shortcut in the slot
            if (currSlot.item == i._id) {
              currSlot.equippedItem = i;
              // Additionally, link the currently equipped ammunition for
              // this gun
              const loadedAmmoId = i.data.ammo.loaded;
              const loadedAmmo = this.actor.items.get(loadedAmmoId);
              currSlot.loadedAmmo = loadedAmmo;
            }
          }
        } else if (i.type == "armor") {
          for (let [slotId, slot] of Object.entries(equippable.armor)) {
            // Only add the item to the slot if the item can be equipped in that
            // slot
            if (i.data.slots.includes(slotId)) {
              // Add it as an option
              slot.options[i._id] = i.name;
              // Create a link if it's the equipped piece
              if (slot.item == i._id) {
                slot.equippedItem = i;
              }
            }
          }
        }
        if (i.data.amount) {
          i.data.totalWeight = i.data.weight * i.data.amount;
        }
      } else if (i.type == 'perk') {
        perks[i.data.subtype].content[i._id] = i;
      } else if (i.type == 'spell') {
        if (i.data.subtype) {
          magic[i.data.subtype].content[i._id] = i;
        }
      } else {
        console.log(`Unknown item type: ${i.type}`);
      }
    }



    // Assign and return
    context.inventory = inventory;
    context.equippable = equippable;
    context.perks = perks;
    context.details = details;
    context.maxCrit = context.data.attributes.crit;
    context.minFumble = 94 + context.data.attributes.fumble;
    context.magic = magic;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Equipped Armour
    html.find('.armor-slot').change(this._onArmorChange.bind(this))

    // Equipped Item
    html.find('.equipped-form').change(this._onSelectChange.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    html.find('input.item-condition').click(ev => ev.target.select()).change(this._onConditionChange.bind(this));
    html.find('input.item-ammo-current').click(ev => ev.target.select()).change(this._onCurrentAmmoChange.bind(this));

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

    html.find('.reload-button').click(this._reload.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // console.log(data);
    // Initialize a default name.
    const name = `New ${(data.subtype ?? type).capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    await Item.create(itemData, { parent: this.actor });
  }

  async _reload(event) {
    event.preventDefault();
    const actor = this.actor.data;
    const header = event.currentTarget;
    const slotIdx = header.dataset.slotId;
    const itemId = actor.data.equipped.weapons[slotIdx];
    const weapon = actor.items.get(itemId);
    const ammoId = weapon.data.data.ammo.loaded;
    const ammo = actor.items.get(ammoId);
    if (ammoId == "none") {
      await Dialog.prompt({
        title: game.i18n.localize("FOE.NoAmmoEquipped"),
        content: game.i18n.localize("FOE.NoAmmoEquippedLong"),
        label: game.i18n.localize("FOE.OkError"),
        callback: () => { },
        rejectClose: false
      });
    } else if (ammo) {
      const ammoCount = ammo.data.data.amount;
      const ammoCap = weapon.data.data.ammo.capacity;
      const neededToReload = ammoCap.max - ammoCap.value;
      const reloadedAmount = Math.min(neededToReload, ammoCount);

      const newAmmoCount = ammoCount - reloadedAmount;
      const a = ammo.update({ 'data.amount': newAmmoCount });
      const b = weapon.update({ 'data.ammo.capacity.value': reloadedAmount + ammoCap.value });

      await a;
      await b;
    } else {
      throw new Error(`Unknown ammo id: ${ammoId}`)
    }
  }

  async _onConditionChange(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);
    const condition = Math.clamped(0, parseInt(event.target.value), 120);
    event.target.value = condition;
    return item.update({ 'data.condition': condition })
  }

  async _onCurrentAmmoChange(event) {
    event.preventDefault();
    const input = event.currentTarget;
    const slotIdx = input.dataset.slotId;
    const itemId = this.actor.data.data.equipped.weapons[slotIdx];
    const weapon = this.actor.items.get(itemId);
    if (weapon) {
      const ammoCap = foundry.utils.deepClone(weapon.data.data.ammo.capacity);
      const newVal = Math.clamped(0, ammoCap.max, parseInt(input.value));
      ammoCap.value = newVal;
      input.value = newVal;
      const a = weapon.update({ 'data.ammo.capacity': ammoCap });
      return a;
    } else {
      throw new Error("Invalid weapon id selected");
    }
  }

  async _onSelectChange(event) {
    // event.preventDefault();
    const header = event.currentTarget;
    const sel = header.options[header.selectedIndex];
    const slotIdx = header.dataset.index;
    const newData = { data: { equipped: { weapons: {} } } };
    newData.data.equipped.weapons[slotIdx] = sel.value;
    this.actor.update(newData);
  }

  async _onArmorChange(event) {
    const header = event.currentTarget;
    const sel = header.options[header.selectedIndex];
    const slotIdx = header.dataset.slot;
    const itemId = sel.value == 'none' ? this.actor.data.data.equipped.armor[slotIdx] : sel.value;
    const item = this.actor.items.get(itemId);
    const newArmor = {};
    if (item) {
      for (let slot of item.data.data.slots) {
        newArmor[slot] = sel.value;
      }
    } else {
      newArmor[slotIdx] = itemId;
    }
    const newData = { 'data.equipped.armor': newArmor }
    return this.actor.update(newData);
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      const label = dataset.label ? `${dataset.label} check` : '';
      switch (dataset.rollType) {
        case 'item':
          // TODO: make weapon rolls smarter (post rollable links in chat)
          const itemId = element.closest('.item').dataset.itemId;
          const item = this.actor.items.get(itemId);
          if (item) return item.roll();
          break;
        case 'special': {
          const r = await specialRoll(dataset.rollStat, label, this.actor.getRollData());

          if (r) {
            const speaker = { actor: this.actor }
            const e = r.toMessage({ speaker: speaker }, { create: true })
            return r;
          }
        }
        case 'skill': {
          const r = await skillRoll(dataset.rollSkill, label, this.actor.getRollData());

          const speaker = { actor: this.actor };
          const e = r.toMessage({ speaker }, { create: true })
          return r;
        }
        case 'weapon': {
          const itemId = dataset.itemId;
          const item = this.actor.items.get(itemId);
          const damageOrAttack = dataset.rollSubtype;
          if (item) return item.roll({ damageOrAttack, critical: dataset.crit, isWeapon: true });
          break;
        }
        default:
          console.log(`Unhandled roll type: ${dataset.rollType}`)
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `${dataset.label} check` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData()).roll();
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }
}

Handlebars.registerHelper('damageString', function (itemObject) {
  let n = itemObject.data.damage.d10;
  return `${itemObject.data.damage.base}${'+'.repeat(n > 0 ? n : 0)}`
})
