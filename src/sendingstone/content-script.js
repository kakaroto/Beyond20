console.log("Beyond20: SendingStone module loaded.");

chrome.runtime.onMessage.addListener((data) => window.postMessage(data));
