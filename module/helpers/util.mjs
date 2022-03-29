
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

/**
 * Evaluates the provided formula. If that fails, evaluate the
 * fallback formula, and return a variable to indicate that it failed.
 * 
 * If no fallback formula was provided, throw an exception if it fails,
 * otherwise return only the result
 * @param {String} formula 
 * @param {Dict} rollData 
 * @param {String} fallbackFormula 
 * @returns [result, isFormulaBad] if fallbackFormula provided. Otherwise, result
 */
export function evaluateFormula(formula, rollData, fallbackFormula = null) {
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

export function selectedOption(selector) {
    return selector.options[selector.selectedIndex].value;
}