var settings = getDefaultSettings()
var fvtt_tabs = []
var custom_tabs = []
var tabRemovalTimers = {};
var currentPermissions = {origins: []};
var openedChangelog = false;
const manifest = chrome.runtime.getManifest();
// Manifest V3 uses action instead of browserAction
const action = manifest.manifest_version >= 3 ? chrome.action : chrome.browserAction;

function updateSettings(new_settings = null) {
    if (new_settings) {
        settings = new_settings
    } else {
        getStoredSettings((saved_settings) => {
            updateSettings(saved_settings);
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
        sendMessageTo(ROLL20_URL, request, failure)
    }
}

function sendMessageToFVTT(request, limit, failure = null) {
    console.log("Sending msg to FVTT ", fvtt_tabs)
    if (limit) {
        const vtt = limit.vtt || "fvtt"
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

function sendMessageToCustomSites(request, limit, failure = null) {
    console.log("Sending msg to custom sites ", custom_tabs);
    if (failure)
        failure(custom_tabs.length == 0)
    for (let tab of custom_tabs) {
        chrome.tabs.sendMessage(tab.id, request)
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
    sendMessageTo(DNDBEYOND_EQUIPMENT_URL, request)
    sendMessageTo(DNDBEYOND_ITEMS_URL, request)
    sendMessageTo(DNDBEYOND_FEATS_URL, request)
}

function isFVTTTabAdded(tab) {
    return !!fvtt_tabs.find(t => t.id === tab.id);
}

function addFVTTTab(tab) {
    if (isFVTTTabAdded(tab)) return;
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

function isCustomTabAdded(tab) {
    return !!custom_tabs.find(t => t.id === tab.id);
}

function addCustomTab(tab) {
    if (isCustomTabAdded(tab)) return;
    custom_tabs.push(tab);
    console.log("Added ", tab.id, " to custom tabs.");
}

function removeCustomTab(id) {
    for (let t of custom_tabs) {
        if (t.id == id) {
            custom_tabs = custom_tabs.filter(tab => tab !== t);
            console.log("Removed ", id, " from custom tabs.");
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
                if (trackFailure["roll20"] !== null && trackFailure["fvtt"] !== null &&
                    trackFailure["custom"] !== null) {
                    if (trackFailure["roll20"] == true && trackFailure["fvtt"] == true &&
                        trackFailure["custom"] == true) {
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
        const trackFailure = { "roll20": null, "fvtt": null, "custom": null }
        if (settings["vtt-tab"] && settings["vtt-tab"].vtt === "dndbeyond") {
            sendResponse({ "success": false, "vtt": "dndbeyond", "error": null, "request": request })
        } else {
            sendMessageToRoll20(request, settings["vtt-tab"], makeFailureCB(trackFailure, "roll20", sendResponse))
            sendMessageToFVTT(request, settings["vtt-tab"], makeFailureCB(trackFailure, "fvtt", sendResponse))
            sendMessageToCustomSites(request, null, makeFailureCB(trackFailure, "custom", sendResponse))
        }
        return true
    } else if (request.action == "settings") {
        if (request.type == "general")
            updateSettings(request.settings)
        sendMessageToRoll20(request);
        sendMessageToBeyond(request);
        sendMessageToFVTT(request);
        sendMessageToCustomSites(request);
    } else if (request.action == "activate-icon") {
        // popup doesn't have sender.tab so we grab it from the request.
        const tab = request.tab || sender.tab;
        action.setPopup({ "tabId": tab.id, "popup": "popup.html" });
        if (isFVTT(tab.title)) {
            injectFVTTScripts([tab]);
            addFVTTTab(tab)
        } else if ((isCustomDomainUrl(tab) || isSupportedVTT(tab)) && !isCustomTabAdded(tab)) {
            injectGenericSiteScripts([tab]);
        }
        // maybe open the changelog
        if (!openedChangelog) {
            // Mark it true regardless of whether we opened it, so we don't check every time and avoid race conditions on setting save
            openedChangelog = true;
            const version = manifest.version;
            if (settings["show-changelog"] && settings["last-version"] != version) {
                mergeSettings({ "last-version": version })
                chrome.tabs.create({ "url": CHANGELOG_URL })
            }

        }
    } else if (request.action == "register-fvtt-tab") {
        addFVTTTab(sender.tab);
    } else if (request.action == "register-generic-tab") {
        action.setPopup({ "tabId": sender.tab.id, "popup": "popup.html" });
        addCustomTab(sender.tab);
    } else if (request.action == "reload-me") {
        chrome.tabs.reload(sender.tab.id)
    } else if (request.action == "load-alertify") {
        insertCSSs([sender.tab], ["libs/css/alertify.css", "libs/css/alertify-themes/default.css", "libs/css/alertify-themes/beyond20.css"]);
        executeScripts([sender.tab], ["libs/alertify.min.js"], sendResponse);
        return true
    } else if (request.action == "get-current-tab") {
        sendResponse(sender.tab)
    } else if (request.action == "forward") {
        chrome.tabs.sendMessage(request.tab, request.message, {frameId: 0}, sendResponse)
        return true
    }
    // Due to MV3 issues and a bug in chrome 99-101, apparently we need to always call sendResponse 
    // to prevent the socket from being closed
    sendResponse();
    return false
}

function injectFVTTScripts(tabs) {
    insertCSSs(tabs, ["libs/css/alertify.css", "libs/css/alertify-themes/default.css", "libs/css/alertify-themes/beyond20.css", "dist/beyond20.css"])
    executeScripts(tabs, ["libs/alertify.min.js", "libs/jquery-3.4.1.min.js", "dist/fvtt.js"])
}
function injectGenericSiteScripts(tabs) {
    insertCSSs(tabs, ["libs/css/alertify.css", "libs/css/alertify-themes/default.css", "libs/css/alertify-themes/beyond20.css", "dist/beyond20.css"])
    executeScripts(tabs, ["libs/alertify.min.js", "libs/jquery-3.4.1.min.js", "dist/generic_site.js"])
}

function insertCSSs(tabs, css_files, callback) {
    for (let tab of tabs) {
        // Use new Manifest V3 scripting API 
        if (manifest.manifest_version >= 3) {
            chrome.scripting.insertCSS( {
                target: {tabId: tab.id},
                files: css_files
            }, callback);
        } else {
            for (let file of css_files) {
                chrome.tabs.insertCSS(tab.id, { "file": file }, callback)
            }
        }
    }
}

async function executeScripts(tabs, js_files, callback) {
    for (let tab of tabs) {
        // Use new Manifest V3 scripting API 
        if (manifest.manifest_version >= 3) {
            console.log("Target is : ", tab);
            chrome.scripting.executeScript( {
                target: {tabId: tab.id},
                files: js_files
            }, callback);
        } else {
            for (let file of js_files) {
                chrome.tabs.executeScript(tab.id, { file: file }, callback)
            }
        }
    }
}

function onTabsUpdated(id, changes, tab) {
    if (isFVTTTabAdded(tab) &&
        ((changes.url && !urlMatches(changes.url, FVTT_URL)) ||
         (changes["status"] == "loading"))) {
        // Delay tab removal because the 'loading' could be caused by the injection of the page script itself
        // 100ms should be fast enough for page script but not so slow that a reload on a localhost would
        // fail to remove/add the tab, as it should
        tabRemovalTimers[id] = setTimeout(() => removeFVTTTab(id), 100);
    } else if (isCustomTabAdded(tab) &&
        ((changes.url && !isCustomDomainUrl(tab) && !isSupportedVTT(tab)) ||
         (changes["status"] == "loading"))) {
        // Delay tab removal because the 'loading' could be caused by the injection of the page script itself
        // 100ms should be fast enough for page script but not so slow that a reload on a localhost would
        // fail to remove/add the tab, as it should
        tabRemovalTimers[id] = setTimeout(() => removeCustomTab(id), 100);
    }
    /* Load Beyond20 on custom urls that have been added to our permissions */
    if (changes["status"] === "complete" &&
        (isFVTT(tab.title) || isCustomDomainUrl(tab) || isSupportedVTT(tab))) {
        // Cancel tab removal if we go back to complete within 100ms as the page script loads
        if (tabRemovalTimers[id]) {
            clearTimeout(tabRemovalTimers[id]);
        }
        if (!isFVTTTabAdded(tab) && !isCustomTabAdded(tab)) {
            // We cannot use the url or its origin, because Firefox, in its great magnificent wisdom
            // decided that ports in the origin would break the whole permissions system
            const origin = `${new URL(tab.url).protocol}//${new URL(tab.url).hostname}/*`;
            const hasPermission = currentPermissions.origins.some(pattern => urlMatches(origin, pattern));
            if (hasPermission) {
                if (isFVTT(tab.title)) {
                    executeScripts([tab], ["dist/fvtt_test.js"]);
                } else {
                    injectGenericSiteScripts([tab])
                }
            }
        }
    }

}

function onTabRemoved(id, info) {
    removeFVTTTab(id)
    removeCustomTab(id)
}

function onPermissionsUpdated() {
    chrome.permissions.getAll((permissions) => {
        currentPermissions = permissions;
    });
}

function browserActionClicked(tab) {
    console.log("Browser action clicked for tab : ", tab.id, tab.url);
    executeScripts([tab], ["dist/fvtt_test.js"])
}

updateSettings()
chrome.runtime.onMessage.addListener(onMessage)
chrome.tabs.onUpdated.addListener(onTabsUpdated)
chrome.tabs.onRemoved.addListener(onTabRemoved)
chrome.permissions.onAdded.addListener(onPermissionsUpdated)
chrome.permissions.onRemoved.addListener(onPermissionsUpdated)

chrome.permissions.getAll((permissions) => {
    currentPermissions = permissions;
    for (const pattern of currentPermissions.origins) {
        // Inject script in existing tabs
        chrome.tabs.query({ "url": pattern }, (tabs) => {
            // Skip if it's not a FVTT or custom tab
            const fvttTabs = tabs.filter(tab => isFVTT(tab.title));
            const customTabs = tabs.filter(tab => isCustomDomainUrl(tab) || isSupportedVTT(tab));
            console.log("Permissions : ", pattern, fvttTabs, customTabs);
            executeScripts(fvttTabs, ["dist/fvtt_test.js"]);
            injectGenericSiteScripts(customTabs);
        })
    }
});

if (getBrowser() == "Chrome") {
    // Re-inject scripts when reloading the extension, on Chrome
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
action.onClicked.addListener(browserActionClicked);
