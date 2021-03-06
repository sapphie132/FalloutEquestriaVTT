/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor partials.
    "systems/foe/templates/actor/parts/actor-features.html",
    "systems/foe/templates/actor/parts/actor-items.html",
    "systems/foe/templates/actor/parts/actor-bonuses.html",
    "systems/foe/templates/actor/parts/actor-quick-skills.html",
    "systems/foe/templates/actor/parts/actor-actions.html",
    "systems/foe/templates/actor/parts/actor-limbs.html",
    "systems/foe/templates/actor/parts/actor-spells.html",
    "systems/foe/templates/actor/parts/actor-effects.html",
    "systems/foe/templates/actor/parts/actor-equipped.html",
    "systems/foe/templates/actor/parts/actor-perks.html",
    "systems/foe/templates/actor/parts/actor-skills-stats.html",
    "systems/foe/templates/actor/parts/actor-warnings.html",
    // Item partials
    "systems/foe/templates/item/parts/physical-attributes.html",
    "systems/foe/templates/item/parts/stackable-attributes.html",
    // Roll dialog
    "systems/foe/templates/chat/roll-dialog.html",
  ]);
};
