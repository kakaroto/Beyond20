
function createOptionList() {
    const options = [];
    for (let option in options_list) {
        const child = createHTMLOption(option);
        if (child)
            options.push(child);
    }
    $("main").prepend(E.ul({ class: "list-group beyond20-options" }, ...options));
}

function save_settings() {
    saveSettings((settings) => {
        if (chrome.runtime.lastError) {
            console.log('Chrome Runtime Error', chrome.runtime.lastError.message);
        } else {
            chrome.runtime.sendMessage({ "action": "settings", "type": "general", "settings": settings });
            $('.success').toggleClass('show');
            setTimeout(() => $('.success').toggleClass('show'), 3000);
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
    $('#save').bind('click', save_settings);
    $('.beyond20-option-input').change(save_settings);
    $(".beyond20-options").on("markaChanged", save_settings);
    $(document).on('click', 'a', function (ev) {
        const href = this.getAttribute('href');
        if (href.length > 0 && href != "#") 
            window.open(this.href);
        return false;
    });
}

setupHTML();