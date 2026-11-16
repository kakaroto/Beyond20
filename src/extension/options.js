var advancedOptions = false;
var savePillTimer = null;

function filterOptions() {
    const query = ($("#b20-search").val() || "").trim().toLowerCase();
    const items = $(".beyond20-options > .beyond20-option");
    if (!query) {
        items.show();
        return;
    }
    items.each(function () {
        const text = $(this).text().toLowerCase();
        $(this).toggle(text.indexOf(query) !== -1);
    });
}

function createOptionList() {
    $("main .beyond20-options").remove();
    const options = [];
    for (let option in options_list) {
        const child = createHTMLOption(option, false, options_list, {advanced: advancedOptions});
        if (child)
            options.push(child);
    }
    $("main").prepend(E.ul({ class: "list-group beyond20-options" }, ...options));
    filterOptions();
}

function save_settings() {
    saveSettings((settings) => {
        if (chrome.runtime.lastError) {
            console.log('Chrome Runtime Error', chrome.runtime.lastError.message);
        } else {
            chrome.runtime.sendMessage({ "action": "settings", "type": "general", "settings": settings });
            const pill = $("#b20-save-pill");
            if (pill.length) {
                pill.text("Saved ✓").addClass("is-saved");
                clearTimeout(savePillTimer);
                savePillTimer = setTimeout(() => {
                    pill.text("Auto-saved").removeClass("is-saved");
                }, 1800);
            } else {
                $('.success').toggleClass('show');
                setTimeout(() => $('.success').toggleClass('show'), 3000);
            }
        }
    });
}

function gotSettings(stored_settings) {
    $("ul").removeClass("disabled");
}

function setupHTML() {
    createOptionList();
    $("ul").addClass("disabled");
    initializeSettings(gotSettings);
    $('.beyond20-option-input').change(save_settings);
    $(".beyond20-options").on("markaChanged", save_settings);
    $(document).off('click.b20links').on('click.b20links', 'a', function (ev) {
        const href = this.getAttribute('href');
        if (href && href.length > 0 && href != "#") 
            window.open(this.href);
        return false;
    });
}

function setupOptionsMenu() {
    setupHTML();
    $('#save').on('click', save_settings);
    $('#b20-search').on('input', filterOptions);
    $('#advanced').on('click', (ev) => {
        advancedOptions = !advancedOptions;
        $(ev.currentTarget)
            .text(advancedOptions ? "Basic Options" : "Advanced Options")
            .toggleClass("active", advancedOptions);
        setupHTML();
    });
}

setupOptionsMenu();
