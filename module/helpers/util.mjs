
/**
 * Appends a localised label to each key of obj
 * @param {*} obj 
 * @param {*} table 
 */
export function fetchAndLocalize(obj, table) {
    for (let [k, v] of Object.entries(obj)) {
        // TODO: bandaid fix
        let lookup = table[k] ?? k;
        if (typeof (lookup) === 'object') {
            lookup = lookup ? lookup.label : k
        }
        v.label = game.i18n.localize(lookup);
    }
}

export function evaluateFormula(formula, rollData, fallbackFormula) {
    let result;
    let sentry = false;

    if (!formula) formula = fallbackFormula;
    try {
        const replaced = Roll.replaceFormulaData(formula, rollData);
        result = Roll.safeEval(replaced);
    } catch (err) {
        if (fallbackFormula) {
            const replaced = Roll.replaceFormulaData(fallbackFormula, rollData);
            result = Roll.safeEval(replaced);
        } else {
            throw err
        }
    }
    if (fallbackFormula) {
        return [result, sentry]
    } else {
        return result
    }
}