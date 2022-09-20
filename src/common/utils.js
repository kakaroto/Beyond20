function replaceRollsCallback(match, replaceCB) {
    let dice = match[2];
    let modifiers = match[3];
    if (dice === undefined) {
        dice = "";
        modifiers = match[4];
    }
    if (modifiers) {
        modifiers = modifiers.replace(/−/g, "-");
    }
    dice = dice.replace("D", "d");

    const replacement = replaceCB(dice, modifiers);
    if (replacement === null) return match[0];
    else return `${match[1]}${replacement}${match[5]}`;
}

function replaceRolls(text, replaceCB) {
    // TODO: Cache the value so we don't recompile the regexp every time
    const dice_regexp = new RegExp(/(^|[^\w])(?:(?:(?:(\d*[dD]\d+(?:ro(?:=|<|<=|>|>=)[0-9]+)?(?:min[0-9]+)?)((?:(?:\s*[-−+]\s*\d+)|(?:\s*[0+]\s*\d*[dD]\d+))*))|((?:[-−+]\s*\d+)+)))($|[^\w])/, "gm");
    return text.replace(dice_regexp, (...match) => replaceRollsCallback(match, replaceCB));
}

// Used to clean various dice.includes(imperfections) roll strings;
function cleanRoll(rollText) {
    //clean adjacent '+'s (Roll20 treats it as a d20);
    //eg: (1d10 + + 2 + 3) -> (1d10 + 2 + 3);
    rollText = (rollText || "").toString();
    rollText = rollText.replace(/\+ \+/g, '+').replace(/\+ \-/g, '-');
    return rollText;
}

// Taken from https://stackoverflow.com/questions/45985198/the-best-practice-to-detect-whether-a-browser-extension-is-running-on-chrome-or;
function getBrowser() {
    if (typeof (chrome) !== "undefined") {
        if (typeof (browser) !== "undefined") {
            return "Firefox";
        } else {
            return "Chrome";
        }
    } else {
        return "Edge";

    }
}

function getPlatform() {
    let platform;
    if (navigator.userAgentData && navigator.userAgentData.platform) {
        // This is the official way to do it but it's not supported by anything but Edge
        platform = navigator.userAgentData.platform;
    } else if (navigator.platform) {
        // And this is supposed to be deprecated...
        platform = navigator.platform;
    } else {
        return "Unknown";
    }
    if (platform.includes("Windows") || platform.includes("Win32")) {
        return "Windows";
    } else if (platform.includes("Mac")) {
        return "Mac";
    } else {
        return platform;
    }
}

function isExtensionDisconnected() {
    try {
        chrome.runtime.getURL("");
        return false;
    } catch (err) {
        return true;
    }
}

// Taken from https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script;
function injectPageScript(url) {
    const s = document.createElement('script');
    s.src = url;
    s.charset = "UTF-8";
    s.onload = () => s.remove();
    (document.head || document.documentElement).appendChild(s);
}

function injectCSS(css) {
    const s = document.createElement('style');
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
}

function sendCustomEvent(name, data=[]) {
    if (getBrowser() === "Firefox")
        data = cloneInto(data, window);
    const event = new CustomEvent("Beyond20_" + name, { "detail": data });
    document.dispatchEvent(event);
}

function addCustomEventListener(name, callback) {
    const event = ["Beyond20_" + name, (evt) => {
        const detail = evt.detail || [];
        callback(...detail)
    }, false];
    document.addEventListener(...event);
    return event;
}

function roll20Title(title) {
    return title.replace(" | Roll20", "");
}

function isFVTT(title) {
    return title.includes("Foundry Virtual Tabletop");
}

function fvttTitle(title) {
    return title.replace(" • Foundry Virtual Tabletop", "");
}

function urlMatches(url, matching) {
    return url.match(matching.replace(/\*/g, "[^]*")) !== null;
}

function isCustomDomainUrl(tab) {
    // FVTT is handled separately from custom domains
    if (isFVTT(tab.title)) return false;
    for (const url of ((settings || {})["custom-domains"] || [])) {
        if (urlMatches(tab.url, url)) return true;
    }
    return false;
}

function isSupportedVTT(tab) {
    return SUPPORTED_VTT_URLS.some(url => urlMatches(tab.url, url))
}

