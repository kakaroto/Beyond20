//import constants as c
//from utils import roll20Title, isFVTT, fvttTitle, getBrowser, urlMatches
//from settings import getDefaultSettings, getStoredSettings, mergeSettings

var settings = getDefaultSettings()
var fvtt_tabs = []

function updateSettings(new_settings = null) {
    if (new_settings) {
        settings = new_settings
    } else {
        getStoredSettings((saved_settings) => {
            settings = saved_settings
            const version = chrome.runtime.getManifest().version
            if (settings["show-changelog"] && settings["last-version"] != version) {
                mergeSettings({ "last-version": version })
                chrome.tabs.create({ "url": CHANGELOG_URL })
            }
        })
    }
}

function sendMessageTo(url, request, failure = null) {
    chrome.tabs.query({ url }, (tabs) => {
        if (failure)
            failure(tabs.length === 0)
        for (let tab of tabs)
            chrome.tabs.sendMessage(tab.id, request)
    })
}

function filterVTTTab(request, limit, tabs, titleCB) {
    let found = false
    for (let tab of tabs) {
        if ((limit.id == 0 || tab.id == limit.id) &&
            (limit.title == null || titleCB(tab.title) == limit.title)) {
            chrome.tabs.sendMessage(tab.id, request)
            found = true
        }
    }
    if (!found && limit.id != 0) {
        limit.id = 0
        mergeSettings({ "vtt-tab": limit })
        for (let tab of tabs) {
            if (titleCB(tab.title) == limit.title) {
                chrome.tabs.sendMessage(tab.id, request)
                found = true
                break
            }
        }
    }
    return found
}


function sendMessageToRoll20(request, limit = null, failure = null) {
    if (limit) {
        const vtt = limit.vtt || "roll20"
        if (vtt == "roll20") {
            chrome.tabs.query({ "url": ROLL20_URL }, (tabs) => {
                found = filterVTTTab(request, limit, tabs, roll20Title)
                if (failure)
                    failure(!found)
            })
        } else {
            failure(true)
        }
    } else {
        sendMessageTo(ROLL20_URL, request, failure = failure)
    }
}

function sendMessageToAstral(request, limit = null, failure = null) {
    if (limit) {
        const vtt = limit.vtt || "astral"
        if (vtt == "astral") {
            chrome.tabs.query({ "url": ASTRAL_URL }, (tabs) => {
                found = filterVTTTab(request, limit, tabs, astralTitle)
                if (failure)
                    failure(!found)
            })
        } else {
            failure(true)
        }
    } else {
        sendMessageTo(ASTRAL_URL, request, failure = failure)
    }
}


function sendMessageToFVTT(request, limit, failure = null) {
    console.log("Sending msg to FVTT ", fvtt_tabs)
    if (limit) {
        const vtt = limit.vtt || "roll20"
        if (vtt == "fvtt") {
            found = filterVTTTab(request, limit, fvtt_tabs, fvttTitle)
            if (failure)
                failure(!found)
        } else {
            failure(true)
        }
    } else {
        if (failure)
            failure(fvtt_tabs.length == 0)
        for (let tab of fvtt_tabs) {
            chrome.tabs.sendMessage(tab.id, request)
        }
    }
}

function sendMessageToBeyond(request) {
    sendMessageTo(DNDBEYOND_CHARACTER_URL, request)
    sendMessageTo(DNDBEYOND_MONSTER_URL, request)
    sendMessageTo(DNDBEYOND_ENCOUNTER_URL, request)
    sendMessageTo(DNDBEYOND_ENCOUNTERS_URL, request)
    sendMessageTo(DNDBEYOND_COMBAT_URL, request)
    sendMessageTo(DNDBEYOND_SPELL_URL, request)
    sendMessageTo(DNDBEYOND_VEHICLE_URL, request)
    sendMessageTo(DNDBEYOND_SOURCES_URL, request)
    sendMessageTo(DNDBEYOND_CLASSES_URL, request)
}

function addFVTTTab(tab) {
    for (let t of fvtt_tabs) {
        if (t.id == tab.id)
            return;
    }
    fvtt_tabs.push(tab);
    console.log("Added ", tab.id, " to fvtt tabs.");
}

function removeFVTTTab(id) {
    for (let t of fvtt_tabs) {
        if (t.id == id) {
            fvtt_tabs = fvtt_tabs.filter(tab => tab !== t);
            console.log("Removed ", id, " from fvtt tabs.");
            return;
        }
    }
}

function onRollFailure(request, sendResponse) {
    console.log("Failure to find a VTT")
    chrome.tabs.query({ "url": FVTT_URL }, (tabs) => {
        let found = false
        for (let tab of tabs) {
            if (isFVTT(tab.title)) {
                found = true;
                break;
            }
        }
        console.log("Found FVTT tabs : ", found, tabs)
        // Don't show the same message if (the tab is active but doesn't match the settings
        if (fvtt_tabs.length > 0) {
            found = false
        }
        if (found) {
            sendResponse({
                "success": false, "vtt": null, "request": request,
                "error": "Found a Foundry VTT tab that has not been activated. Please click on the Beyond20 icon in the browser's toolbar of that tab in order to give Beyond20 access."
            })
        } else {
            sendResponse({
                "success": false, "vtt": null, "request": request,
                "error": "No VTT found that matches your settings. Open a VTT window, or check that the settings don't restrict access to a specific campaign."
            })
        }
    });
}


