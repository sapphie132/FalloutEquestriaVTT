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


    async configureDialog({ title, defaultRollMode, chooseAbility = false, defaultAbility, chooseDifficulty = true, defaultDifficulty, template } = {}, options = {}) {
        const content = await renderTemplate(template ?? this.constructor.EVALUATION_TEMPLATE, {
            target: `${this.targetFormula} + @bonus`,
            formula: this.mainFormula,
            defaultRollMode,
            rollModes: CONFIG.Dice.rollModes,
            chooseAbility,
            defaultAbility,
            abilities: CONFIG.FOE.abilities,
        });
        return new Promise(resolve => {
            Dialog.prompt({
                title,
                content,
                label: game.i18n.localize("FOE.Roll"),
                callback: html => resolve(this._onDialogSubmit(html)),
                rejectClose: () => resolve(null),
                options: options
            }).render(true)
        })
    }

    _onDialogSubmit(html) {
        const form = html[0].querySelector("form");
        let bonus = "";
        if (form.bonus.value) {
            const bonusRoll = new Roll(form.bonus.value, this.data);
            bonusRoll.evaluate({ async: false });
            bonus = bonusRoll.total;
        }

        if (form.ability?.value) {
            const abl = this.data.abilities[form.ability.value];
            this.options.targetAbility = abl;
            this.targetValue = this.getTargetValue();
        }

        let difficulty = 0;
        if (form.difficulty?.value) {
            const diff = form.difficulty.value;
        }

        this.targetRoll = difficulty + bonus + this.targetValue;

        return this
    }

    async evaluate(options = {}) {
        console.log(this.targetRoll.data);
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
            content += `<br/><span>Target (${this.targetRoll._formula}): ${this.targetRoll.result}</span>`
            const deg = this.targetRoll.total - this.mainRoll.total;
            content += `<br/><span>Degree of ${deg >= 0 ? "success" : "failure"}: ${deg}</span>`
        }
        content += "</p>"
        const msgData = {
            content
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
        if (this.options.critical) maxCrit = this.options.critical;
        if (this.mainRoll.total <= maxCrit) return " critical";

        return "";
    }
}
