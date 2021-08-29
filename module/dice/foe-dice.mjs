import { FOE } from "../helpers/config.mjs";

/* 
Code originally from the dnd 5e module (https://gitlab.com/foundrynet/dnd5e/-/blob/master/module/dice/d20-roll.js)
Adapted by Sapphie
*/
export default class FoERoll {
    constructor(mainFormula, targetFormula, data, options) {
        this.mainRoll = new Roll(mainFormula, data);
        if (!(this.mainRoll.terms[0] instanceof Die))
            throw new Error(`Invalid roll formula provided: ${mainFormula}`)
        this.mainFormula = mainFormula;
        this.targetRoll = new Roll(targetFormula, data);
        this.options = foundry.utils.deepClone(options);
        this._evaluated = false;
    }


    static EVALUATION_TEMPLATE = "systems/foe/templates/chat/roll-dialog.html";


    async configureDialog({ title, defaultRollMode, chooseAbility = false,
        defaultAbility, chooseDifficulty = false, defaultDifficulty = "none",
        difficulties: difficultyMods, template, chooseConsumeResource = false,
        consumeResourceCallback } = {}, options = {}) {
        if (chooseDifficulty && !(difficultyMods)) throw new Error("No difficulty modifiers provided");
        // No clue if there's a less retarded way to do this lol
        const localizedDifficulties = foundry.utils.deepClone(FOE.rollDifficulties);
        Object.keys(localizedDifficulties).map(function (key, index) {
            localizedDifficulties[key] = game.i18n.localize(localizedDifficulties[key])
        })

        const content = await renderTemplate(template ?? this.constructor.EVALUATION_TEMPLATE, {
            target: `${this.targetFormula} + @bonus`,
            formula: this.mainFormula,
            defaultRollMode,
            rollModes: CONFIG.Dice.rollModes,
            chooseAbility,
            defaultAbility,
            chooseDifficulty,
            chooseConsumeResource,
            difficulties: localizedDifficulties,
            defaultDifficulty: chooseDifficulty ? defaultDifficulty ?? difficultyMods[0] : null,
            abilities: CONFIG.FOE.abilities,
        });
        return Dialog.prompt({
            title,
            content,
            label: game.i18n.localize("FOE.Roll"),
            callback: html => this._onDialogSubmit(html, defaultDifficulty, difficultyMods, consumeResourceCallback),
            rejectClose: false,
            options: options
        })
    }

    async _onDialogSubmit(html, defaultDiff, difficultyMods, consumeResourceCallback) {
        const form = html[0].querySelector("form");
        // Append a situational bonus term
        if (form.bonus.value) {
            const bonusTerms = Roll.parse(form.bonus.value, this.data);
            const terms = this.targetRoll.terms;
            if (!(bonusTerms[0] instanceof OperatorTerm)) terms.push(new OperatorTerm({ operator: "+" }));
            this.targetRoll.terms = terms.concat(bonusTerms);
        }

        const resourceCheckbox = form.resourceCheckbox;
        if (resourceCheckbox) {
            const success = await consumeResourceCallback(resourceCheckbox.checked);
            // User lacks the resources to consume
            if (!success) {
                // LOCALIZATION
                await Dialog.prompt({
                    title: "Insufficient resources",
                    content: "You lack the resources for this action (forgot to reload?)",
                    label: "Sorry, master",
                    callback: () => {},
                    rejectClose: false
                });
                return null;
            }
        }

        if (form.ability?.value) {
            // Note: untested lol
            const abl = this.data.abilities[form.ability.value];
            this.options.targetAbility = abl;
            this.targetValue = this.getTargetValue();
        }

        if (form.difficulty?.value) {
            const diff = form.difficulty.value;
            if (diff != defaultDiff) {
                const mod = difficultyMods[diff];
                const diffTerms = Roll.parse(`+${mod}`);
                this.targetRoll.terms = this.targetRoll.terms.concat(diffTerms);
            }
        }

        return this
    }

    async evaluate(options = {}) {
        if (this._evaluated) {
            throw new Error("This roll has already been evaluated and is now immutable");
        } else {
            this._evaluated = true;
        }
        // await Promise.all([
        // this.mainRoll.evaluate({async: true}),
        // this.targetRoll.evaluate({async: true})
        // ]);
        this.targetRoll.evaluate({ async: false });
        this.mainRoll.evaluate({ async: false });
    }

    // Maybe TODO: prettify this
    async toMessage(messageData, options = {}) {
        if (!this._evaluated) await this.evaluate({ async: true });
        const create = true || options.create;
        options.create = false;
        let content = `<p class="foe-roll">
                       <span class="foe-roll-main">
                       Roll (${this.mainRoll._formula}): 
                       <span class="foe-roll-result${await this.isMainCriticalOrFumble()}">
                       ${this.mainRoll.result}</span></span>`
        if (this.targetRoll) {
            if (this.targetRoll.terms.length <= 1) {
                content += `<br/><span>Target (${this.targetRoll._formula}): ${this.targetRoll.result}</span>`
            } else {
                content += `<br/><span>Target (${this.targetRoll._formula}): ${this.targetRoll.result} =
                 ${this.targetRoll.total}</span>`
            }
            const deg = this.targetRoll.total - this.mainRoll.total;
            content += `<br/><span>Degree of ${deg >= 0 ? "success" : "failure"}: ${deg}</span>`
        }
        content += "</p>"
        const msgData = {
            content,
            sound: CONFIG.sounds.dice,
            roll: JSON.stringify(this)
        };
        if (this.options.label) msgData.flavor = this.options.label;

        foundry.utils.mergeObject(msgData, messageData);
        if (create) return ChatMessage.create(msgData);
        else return msgData;
    }

    async isMainCriticalOrFumble() {
        let minFumble = this.mainRoll.terms[0].faces;
        if (this.options.fumble) minFumble = this.options.fumble;


        if (!this._evaluated) await this.evaluate();
        if (this.mainRoll.total >= minFumble) return " fumble";

        let maxCrit = 1;
        if (this.options.crit) maxCrit = this.options.crit;
        if (this.mainRoll.total <= maxCrit) return " critical";

        return "";
    }
}
