import { FOE } from "./helpers/config.mjs"
export {default as FoERoll} from "./dice/foe-dice.mjs"

export {specialRoll, skillRoll}

async function specialRoll(ability, label, data = {}) {
    const r = new CONFIG.Dice.FoERoll("1d10", `@${ability}.tot`, data, {label: label})

    const configured = await r.configureDialog({
        chooseDifficulty: true,
        difficulties: FOE.specialDifficulties,
    });
    if (configured == null) return null;

    r.evaluate({})
    return r;
}

async function skillRoll(skill, label, data, targetMod) {
    if (!data.fumble) data.fumble = 0;
    if (!data.crit) data.crit = 0;
    if (!targetMod) targetMod = "";
    const r = new CONFIG.Dice.FoERoll("1d100", `@${skill}.tot ${targetMod ? '+' + targetMod: ''}`, data, {
        label: label,
        fumble: 94+data.fumble,
        crit: 1+data.crit
    });
    const configured = await r.configureDialog({
        chooseDifficulty: true,
        difficulties: FOE.skillDifficulties,
    });

    r.evaluate({})
    return r;
}