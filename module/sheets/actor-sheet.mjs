import { onManageActiveEffect, prepareActiveEffectCategories } from "../helpers/effects.mjs";
import { skillRoll, specialRoll } from "../dice.mjs"
import { FOE } from "../helpers/config.mjs";

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
      height: 770,
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
    for (let [k, v] of Object.entries(context.data.abilities)) {
      v.label = game.i18n.localize(CONFIG.FOE.abilities[k]) ?? k;
    }

    for (let [k, v] of Object.entries(context.data.resources)) {
      v.label = game.i18n.localize(CONFIG.FOE.resources[k]) ?? k;
    }

    for (let [k, v] of Object.entries(context.data.skills)) {
      v.label = game.i18n.localize(CONFIG.FOE.skills[k]) ?? k;
    }
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
    };

    const equippable = {
      weapon: {}
    }
    for (let j = 0; j < 3; j++) {
      equippable.weapon[j] = {
        options: {
          "none": "None"
        },
        label: FOE.weaponSlots[j],
        item: equipped[j].item
      }
    }
    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (inventory[i.type]) {
        inventory[i.type].content.push(i);
        if (i.type == "weapon") {
          for (let j = 0; j < 3; j++) {
            const currSlot = equippable[i.type][j];
            currSlot.options[i._id] = i.name;
            if (currSlot.item == i._id) {
              currSlot.equippedItem = i;
            }
          }
        }
      }
    }



    // Assign and return
    context.inventory = inventory;
    // context.equipped = equipped;
    // context.equipped = equipped; 
    context.equippable = equippable;
    // context.features = features;
    // context.spells = spells;
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

    // Equipped Item
    html.find('.equipped-form').change(this._onSelectChange.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

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
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return await Item.create(itemData, { parent: this.actor });
  }

  async _onSelectChange(event) {
    // event.preventDefault();
    const header = event.currentTarget;
    const sel = header.options[header.selectedIndex];
    const slotIdx = header.dataset.index;
    const newData = {data: {equipped: {}}};
    newData.data.equipped = {};
    newData.data.equipped[slotIdx] = {item: sel.value};
    this.actor.update(newData);
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
          const itemId = element.closest('.item').dataset.itemId;
          const item = this.actor.items.get(itemId);
          if (item) return item.roll();
        case 'special': {
          const r = await specialRoll(dataset.rollStat, label, this.actor.getRollData());

          const speaker = { actor: this.actor }
          const e = r.toMessage({ speaker: speaker }, { create: true })
          return r;
        }
        case 'skill': {
          const r = await skillRoll(dataset.rollSkill, label, this.actor.getRollData());

          const speaker = { actor: this.actor };
          const e = r.toMessage({ speaker }, { create: true })
          return r;
        }
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
  return `${itemObject.data.damage.base}${'+'.repeat(itemObject.data.damage.d10)}`
})