const forwardedActions = [
    "roll",
    "rendered-roll",
    "hp-update",
    "conditions-update",
    "update-combat",
];

function onMessage(request, sender, sendResponse) {
    console.log("Received message: ", request)
    if (forwardedActions.includes(request.action)) {
        const makeFailureCB = (trackFailure, vtt, sendResponse) => {
            return (result) => {
                trackFailure[vtt] = result
                console.log("Result of sending to VTT ", vtt, ": ", result)
                if (trackFailure["roll20"] !== null && trackFailure["fvtt"] !== null && trackFailure["astral"] !== null) {
                    if (trackFailure["roll20"] == true && trackFailure["fvtt"] == true && trackFailure["astral"] == true) {
                        onRollFailure(request, sendResponse)
                    } else {
                        const vtts = []
                        for (let key in trackFailure) {
                            if (!trackFailure[key]) {
                                vtts.push(key)
                            }
                        }
                        sendResponse({ "success": true, "vtt": vtts, "error": null, "request": request })
                    }
                }
            }
        }
        const trackFailure = { "roll20": null, "fvtt": null, 'astral': null }
        if (settings["vtt-tab"] && settings["vtt-tab"].vtt === "dndbeyond") {
            sendResponse({ "success": false, "vtt": "dndbeyond", "error": null, "request": request })
        } else {
            sendMessageToRoll20(request, settings["vtt-tab"], failure = makeFailureCB(trackFailure, "roll20", sendResponse))
            sendMessageToFVTT(request, settings["vtt-tab"], failure = makeFailureCB(trackFailure, "fvtt", sendResponse))
            sendMessageToAstral(request, settings["vtt-tab"], failure = makeFailureCB(trackFailure, "astral", sendResponse))
        }
        return true
    } else if (request.action == "settings") {
        if (request.type == "general")
            updateSettings(request.settings)
        sendMessageToRoll20(request)
        sendMessageToBeyond(request)
        sendMessageToFVTT(request)
        sendMessageToAstral(request)
    } else if (request.action == "activate-icon") {
        // popup doesn't have sender.tab so we grab it from the request.
        const tab = request.tab || sender.tab;
        // Using browserAction on Chrome but pageAction on Firefox
        if (getBrowser() == "Chrome") {
            chrome.browserAction.setPopup({ "tabId": tab.id, "popup": "popup.html" });
        } else {
            chrome.pageAction.show(tab.id);
        }
        if (isFVTT(tab.title)) {
            injectFVTTScripts(tab);
        }
    } else if (request.action == "register-fvtt-tab") {
        addFVTTTab(sender.tab)
    } else if (request.action == "reload-me") {
        chrome.tabs.reload(sender.tab.id)
    } else if (request.action == "get-current-tab") {
        sendResponse(sender.tab)
    } else if (request.action == "forward") {
        chrome.tabs.sendMessage(request.tab, request.message, {frameId: 0}, sendResponse)
        return true
    }
    return false
}

function injectFVTTScripts(tab) {
    insertCSSs([tab], ["libs/css/alertify.css", "libs/css/alertify-themes/default.css", "libs/css/alertify-themes/beyond20.css", "dist/beyond20.css"])
    executeScripts([tab], ["libs/alertify.min.js", "libs/jquery-3.4.1.min.js", "dist/fvtt.js"])
}

function insertCSSs(tabs, css_files) {
    for (let tab of tabs) {
        for (let file of css_files) {
            chrome.tabs.insertCSS(tab.id, { "file": file })
        }
    }
}

function executeScripts(tabs, js_files) {
    for (let tab of tabs) {
        for (let file of js_files) {
            chrome.tabs.executeScript(tab.id, { "file": file })
        }
    }
}

function onTabsUpdated(id, changes, tab) {
    if (fvtt_tabs.includes(id) &&
        (Object.keys(changes).includes("url") && !urlMatches(changes["url"], "*) {//*/game")) ||
        (Object.keys(changes).includes("status") && changes["status"] == "loading"))
        removeFVTTTab(id)
}

function onTabRemoved(id, info) {
    removeFVTTTab(id)
}

function browserActionClicked(tab) {
    chrome.tabs.executeScript(tab.id, { "file": "dist/fvtt_test.js" })
}

updateSettings()
chrome.runtime.onMessage.addListener(onMessage)
chrome.tabs.onUpdated.addListener(onTabsUpdated)
chrome.tabs.onRemoved.addListener(onTabRemoved)

if (getBrowser() == "Chrome") {
    chrome.browserAction.onClicked.addListener(browserActionClicked)
    const manifest = chrome.runtime.getManifest()
    for (let script of manifest.content_scripts) {
        cb = (js_files, css_files) => {
            return (tabs) => {
                if (js_files) {
                    executeScripts(tabs, js_files)
                }
                if (css_files) {
                    insertCSSs(tabs, css_files)
                }
            }
        }
        chrome.tabs.query({ "url": script.matches }, cb(script.js, script.css))
    }
}

