export {default as FoERoll} from "./dice/foe-dice.mjs"

export default function specialRoll(ability, label, data = {}) {
    // TODO: fix target formula
    const r = new CONFIG.Dice.FoERoll("1d10", `@${ability}.tot`, data, {label: label})
    r.evaluate({})
    return r;
}