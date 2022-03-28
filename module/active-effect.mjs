/**
 * Extend the base ActiveEffect class to implement system-specific logic.
 * @extends {ActiveEffect}
 */
export default class ActiveEffectFoE extends ActiveEffect {
  /**
   * Is this active effect currently suppressed?
   * @type {boolean}
   */
  isSuppressed = false;

  /* --------------------------------------------- */

  /** @inheritdoc */
  apply(actor, change) {
    if (this.isSuppressed) return null;
    return super.apply(actor, change);
  }

  /* --------------------------------------------- */

  /**
   * Determine whether this Active Effect is suppressed or not.
   */
  determineSuppression() {
    this.isSuppressed = false;
    if (this.data.disabled || (this.parent.documentName !== "Actor")) return;
    const [parentType, parentId, documentType, documentId] = this.data.origin?.split(".") ?? [];
    if ((parentType !== "Actor") || (parentId !== this.parent.id) || (documentType !== "Item")) return;
    // const item = this.parent.items.get(documentId);
    // if ( !item ) return;

    if (parentType === "Actor") {
      const equippedParent = this.parent.data.data.equipped
      for (let [_, weaponId] of Object.entries(equippedParent.weapons)) {
        if (weaponId == documentId) return;
      }

      for (let [_, armourId] of Object.entries(equippedParent.armor)) {
        if (armourId == documentId) return;
      }

      // Couldn't find it in the equipped inventory -> not equipped, doesn't apply
      this.isSuppressed = true;
    }

  }

  /* --------------------------------------------- */

  /**
   * Manage Active Effect instances through the Actor Sheet via effect control buttons.
   * @param {MouseEvent} event      The left-click event on the effect control
   * @param {Actor|Item} owner      The owning document which manages this effect
   * @returns {Promise|null}        Promise that resolves when the changes are complete.
   */
  static onManageActiveEffect(event, owner) {
    event.preventDefault();
    const a = event.currentTarget;
    const li = a.closest("li");
    const effect = li.dataset.effectId ? owner.effects.get(li.dataset.effectId) : null;
    switch (a.dataset.action) {
      case "create":
        return owner.createEmbeddedDocuments("ActiveEffect", [{
          label: game.i18n.localize("FOE.EffectNew"),
          icon: "icons/svg/aura.svg",
          origin: owner.uuid,
          "duration.rounds": li.dataset.effectType === "temporary" ? 1 : undefined,
          disabled: li.dataset.effectType === "inactive"
        }]);
      case "edit":
        return effect.sheet.render(true);
      case "delete":
        return effect.delete();
      case "toggle":
        if (!effect.isSuppressed)
          return effect.update({ disabled: !effect.data.disabled });
        else return effect
    }
  }

  /* --------------------------------------------- */

  /**
   * Prepare the data structure for Active Effects which are currently applied to an Actor or Item.
   * @param {ActiveEffect[]} effects    The array of Active Effect instances to prepare sheet data for
   * @returns {object}                  Data for rendering
   */
  static prepareActiveEffectCategories(effects) {
    // Define effect header categories
    const categories = {
      temporary: {
        type: "temporary",
        label: game.i18n.localize("FOE.EffectTemporary"),
        effects: []
      },
      passive: {
        type: "passive",
        label: game.i18n.localize("FOE.EffectPassive"),
        effects: []
      },
      inactive: {
        type: "inactive",
        label: game.i18n.localize("FOE.EffectInactive"),
        effects: []
      },
      suppressed: {
        type: "suppressed",
        label: game.i18n.localize("FOE.EffectUnavailable"),
        effects: [],
        info: [game.i18n.localize("FOE.EffectUnavailableInfo")]
      }
    };

    // Iterate over active effects, classifying them into categories
    for (let e of effects) {
      e._getSourceName(); // Trigger a lookup for the source name
      if (e.isSuppressed) categories.suppressed.effects.push(e);
      else if (e.data.disabled) categories.inactive.effects.push(e);
      else if (e.isTemporary) categories.temporary.effects.push(e);
      else categories.passive.effects.push(e);
    }

    categories.suppressed.hidden = !categories.suppressed.effects.length;
    return categories;
  }
}
