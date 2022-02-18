// Import document classes.
import { FalloutEquestriaActor } from "./documents/actor.mjs";
import { FalloutEquestriaItem } from "./documents/item.mjs";
// Import sheet classes.
import { FalloutEquestriaActorSheet } from "./sheets/actor-sheet.mjs";
import { FalloutEquestriaItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { FOE } from "./helpers/config.mjs";

import * as dice from './dice.mjs'

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function () {

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.foe = {
    FalloutEquestriaActor,
    FalloutEquestriaItem,
    rollItemMacro
  };

  // Add custom constants for configuration.
  CONFIG.FOE = FOE;

  CONFIG.Dice.FoERoll = dice.FoERoll;
  CONFIG.Dice.rolls.push(dice.FoERoll);

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d10 + ((@abilities.per+@abilities.agi)/2)",
    decimals: 1
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = FalloutEquestriaActor;
  CONFIG.Item.documentClass = FalloutEquestriaItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("foe", FalloutEquestriaActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("foe", FalloutEquestriaItemSheet, { makeDefault: true });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here are a few useful examples:
Handlebars.registerHelper('concat', function () {
  var outStr = '';
  for (var arg in arguments) {
    if (typeof arguments[arg] != 'object') {
      outStr += arguments[arg];
    }
  }
  return outStr;
});

Handlebars.registerHelper("round", function (num, places) {
  return num.toFixed(places)
});

Handlebars.registerHelper("ifObject", function (item, options) {
  if (typeof (item) === "object") {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function () {
  // Localise various global variables
  if (!FOE.localizedCombatSkills) {
    FOE.localizedCombatSkills = {};
    for (let skill of FOE.combatSkills) {
      FOE.localizedCombatSkills[skill] = game.i18n.localize(FOE.skills[skill].label)
    }
  }

  FOE.localizedMovementTypes = {};
  for (let [key, mvt] of Object.entries(FOE.movementTypes)) {
    FOE.localizedMovementTypes[key] = foundry.utils.deepClone(mvt);
    FOE.localizedMovementTypes[key].name = game.i18n.localize(mvt.name);
  }

  FOE.localizedConditionModTypes = localizeObject(FOE.conditionModTypes);
  FOE.localizedRatesOfFire = localizeObject(FOE.ratesOfFire);
  // Process spell attributes
  for (let [k, v] of Object.entries(FOE.spellAttributes)) {
    // Set the input types based on the attribute type

    FOE.spellAttributes[k] = mergeObject(FOE.commonSpellAttributes, v, { inplace: false });
    let v1 = FOE.spellAttributes[k];
    for (let [k2, v2] of Object.entries(v1)) {
      if (v2.type == "Number") {
        v2.inputType = "number";
      } else {
        v2.inputType = "text";
      }
    }
  }

  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
});

function localizeObject(arg0, arg1) {
  let res = {};
  for (let [k, v] of Object.entries(arg0)) {
    res[k] = game.i18n.localize(v);
  }
  return res;
}
/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  if (data.type !== "Item") return;
  if (!("data" in data)) return ui.notifications.warn("You can only create macro buttons for owned Items");
  const item = data.data;

  // Create the macro command
  const command = `game.foe.rollItemMacro("${item.name}");`;
  let macro = game.macros.entities.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "foe.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  const item = actor ? actor.items.find(i => i.name === itemName) : null;
  if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);

  // Trigger the item roll
  return item.roll();
}