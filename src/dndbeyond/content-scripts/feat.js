console.log("Beyond20: D&D Beyond Feats module loaded.");

class FeatCharacter extends CharacterBase {
    constructor(global_settings) {
        super("feat", global_settings);
    }
    getDict() {
        const dict = super.getDict();
        if (this.avatar) {
            dict.avatar = this.avatar;
        }
        return dict;
    }
}

var character = null;
var settings = getDefaultSettings();

function addDisplayFeatButton() {
    const icon32 = chrome.runtime.getURL("images/icons/badges/normal32.png");
    const button = E.a({ class: "ct-beyond20-roll button-alt", href: "#" },
        E.span({ class: "label" },
            E.img({ class: "ct-beyond20-item-icon", src: icon32, style: "margin-right: 10px;" }),
            "Display Feat on VTT")
    );
    const feat_name = $(".page-title").text().trim();
    const sourceType = "Feat";
    const description = descriptionToString(".details-container-feat .details-container-content-description").trim();
    const feat_tags = $(".details-container-content-footer .tags .tag").toArray().map(elem => elem.textContent);
    $(".page-heading__content").after(button);

    $(".ct-beyond20-roll").css({
        "float": "right",
        "display": "inline-block"
    });
    $(".ct-beyond20-roll").on('click', (event) => {
        sendRoll(character, "trait", 0, {
            "name": feat_name,
            "source-type": sourceType,
            "description": description,
            "tags": feat_tags
        });
    }
    );
}

function documentLoaded(settings) {
    cleanupAlertifyComments();
    character = new FeatCharacter(settings);
    if (isRollButtonAdded()) {
        chrome.runtime.sendMessage({ "action": "reload-me" });
    } else {
        addDisplayFeatButton();
        const avatar = $(".details-container-aside .image-container img");
        if (avatar.length > 0) {
            character.avatar = avatar[0].src;
            const avatarImg = $(".details-container-aside .image-container");
            if (avatarImg) {
                addDisplayButton(() => {
                    sendRoll(character, "avatar", character.avatar, { "name": "Feat" });
                }, avatarImg, { small: false, image: true });
            }
        }
        const feat_name = $(".page-title").text().trim();
        if (settings['subst-dndbeyond'])
            injectDiceToRolls(".details-container-feat .details-container-content-description", character, feat_name);
    }
}

function updateSettings(new_settings = null) {
    if (new_settings) {
        settings = new_settings;
        if (character)
            character.setGlobalSettings(new_settings);
        key_bindings = getKeyBindings(settings);
        sendCustomEvent("NewSettings", [settings, chrome.runtime.getURL("")]);
    } else {
        getStoredSettings((saved_settings) => {
            sendCustomEvent("Loaded", [saved_settings]);
            documentLoaded(saved_settings);
            updateSettings(saved_settings);
        });
    }
}

function handleMessage(request, sender, sendResponse) {
    console.log("Received message:", request);
    if (request.action == "settings") {
        if (request.type == "general")
            updateSettings(request.settings);
    } else if (request.action == "open-options") {
        alertFullSettings();
    }
}

injectCSS(BUTTON_STYLE_CSS);
chrome.runtime.onMessage.addListener(handleMessage);
chrome.runtime.sendMessage({ "action": "activate-icon" });
updateSettings();
addCustomEventListener("SendMessage", _sendCustomMessageToBeyond20);

