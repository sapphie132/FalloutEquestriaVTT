
export function fetchAndLocalize(obj, table) {
    for (let [k, v] of Object.entries(obj)) {
        v.label = game.i18n.localize(table[k] ?? k);
    }
}
