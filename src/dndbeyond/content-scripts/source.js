console.log("Beyond20: D&D Beyond Source Book module loaded.");

class SourceBookCharacter extends CharacterBase {
    constructor(global_settings) {
        super("source", global_settings);
    }
    getDict() {
        const dict = super.getDict();
        if (this.avatar) {
            dict.avatar = this.avatar;
        }
        return dict;
    }
}

var settings = getDefaultSettings();
var character = null;


// Find the nearest heading in the text
// Taken from : https://stackoverflow.com/questions/35340275/selecting-nearest-heading-element
function nearestHeading(node, default_name="") {
    const header = $(node)
        .parentsUntil("*:has('h1, h2, h3, h4, h5, h6')")  // element's ancestors until one which has children headings 
        .last()  // the ancestor that has sibling headings
        .prevUntil('h1, h2, h3, h4, h5, h6')   // previous siblings until the nearest heading
        .addBack()  // in case the prevUntil() returns nothing
        .first()    // the first element after the heading
        .prev();    // the heading!
    return header.text() || default_name;
}


function documentLoaded(settings) {
    character = new SourceBookCharacter(settings);
    if (isRollButtonAdded() || isCustomRollIconsAdded()) {
        chrome.runtime.sendMessage({ "action": "reload-me" });
    } else {
        if (!settings['subst-dndbeyond']) return;
        const source_name = $(".page-title").text().trim();
        injectDiceToRolls(".primary-content", character, (node) => {
            return nearestHeading(node, source_name);
        });
        const read_aloud = $(".read-aloud-text,.adventure-read-aloud-text,.text--quote-box");
        for (const aside of read_aloud.toArray()) {
            const id = addRollButton(character, () => {
                sendRoll(character, "chat-message", 0, {
                    name: source_name,
                    message: $(aside).text().trim()
                });
            }, aside, { small: true, image: false, before: true, text: "Display in VTT"});
            // Display the button on top of the read aloud text
            $(`#${id}`).css({
                "position": "absolute",
                "z-index": "1",
                "right": "0",
            });
        }

        // Add a display on all images
        const images = $(".compendium-image, .compendium-art");
        for (const image of images.toArray()) {
            const imageSrc = $(image).find("img").attr("src");
            // Place the button inside the <a> tag if it exists, so it is properly displayed/centered
            // otherwise, it can mess up the layout of the page
            let placement = $(image).find("a");
            if (placement.length !== 1) {
                placement = image;
            }
            addDisplayButton(async (event) => {
                // We add the button inside the <a> tag, so we need to prevent the click event from bubbling up
                // and opening the lightbox
                event.stopPropagation();
                event.preventDefault();
                character.avatar = imageSrc;
                await sendRoll(character, "avatar", imageSrc, { "name": source_name });
                character.avatar = null;
            }, placement, { small: false, image: true });
        }

        // Add display button on lightbox ("view player version")
        addDisplayButton(async () => {
            const imageSrc = $("#lightbox img").attr("src");
            character.avatar = imageSrc;
            await sendRoll(character, "avatar", imageSrc, { "name": source_name });
            character.avatar = null;
        }, $("#lightbox"), { small: false, image: true });

        for (const block of $("div.stat-block-finder, div.vehicle-block-finder")) {
            const statblock = $(block)
            removeRollButtons(statblock);
            const chunkId = statblock.data("content-chunk-id");
            if (chunkId) {
                const blockFinderClass = Array.from(block.classList).find(c => c.includes("block-finder"));
                const selector = `div.${blockFinderClass}[data-content-chunk-id=${chunkId}]`;
                const type = blockFinderClass === 'stat-block-finder' ? "Monster" : "Vehicle";
                const monster = new Monster(type, selector, settings, {character});
                monster.parseStatBlock(statblock);
            }
        }
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
