ROLL20_URL = "*://app.roll20.net/editor/";
FVTT_URL = "*://*/game";
DNDBEYOND_CHARACTER_URL = "*://*.dndbeyond.com/*characters/*";
DNDBEYOND_MONSTER_URL = "*://*.dndbeyond.com/monsters/*";
DNDBEYOND_ENCOUNTERS_URL = "*://*.dndbeyond.com/my-encounters";
DNDBEYOND_ENCOUNTER_URL = "*://*.dndbeyond.com/encounters/*";
DNDBEYOND_COMBAT_URL = "*://*.dndbeyond.com/combat-tracker/*";
DNDBEYOND_SPELL_URL = "*://*.dndbeyond.com/spells/*";
DNDBEYOND_VEHICLE_URL = "*://*.dndbeyond.com/vehicles/*";
CHANGELOG_URL = "https://beyond20.here-for-more.info/update";
DISCORD_BOT_INVITE_URL = "https://beyond20.kicks-ass.org/invite";
DISCORD_BOT_API_URL = "https://beyond20.kicks-ass.org/roll";

BUTTON_STYLE_CSS = `
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
`;

ROLLTYPE_STYLE_CSS = `

.ct-beyond20-roll .ct-beyond20-roll-button {
    position: relative;
    margin-top: 7px;
}

.ct-beyond20-roll .ct-beyond20-roll-button:after {
    position: absolute;
    padding: 2px;
    top: -10px;
    right: -5px;
    font-size: 10px;
    border-radius: 5px;
    color: white;
    opacity: 65%;
}

.ct-beyond20-roll .ct-beyond20-roll-button.beyond20-roll-type-double:after,
.beyond20-quick-roll-tooltip.beyond20-roll-type-double:after {
    content: "2";
    background-color: blue;
}
.ct-beyond20-roll .ct-beyond20-roll-button.beyond20-roll-type-query:after,
.beyond20-quick-roll-tooltip.beyond20-roll-type-query:after {
    content: " != undefined";
    background-color: grey;
}
.ct-beyond20-roll .ct-beyond20-roll-button.beyond20-roll-type-thrice:after,
.beyond20-quick-roll-tooltip.beyond20-roll-type-thrice:after {
    content: "3";
    background-color: blue;
}
.ct-beyond20-roll .ct-beyond20-roll-button.beyond20-roll-type-advantage:after,
.beyond20-quick-roll-tooltip.beyond20-roll-type-advantage:after {
    content: "+";
    background-color: green;
}
.ct-beyond20-roll .ct-beyond20-roll-button.beyond20-roll-type-disadvantage:after,
.beyond20-quick-roll-tooltip.beyond20-roll-type-disadvantage:after {
    content: "-";
    background-color: red;
}
.ct-beyond20-roll .ct-beyond20-roll-button.beyond20-roll-type-super-advantage:after,
.beyond20-quick-roll-tooltip.beyond20-roll-type-super-advantage:after {
    content: "+ +";
    background-color: green;
}
.ct-beyond20-roll .ct-beyond20-roll-button.beyond20-roll-type-super-disadvantage:after,
.beyond20-quick-roll-tooltip.beyond20-roll-type-super-disadvantage:after {
    content: "- -";
    background-color: red;
}
`;
