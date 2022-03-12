console.log("Beyond20: Roleplay.tv module loaded.");

function handleMessage(request, sender, sendResponse) {
    console.log("Got message : ", request);
    if (request.action == "hp-update") {
        sendCustomEvent("UpdateHP", [request.character.name, request.character.hp, request.character["max-hp"], request.character["temp-hp"]]);
    } else if (request.action == "conditions-update") {
        sendCustomEvent("UpdateConditions", [request, request.character.name, request.character.conditions, request.character.exhaustion]);
    } else if (request.action == "roll") {
        sendCustomEvent("Roll", [request]);
    } else if (request.action == "rendered-roll") {
        sendCustomEvent("RenderedRoll", [request]);
    }
}

chrome.runtime.onMessage.addListener(handleMessage);
chrome.runtime.sendMessage({ "action": "register-rptv-tab" });