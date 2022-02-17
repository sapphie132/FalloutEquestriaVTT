
/**
 * Appends a localised label to each key of obj
 * @param {*} obj 
 * @param {*} table 
 */
export function fetchAndLocalize(obj, table) {
    for (let [k, v] of Object.entries(obj)) {
        // TODO: bandaid fix
        let lookup = table[k] ?? k;
        if (typeof(lookup) === 'object') {
            lookup = lookup ? lookup.label : k
        }
        v.label = game.i18n.localize(lookup);
    }
}
