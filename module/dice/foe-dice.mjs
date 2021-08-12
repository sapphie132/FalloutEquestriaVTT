/* 
Code originally from the dnd 5e module (https://gitlab.com/foundrynet/dnd5e/-/blob/master/module/dice/d20-roll.js)
Adapted by Sapphie
*/
export default class FoERoll extends Roll {
    constructor(formula, data, options) {
        super(formula, data, options);

        if (!((this.terms[0] instanceof Die) && (this.terms[0].faces === 10))) {
            console.log(this.terms[0]);
            throw new Error(`Invalid SpecialRoll formula provided ${this._formula}`);
        }
        this.configureModifiers();

    }

    static EVALUATION_TEMPLATE = "systems/foe/templates/chat/roll-dialog.html";

    configureModifiers() {
        let d = this.terms[0]
        d.modifiers = [];

        this._formula = this.constructor.getFormula(this.terms);
    }

    async configureDialog({ title, defaultRollMode, chooseAbility = false, defaultAbility, chooseDifficulty=true, defaultDifficulty, template } = {}, options = {}) {
        const content = await renderTemplate(template ?? this.constructor.EVALUATION_TEMPLATE, {
            formula: `${this.formula} + @bonus`,
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
            bonusRoll.evaluate({async:false});
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

        this.totalTarget = difficulty + bonus + this.targetValue;

        return this
    }
    
    async evaluate(options = {}) {
        super.evaluate(options);
    }

    async toMessage(messageData, options) {
        if (!this._evaluated) await this.evaluate({async: true});
        const create = options.create;
        options.create = false;
        messageData.content = "hi";
        let msgData = await super.toMessage(messageData, options);
        // msgData.content = "hi";
        if ( create ) return ChatMessage.create(msgData);
        else return msgData;
    }
}