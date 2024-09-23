const ROLL20_URL = "*://app.roll20.net/editor/*";
const FVTT_URL = "*://*/*game";
const DNDBEYOND_CHARACTER_URL = "*://*.dndbeyond.com/*characters/*";
const DNDBEYOND_MONSTER_URL = "*://*.dndbeyond.com/monsters/*";
const DNDBEYOND_ENCOUNTERS_URL = "*://*.dndbeyond.com/my-encounters";
const DNDBEYOND_ENCOUNTER_URL = "*://*.dndbeyond.com/encounters/*";
const DNDBEYOND_COMBAT_URL = "*://*.dndbeyond.com/combat-tracker/*";
const DNDBEYOND_SPELL_URL = "*://*.dndbeyond.com/spells/*";
const DNDBEYOND_VEHICLE_URL = "*://*.dndbeyond.com/vehicles/*";
const DNDBEYOND_SOURCES_URL = "*://*.dndbeyond.com/sources/*";
const DNDBEYOND_CLASSES_URL = "*://*.dndbeyond.com/classes/*";
const DNDBEYOND_EQUIPMENT_URL = "*://*.dndbeyond.com/equipment/*";
const DNDBEYOND_ITEMS_URL = "*://*.dndbeyond.com/magic-items/*";
const DNDBEYOND_FEATS_URL = "*://*.dndbeyond.com/feats/*";
const CHANGELOG_URL = "https://beyond20.here-for-more.info/update";
const DISCORD_BOT_INVITE_URL = "https://beyond20.kicks-ass.org/invite";
const DISCORD_BOT_API_URL = "https://beyond20.kicks-ass.org/roll";
const DISCORD_URL = "*://discord.com/*";
const ROLL20_DISCORD_ACTIVITY_DOMAIN = "*://1199271093882589195.discordsays.com/*";
const DISCORD_ACTIVITY_DOMAINS = [
    // discord.com is needed since the activity is an iframe within discord's app
    // without discord.com, a request from the popup.html will fail to pop up the settings
    DISCORD_URL, 
     // Roll20 Discord activity URL
    ROLL20_DISCORD_ACTIVITY_DOMAIN,
];
const DISCORD_ACTIVITY_PERMISSIONS = [
    "webNavigation", // Necessary to listen to navigations inside the discord activity iframe
];
const DISCORD_ACTIVITY_PERMISSION_DETAILS = {
    origins: DISCORD_ACTIVITY_DOMAINS,
    permissions: DISCORD_ACTIVITY_PERMISSIONS
};

const SUPPORTED_VTT_URLS = [
    "https://harpy.gg/*",
    "https://app.alchemyrpg.com/game/*",
    "https://dscryb.com/*",
    "https://codex.dragonshorn.com/*",
    "*://*.osrbeyond.com/*",
    ...DISCORD_ACTIVITY_DOMAINS
];


const BUTTON_STYLE_CSS = `
.character-button, .character-button-small {
    display: inline-block;
    border-radius: 3px;
    background-color: #96bf6b;
    color: #fff;
    font-family: Roboto Condensed,Roboto,Helvetica,sans-serif;
    font-size: 10px;
    border: 1px solid transparent;
    text-transform: uppercase;
    padding: 9px 15px;
    transition: all 50ms;
}
.character-button-small {
    font-size: 8px;
    padding: 5px;
    border-color: transparent;
    min-height: 22px;
}
.ct-button.ct-theme-button {
    cursor: default;
}
.ct-button.ct-theme-button--interactive {
    cursor: pointer;
}
.ct-button.ct-theme-button--filled {
    background-color: #c53131;
    color: #fff;
}
.mon-stat-block img {
    vertical-align: middle;
}
`;