function alertSettings(url, title) {
    if (alertify.Beyond20Settings === undefined)
        alertify.dialog('Beyond20Settings', function () { return {}; }, false, "alert");

    const popup = chrome.runtime.getURL(url);
    const img = E.img({src: chrome.runtime.getURL("images/icons/icon32.png"), style: "margin-right: 3px;"})
    const iframe = E.iframe({src: popup, style: "width: 100%; height: 100%;", frameborder: "0", scrolling: "yes"});
    const dialog = alertify.Beyond20Settings(img.outerHTML + title, iframe);
    const width = Math.min(720, window.innerWidth / 2); // 720px width or 50% on small screens
    dialog.set('padding', false).set('resizable', true).set('overflow', false).resizeTo(width, "80%");

}
function alertQuickSettings() {
    alertSettings("popup.html", "Beyond 20 Quick Settings");
}
function alertFullSettings() {
    alertSettings("options.html", "Beyond 20 Settings");
}

function isListEqual(list1, list2) {
    const list1_str = list1.join(",");
    const list2_str = list2.join(",");
    return list1_str == list2_str;

}
function isObjectEqual(obj1, obj2) {
    const obj1_str = Object.entries(obj1).join(",");
    const obj2_str = Object.entries(obj2).join(",");
    return obj1_str == obj2_str;
}

// replaces matchAll, requires a non global regexp
function reMatchAll(regexp, string) {
    const matches = string.match(new RegExp(regexp, "gm"));
    if ( matches) {
        let start = 0;
        return matches.map(group0 => {
            const match = group0.match(regexp);
            match.index = string.indexOf(group0, start);
            start = match.index;
            return match;
        });
    }
    return matches;
}

/**
 * Some users somehow inject html into their comments which include alertify classes
 * which can negatively impact how the page renders. We should remove those in order
 * to clean up the page
 */
function cleanupAlertifyComments() {
    const comments = $(".listing-comments");
    comments.find(".alertify, .alertify-notifier").remove();
}

E = new Proxy({}, {
    get: function (obj, name) {
        return new Proxy(function () {}, {
            apply: (target, thisArg, argumentsList) => {
                const attributes = argumentsList[0] || {};
                const children = argumentsList.slice(1);
                const e = document.createElement(name);
                for (const [name, value] of Object.entries(attributes))
                    e.setAttribute(name, value);
                for (const child of children)
                    e.append(child);
                return e;
            }
        });
    }
});


function initializeAlertify() {
    alertify.set("alert", "title", "Beyond 20");
    alertify.set("notifier", "position", "top-center");
    
    alertify.defaults.transition = "zoom";
    if (alertify.Beyond20Prompt === undefined) {
        const factory = function () {
            return {
                "settings": {
                    "content": undefined,
                    "ok_label": undefined,
                    "cancel_label": undefined,
                    "resolver": undefined,
                },
                "main": function (title, content, ok_label, cancel_label, resolver) {
                    this.set('title', title);
                    this.set('content', content);
                    this.set('resolver', resolver);
                    this.set('ok_label', ok_label);
                    this.set("cancel_label", cancel_label);
                },
                "setup": () => {
                    return {
                        "buttons": [
                            {
                                "text": alertify.defaults.glossary.ok,
                                "key": 13, //keys.ENTER;
                                "className": alertify.defaults.theme.ok,
                            },
                            {
                                "text": alertify.defaults.glossary.cancel,
                                "key": 27, //keys.ESC;
                                "invokeOnClose": true,
                                "className": alertify.defaults.theme.cancel,
                            }
                        ],
                        "focus": {
                            "element": 0,
                            "select": true
                        },
                        "options": {
                            "maximizable": false,
                            "resizable": false
                        }
                    }
                },
                "build": () => { },
                "prepare": function () {
                    this.elements.content.innerHTML = this.get('content');
                    this.__internal.buttons[0].element.innerHTML = this.get('ok_label');
                    this.__internal.buttons[1].element.innerHTML = this.get('cancel_label');
                },
                "callback": function (closeEvent) {
                    if (closeEvent.index == 0) {
                        this.get('resolver').call(this, $(this.elements.content.firstElementChild));
                    } else {
                        this.get('resolver').call(this, null);
                    }
                }
            }
        }
        alertify.dialog('Beyond20Prompt', factory, false, "prompt");
    }
    
    
    if (alertify.Beyond20Roll === undefined)
        alertify.dialog('Beyond20Roll', function () { return {}; }, false, "alert");
    
}
