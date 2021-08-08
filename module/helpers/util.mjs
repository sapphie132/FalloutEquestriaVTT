export function promptRoll(difficulties, def="Default") {
    let content = "<form><select>" 
    for (let [difficulty, modifier] of Object.entries(difficulties)) {
        let selected = difficulty == def ? " selected" : "";
        content += '<option value="' + modifier + '"' + selected + '>' + difficulty + "</option>"
    }
    content += "</select></form>"
    let d = new Dialog({
        title: "Roll",
        content: content,
        buttons: {
            one: {
                label: '<p>Roll</p>',
                callback: html => _onDialogSubmit(html)
            }
        }
    });
    d.render(true);
    return 0;
};

function _onDialogSubmit(html) {
    const form = html[0].querySelector("form");
    console.log(form.select);
}