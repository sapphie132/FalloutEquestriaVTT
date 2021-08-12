export {default as FoERoll} from "./dice/foe-dice.mjs"

export default function specialRoll(data = {}) {
    const r = new CONFIG.Dice.FoERoll("1d10", data, {})
    r.evaluate({async: false})
    return r;
}