import { FOE } from "./helpers/config.mjs"
export {default as FoERoll} from "./dice/foe-dice.mjs"

export {specialRoll, skillRoll}

async function specialRoll(ability, label, data = {}) {
    const r = new CONFIG.Dice.FoERoll("1d10", `@${ability}.value`, data, {label: label})

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
async function skillRoll(skill, label, data, targetMod, chooseConsumeResource = false, consumeResourceCallback) {
    if (!data.fumble) data.fumble = 0;
    if (!data.crit) data.crit = 0;
    if (!targetMod) targetMod = "";
    const r = new CONFIG.Dice.FoERoll("1d100", `@${skill}.total ${targetMod ? '+' + targetMod: ''}`, data, {
        label: label,
        fumble: 94+data.fumble,
        crit: 1+data.crit
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