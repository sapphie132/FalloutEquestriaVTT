export function promptRoll(options) {
    let d = new Dialog({
        title: "Roll",
        content: '<input class="roll-dialog"></input>',
        buttons: {
            one: {
                label: '<p>Roll</p>',
                callback: () => console.log("hi")
            }
        }
    });
    d.render(true);
    return 0;
}