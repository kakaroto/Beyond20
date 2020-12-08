/*from elementmaker import E;
from settings import options_list, createHTMLOptionEx;
from utils import isFVTT, injectPageScript;
*/

function createOptionList() {
    $("main").prepend(E.ul({ class: "list-group beyond20-options" }));
    const options = $(".beyond20-options");
    options.append(createHTMLOptionEx("default-popup", {
        "title": "Not a D&D Beyond or VTT page",
        "description": "Open a D&D Beyond character sheet and try again.\n"  +
                        "VTT and Character specific options will be available from their respective pages.",
        "type": "info"
    }));
    options.append(createHTMLOptionEx("donate", options_list["donate"], true));
    options.append(
        E.li({ class: "list-group-item beyond20-option" },
            E.a({ id: "openOptions", class: "list-content", href: '#' },
                E.h4({}, "Beyond20 Options")
            )
        )
    );
    const img = $("#donate").find("img");
    img.attr({
        "src": img.attr("src").replace("donate.png", "donate32.png"),
        "width": 32,
        "height": 32
    });
    $("#openOptions").bind('click', (ev) => {
        chrome.runtime.openOptionsPage();
    });
}

function setupHTML() {
    createOptionList();
    $(document).on('click', 'a', function (ev) {
        const href = this.getAttribute('href');
        if (href.length > 0 && href != "#")
            window.open(this.href);
        return false;
    }
    );
}

function actOnCurrentTab(tab) {
    if (isFVTT(tab.title)) {
        // If FVTT, then inject the actual popup, instead of the default one.;
        chrome.runtime.sendMessage({ "action": "activate-icon", "tab": tab });
        injectPageScript("dist/popup.js");
    } else {
        setupHTML();
    }
}

if (chrome.tabs != undefined) {
    chrome.tabs.query({ "active": true, "currentWindow": true }, (tabs) => actOnCurrentTab(tabs[0]));
} else {
    chrome.runtime.sendMessage({ "action": "get-current-tab" }, actOnCurrentTab);
}
