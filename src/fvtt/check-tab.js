// Avoid injecting much code in pages that aren't FVTT so we just activate
// the icon and let the background script inject the real FVTT script
// Foundry v13 renamed the main JS bundle, so look for any script containing
// "foundry.js" in its URL.
if (document.querySelector("script[src*='foundry.js']") !== null) {
    chrome.runtime.sendMessage({"action": "activate-icon"});
}
