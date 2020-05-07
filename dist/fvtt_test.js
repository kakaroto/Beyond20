// Avoid injecting much code in pages that aren't FVTT so we just activate
// the icon and let the background script inject the real FVTT script
if (document.title.indexOf("Foundry Virtual Tabletop") !== -1) {
    chrome.runtime.sendMessage({"action": "activate-icon"});
}
