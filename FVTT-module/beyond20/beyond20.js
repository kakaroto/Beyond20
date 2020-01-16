Hooks.on('ready', function () {
    game.settings.register("beyond20", "notifyAtLoad", {
        name: "Notify player to activate Beyond20",
        hint: "On Chrome, Beyond20 extension doesn't load automatically. The module can show a notification to remind the player to activate it for the current tab.",
        scope: "client",
        config: true,
        default: true,
        type: Boolean
    });
    if (typeof (chrome) !== "undefined" && typeof (browser) === "undefined" && game.settings.get("beyond20", "notifyAtLoad")) {
        dialog = new Dialog({
            title: `Beyond20`,
            content: "<p>Beyond20 does not load automatically for FVTT games on Chrome.</p>" +
                "<p>If you wish to use Beyond20, please activate it by clicking on the <img style='border: 0px; vertical-align: middle;' src='modules/beyond20/images/icons/icon16.png'/> icon in the Chrome toolbar.</p>" +
                "<div class='form-group'>" +
                "<label for='dontaskagain'>Don't remind me again.</label>" +
                "<input name='dontaskagain' type='checkbox' value='false' data-dtype='Boolean'></input>" +
                "</div>",
            buttons: {
                dismiss: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Dismiss",
                    callback: html => {
                        game.settings.set("beyond20", "notifyAtLoad", !html.find("input[name=dontaskagain]")[0].checked);
                        dialog = null;
                    }
                }
            },
            default: "dismiss"
        }, { width: 600 }).render(true);

        let cb = () => {
            if (!dialog) return;
            if (document.title.startsWith("Foundry Virtual Tabletop")) {
                setTimeout(cb, 500);
            } else  {
                dialog.close();
            }
        }
        setTimeout(cb, 500)
    }
})
