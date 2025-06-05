// Avoid injecting much code in pages that aren't FVTT so we just activate
// the icon and let the background script inject the real FVTT script
if (document.querySelector("script[src='scripts/foundry.js'], script[src='scripts/foundry.mjs']") !== null) {
    chrome.runtime.sendMessage({"action": "activate-icon"});
}
