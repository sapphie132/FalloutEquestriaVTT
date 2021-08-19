import { FOE } from "./helpers/config.mjs"
export {default as FoERoll} from "./dice/foe-dice.mjs"


export default async function specialRoll(ability, label, data = {}) {
    const r = new CONFIG.Dice.FoERoll("1d10", `@${ability}.tot`, data, {label: label})

    const configured = await r.configureDialog({
        chooseDifficulty: true,
        difficulties: FOE.specialDifficulties,
    });
    if (configured == null) return null;

    r.evaluate({})
    return r;
}