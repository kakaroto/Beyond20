Hooks.on('ready', function () {
    if (typeof(chrome) !== "undefined" && typeof(browser) === "undefined") {
        ui.notifications.info("If you are using Beyond20, remember to activate it for this game by clicking on the icon in the toolbar.")
    }
})