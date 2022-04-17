import { FOE } from "./helpers/config.mjs"
export {default as FoERoll} from "./dice/foe-dice.mjs"

export {specialRoll, skillRoll}

async function specialRoll(ability, label, data = {}) {
    const r = new CONFIG.Dice.FoERoll("1d10", `@${ability}`, data, {label: label})

    const configured = await r.configureDialog({
        chooseDifficulty: true,
        difficulties: FOE.specialDifficulties,
    });
    if (configured == null) return null;

    r.evaluate({})
    return r;
}

/**
 * 
 * @param skill The skill to roll
 * @param label The label to give the roll
 * @param data The roll data
 * @param targetMod The target modifier
 * @param chooseConsumeAmmo Whether to ask if to consume some resource
 * @param chooseConsumeAmmoCallback What to do with the decision whether to consume ammo or not
 * @returns the roll
 */
async function skillRoll(skill, label, actor, targetMod, chooseConsumeResource = false, consumeResourceCallback) {
    let fumble = actor.fumbleVal(0, skill, false)
    let crit = actor.critVal(0, skill, false)
    const r = new CONFIG.Dice.FoERoll("1d100", `@${skill} ${targetMod ? '+ ' + targetMod: ''}`, actor.getRollData(), {
        label: label,
        fumble: 94+fumble,
        crit: 1+crit
    });
    const configured = await r.configureDialog({
        chooseDifficulty: true,
        difficulties: FOE.skillDifficulties,
        chooseConsumeResource,
        consumeResourceCallback
    });


    if (configured) {
        configured.evaluate({})
    }
    return configured;
}