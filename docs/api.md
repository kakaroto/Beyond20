# Beyond20's API

Beyond20 has an internal API that it uses to communicate events between D&D Beyond and the VTT sites.
This page will describe that API so it can be better understood by fellow developers wanting to make use of Beyond20. 
There are 3 types of APIs that Beyond20 includes.
- Its own internal classes, functions and methods which allows it to do its thing. This API is not documented here as it is internal to the Beyond20 components
- The Messaging API which defines which message requests can be sent between websites and their data format
- The DOM API which defines the DOM custom events that can be sent from and to Beyond20 with websites in order to communicate

# Table of Contents

- [Architecture](#architecture)
- [Message API](#message-api)
  - [Tab->Background specific messages](#tab-background-specific-messages)
  - [Tab->Tab forwarded messages](#tab-tab-forwarded-messages)
  - [Tab<->Tab dispatched messages](#tab-tab-dispatched-messages)
  - [Message events](#message-events)
    - [activate-icon](#activate-icon)
    - [load-alertify](#load-alertify)
    - [reload-me](#reload-me)
    - [register-fvtt-tab](#register-fvtt-tab)
    - [register-generic-tab](#register-generic-tab)
    - [get-current-tab](#get-current-tab)
    - [forward](#forward)
    - [open-options](#open-options)
    - [get-character](#get-character)
    - [settings](#settings)
    - **[roll](#roll)**
    - **[rendered-roll](#rendered-roll)**
    - **[hp-update](#hp-update)**
    - **[conditions-update](#conditions-update)**
    - **[update-combat](#update-combat)**
  - [Roll types available](#roll-types-available)
    - [avatar](#avatar)
    - [initiative](#initiative)
    - [ability](#ability)
    - [saving-throw](#saving-throw)
    - [skill](#skill)
    - [trait](#trait)
    - [item](#item)
    - [attack](#attack)
    - [spell-card](#spell-card)
    - [spell-attack](#spell-attack)
    - [roll-table](#roll-table)
    - [hit-dice](#hit-dice)
    - [death-save](#death-save)
    - [chat-message](#chat-message)
    - [digital-dice](#digital-dice)
    - [custom](#custom)
  - [Beyond20 object formats](#beyond20-object-formats)
    - [Forwarded message response format](#forwarded-message-response-format)
    - [Whisper Type Format](#whisper-type-format)
    - [Roll Type Format](#roll-type-format)
    - [Beyond20 Character Format](#beyond20-character-format)
      - [Character character fields](#character-character-fields)
      - [Monster character fields](#monster-character-fields)
    - [Ability Format](#ability-format)
    - [Roll Format](#roll-format)
    - [Dice Roll Format](#dice-roll-format)
    - [Damage Roll Info Format](#damage-roll-info-format)
- [The DOM API](#the-dom-api)
  - [Listening to custom events](#listening-to-custom-events)
  - [Sending custom events](#sending-custom-events)
- [Integrating with Beyond20](#integrating-with-beyond20)
  - [Example](#example)


## Architecture
The architecture of the Beyond20 extension is relatively simple, in that the extension loads scripts into the Character Sheet pages as well as the VTT pages. Beyond20 also has a background script that runs permanently and is the glue between the Sheet and VTT pages, allowing them to communicate with each other.
A Sheet page can be anything, from a D&D Beyond Character Sheet, to a Spell description page, or a NPC page, or even the Encounter combat tracker. Those are all considered "character sheets" with a very loose definition of what a "character" is. With the recent addition of support for custom domains, a character sheet could also be any non D&D Beyond site.
Similarly, a VTT tab can be any site able to receive a roll request and process it. 

## Message API
Beyond20 uses the browser extension's `sendMessage` API in order to communicate between one tab and another. Some of these messages are only going as far as the Beyond20 background process, while others will get forwarded to any other websites that Beyond20 supports.

Every message sent this way will have a field `action` which determines what the message represents, and additional fields that are specific to the action.

In the documentation below, any reference to a 'tab' will mean a browser tab and will therefor represent any website page(whether from D&D Beyond or a VTT or even the browser popup dialog when clicking the Beyond20 icon in the address bar)

The easiest way to get examples and see what kind of data is being sent would be to open the dev console and make rolls with Beyond20. The console should display whenever it's sending a message, giving you access to the full data.

Here is a list of the messages that are supported and what they do:

### Tab->Background specific messages
These are messages that a tab can send to the background Beyond20 process
- `activate-icon`: Sets the Beyond20 icon to become 'active' in the address bar and changes the default popup
- `load-alertify`: Requests the background script to load the alertify library into the current tab
- `reload-me`: Asks the Background script to reload the current page
- `register-fvtt-tab`: Registers the current tab as being a FVTT tab so it can receive forwarded messages from Beyond20
- `register-generic-tab`: Registers a custom domain tab as being a generic tab so it can receive forwarded messages from Beyond20
- `get-current-tab`: Request the background script to send information about the current tab
- `forward`: Request the background script to forward the current message to a specific tab (used by the browser popup)

### Tab->Tab forwarded messages
These are messages that can only be sent to a specific tab via the `forward` message. These are used by the browser popup to communicate with the tab it was open on.
- `open-options`: Request the site to pop open the Beyond20 options modal
- `get-character`: Request the site to return information on the current character

### Tab<->Tab dispatched messages
These are messages that a tab can send to every other registered tab at once
- `settings`: Event to notify of an update to the Beyond20 settings
- `roll`: Make a roll request
- `rendered-roll`: Request the display of a pre-rolled and pre-rendered roll
- `hp-update`: Notification of a character's HP being updated
- `conditions-update`: Notification of a character's conditions being updated
- `update-combat`: Notification of the turn tracker content being updated


### Message events
As can be seen above, there are multiple messages that can be sent between a tab and Beyond20, a tab and another tab, or a tab and all other tabs. 

We'll now describe the action as well as the data format of these messages:

#### activate-icon
The activate-icon allows the background process to set the browser popup as active and set the correct popup to display. Without this event being sent, any clicks on the beyond20 icon in the address bar will popup a "This is not a VTT tab" dialog.
In the case of FVTT or a custom domain for a supported VTT, this will also load into the page the content script needed to support Beyond20.

Message Format:
```js
{
    action, // <String> Must be "activate-icon",
    tab,    // <Tabs.Tab> (Optional) can be a `Tab` object to activate on a specific tab rather than our own (used by browser popup)
}
```
Does not return a reply message.

#### load-alertify
Injects into the current tab the alertify library with its CSS, which allows the use of the `alertify` API function to pop open a Beyond20-styled alerts.
Note that alertify is automatically loaded into Roll20, FVTT and Custom domain sites.
This is only used to load alertify into D&D Beyond pages manually, as Beyond20 does not do it automatically due to tinyMCE iframes corrupting comment chat boxes in monster pages.

Message Format:
```js
{
    action // <String> Must be "load-alertify"
}
```
Sends an empty reply message when alertify has been loaded into the page.

#### reload-me
Asks the Background script to reload the current page, this is the equivalent of calling `window.location.reload()` but for content scripts.

Message Format:
```js
{
    action // <String> Must be "reload-me"
}
```
Does not return a reply message.

#### register-fvtt-tab
Registers the current tab as being a FVTT tab so it can receive forwarded messages from Beyond20


Message Format:
```js
{
    action // <String> Must be "register-fvtt-tab"
}
```
Does not return a reply message.

#### register-generic-tab
Registers a custom domain tab as being a generic tab so it can receive forwarded messages from Beyond20

Message Format:
```js
{
    action // <String> Must be "register-generic-tab"
}
```
Does not return a reply message.

#### get-current-tab
Request the background script to send information about the current tab

Message Format:
```js
{
    action // <String> Must be "get-current-tab"
}
```

Responds with a message containing the tab information. Refer to the [Tabs.tab](https://developer.chrome.com/docs/extensions/reference/tabs/#type-Tab) API for the format.

#### forward
Request the background script to forward the current message to a specific tab (used by the browser popup).
Note that the message being forwarded will have its own `action` field.

Message Format:
```js
{
    action,  // <String> Must be "forward"
    tab,     // <Tabs.Tab> The tab to forward the request to
    message  // <Object> The message object to forward to the tab
}
```
Will respond with whatever the tab responds with (no response if the message does not warrant one)


#### open-options
Request the site to pop open the Beyond20 options modal. This is used by the browser popup when the user clicks "More Options".
Must be sent through a `forward` message to a specific tab.

Message Format:
```js
{
    action,  // <String> Must be "open-options"
}
```
Does not return a reply message.

#### get-character
Request the site to return information on the current character.
Must be sent through a `forward` message to a specific tab.

```js
{
    action,  // <String> Must be "get-character"
}
```
Returns a [Beyond20Character](#beyond20-character-format) object as response.


#### settings
Event to notify of an update to the Beyond20 settings. 
Gets forwarded to all registered tabs.

Message Format:
```js
{
    action,    // <String> Must be "settings"
    type,      // <String> Can be "general" to report Beyond20 general settings, or "character" for character-specific settings
    settings,  // <Object> The newly updated settings
    id         // <String> The unique ID of the character sheet if the type is set to "character" (ignored for type="general")
}
```
Does not return a reply message.

#### roll
Make a roll request. This message occurs when a user clicks on a character sheet's button to make a roll. In this instance "character sheet" follows the loose definition of what a character sheet is (a Spell can be considered a character), and a "roll" is also a loose definition where it could just be "display this spell card" or "display this to message to the chat log".

Due to the various types of rolls available and the complexities involved in each type of roll, the more detailed breakdown of each roll type and its message format is detailed separated below under the [Roll types](#roll-types-available) section.

Message Format:
```js
{
    action,     // <String> Must be "roll"
    type,       // <String> The type of roll being made
    character,  // <Beyond20Character> The character that made the roll
    roll,       // <String> The dice roll formula to roll as a fallback if the specific roll data is not recognized
    advantage,  // <RollType> The kind of roll advantage to use for this roll
    whisper,    // <WhisperType> The whisper setting used for this roll
    preview,    // <String> (Optional) A URL to an image for the weapon/item/spell/etc.. used for the roll
    ...         // Extra arguments are added based on the type of roll being made
}
```
Returns a report about whether the request was successfully forwarded to a VTT. See [format](#forwarded-message-response-format)

Structure definition of non standard fields: [Beyond20Character](#beyond20-character-format), [WhisperType](#whisper-type-format) and [RollType](#roll-type-format)


#### rendered-roll
Request the display of a pre-rolled and pre-rendered roll that was made. This is equivalent to the `roll` event above, but uses the Beyond20 RollRenderer to roll the dice (if needed) and generate an html output from the results.
This will usually be sent in place of a `roll` event when the user has the D&D Beyond Digital Dice enabled and the actual dice rolls are made on D&D Beyond's side, rather than needing to be rolled on the VTT side.
When receiving a `rendered-roll` message, if the VTT supports displaying html, then the `message.html` could be added to the chat log and it would contain everything needed with no additional processing required.
It could also ignore the `html` property and rebuild the result by using the other fields included in the message, which would contain all the information required to rebuild the roll, including all the roll results and totals calculation (in case of an attack roll which includes damage), etc...

Message Format:
```js
{
    action,         // <String> Must be "rendered-roll"
    rendered,       // <String> (Optional) If this value is set, and its value is "fallback", it means that the roll was 
                    // not made as part of the user's roll (DDB Digital Dice) but rather, it was pre-rendered as a
                    // fallback in case the site does not support dice rolling. 
    request,        // <Request> The original `roll` request that was rendered
    title,          // <String> The Title 
    html,           // <String> The pre-rendered roll html. This contains the output roll from Beyond20 to display
    character,      // <Beyond20Character> The character that made the roll
    whisper,        // <WhisperType> The whisper setting used for this roll
    play_sound,     // <Boolean> Set to true if there were actual dice that were rolled (false if only flat numbers or description only)
    source,         // <String> The source of the roll
    attributes,     // <Object> A {key:value} object of roll attributes
    description,    // <String> Description of the roll
    attack_rolls,   // <Array<Roll>> Array of rolls made for attack. This is generally the d20 rolls (to hit, or ability check or save)
    roll_info,      // <Array<Array<String>>> An array of information related to the roll, in the form of [name, value] string tuples (used for including things like the save DC). 
    damage_rolls,   // <Array<DamageRollInfo>> An array of damage rolls
    total_damages,  // <Object> An object of {type:total} values where the type is the label for the kind of total damage calculation and the total is a string with the total amount of damage.
    open
}
```
Returns a report about whether the request was successfully forwarded to a VTT. See [format](#forwarded-message-response-format)

Note that a skill check or saving throw or even a custom dice roll will include the roll results in the `attack_rolls` field. That field is misnamed as it really means the 'primary' rolls, which are the d20 in the case of a skill check/ability roll/saving throw, or the to-hit d20 rolls in an attack roll, or the custom dice formula in the case of a custom roll.

Structure definition of non standard fields: [Beyond20Character](#beyond20-character-format), [WhisperType](#whisper-type-format), [Roll](#roll-format) and [DamageRollInfo](#damage-roll-info-format)

#### hp-update
Notification of a character's HP being updated.
Can also be sent initially to define the starting HP of the character when the character sheet page is opened.

Message Format:
```js
{
    action,   // <String> Must be "hp-update"
    character // <Beyond20Character> The Character object describing the character
}
```
Returns a report about whether the request was successfully forwarded to a VTT. See [format](#forwarded-message-response-format)

#### conditions-update
Notification of a character's conditions being updated.
Can also be sent initially to define the starting conditions of the character when the character sheet page is opened.

Message Format:
```js
{
    action,  // <String> Must be "conditions-update"
    character // <Beyond20Character> The Character object describing the character
}
```
Returns a report about whether the request was successfully forwarded to a VTT. See [format](#forwarded-message-response-format)

#### update-combat
Notification of the turn tracker content being updated

Message Format:
```js
{
    action,           // <String> Must be "update-combat"
    combat: [{        // <Array<Object>> An array of all characters in combat, ordered by initiative
        name,         // <String> Name of the character in the turn order
        initiative,   // <Number> The initiative value of the character
        turn,         // <Boolean> Whether it's this character's turn in the turn order
        tags,         // <Array<String>> An array of strings for each 'tag' the combatant has. 
                      // D&D Beyond uses the following list of tags (non-exhaustive list): `character`, `monster`, `is-healthy`, `is-critical`, 
    }]
}
```
Returns a report about whether the request was successfully forwarded to a VTT. See [format](#forwarded-message-response-format)

### Roll types available

The `roll` message can have different values for the `type` field, each requiring its own set of extra fields added to the message.

Here is the list of accepted values for the `type` field:
- `avatar`: Display the avatar image of the character
- `initiative`: Roll initiative
- `ability`: Roll an ability check
- `saving-throw`: Roll a saving throw
- `skill`: Roll a skill check
- `trait`: Display a character trait or feature
- `item`: Display an item
- `attack`: Roll an attack
- `spell-card`: Display a spell card
- `spell-attack`: Roll a spell attack
- `roll-table`: Roll from a roll table
- `hit-dice`: Roll hit dice
- `death-save`: Roll a death saving throw
- `chat-message`: Display a chat message string to the chat log
- `digital-dice`: Digital dice were rolled
- `custom`: Roll a custom roll formula

#### avatar
This roll type is sent when clicking on the "Display avatar" button to show an avatar image to the other players.
The avatar to show is to be taken from `request.character.avatar`. The default `roll` value is also set to the URL of the image to show as a fallback.

Additional fields added to the roll request:
- `name`: the alt title of the image. Can be the name of the character or monster whose image is being shown, or could be "Avatar" or "Item" or the name of the Item, etc...

#### initiative
Make an initiative roll. 

Additional fields added to the roll request:
- `initiative`: the initiative modifier
- `effects`: (Optional) An `<Array<string>>` array of effect names that are applied to this roll


#### ability
Rolls an ability check

Additional fields added to the roll request:
- `name`: The name of the ability check being rolled
- `ability`: The abbreviation for the ability being rolled (STR, DEX, CON, INT, WIS, CHA)
- `modifier`: The ability modifier
- `ability-score`: (Optional) The score value of the ability being rolled
- `d20`: (Optional) The type of dice to roll if it's not a standard `1d20` (Can be `1d20min10` for a minimum roll of 10 for example, in the case of special features)
- `effects`: (Optional) An `<Array<string>>` array of effect names that are applied to this roll


#### saving-throw
Rolls a saving throw.

Additional fields added to the roll request:
- `name`: The name of the saving throw check being rolled
- `ability`: The abbreviation for the ability being rolled (STR, DEX, CON, INT, WIS, CHA)
- `modifier`: The saving throw modifier
- `proficiency`: (Optional) The type of proficiency the character has (can be `None`, `Proficient` or `Half Proficiency`, or `Expert`)
- `d20`: (Optional) The type of dice to roll if it's not a standard `1d20` (Can be `1d20min10` for a minimum roll of 10 for example, in the case of special features)
- `effects`: (Optional) An `<Array<string>>` array of effect names that are applied to this roll

#### skill
Rolls a skill check.

Additional fields added to the roll request:
- `skill`: The name of the skill check being rolled or the name of the tool being rolled
- `ability`: The abbreviation for the ability being rolled (STR, DEX, CON, INT, WIS, CHA)
- `modifier`: The skill check modifier
- `proficiency`: (Optional) The type of proficiency the character has (can be `None`, `Proficient` or `Half Proficiency`, or `Expert`)
- `d20`: (Optional) The type of dice to roll if it's not a standard `1d20` (Can be `1d20min10` for a minimum roll of 10 for example, in the case of special features)
- `effects`: (Optional) An `<Array<string>>` array of effect names that are applied to this roll

#### trait
Display a character trait, class feature or special action. This can be used to display different kinds of features, no matter the source.
The `roll` field should be set to `0`.

Additional fields added to the roll request:
- `name`: The trait name
- `description`: The description of the trait
- `source`: (Optional) The source of the trait (Background, Class, etc...)
- `source-type`: (Optional) The source type of the trait (Action, Item, Feat, etc...)
- `item-type`: (Optional) The item type from which this trait is derived (Infusion)

#### item
Display information about an item. 
The `roll` field should be set to `0`.

Additional fields added to the roll request:
- `name`: The item name
- `description`: The description of the item
- `item-type`: (Optional) The item type (Weapon, Gear, Staff, Instrument, etc...)
- `item-customizations`: (Optional) Array of string containing the item customizations for this character/item (like 'Pact Weapon')
- `quantity`: (Optional) The quantity of the item that the character has, as an integer `<number>`
- `tags`: (Optional) Array of strings for item specific tags (consumable, heal, utility, instrument, etc..)

#### attack
Roll an attack. This will generally be either rolling a weapon attack or a special action or class feature attack.

Additional fields added to the roll request:
- `name`: The name of the attack
- `description`: The description of the item or attack
- `to-hit`: The To Hit modifier to use for the attack
- `damages`: An `<Array<String>>` array of damage dice/values if the attack hits
- `damage-types`: An `<Array<String>>` array of damage types. The array size **must** match the size of the `damages` array
- `critical-damages`: An `<Array<String>>` array of damage dice/values if the attack is a critical hit
- `critical-damage-types`: An `<Array<String>>` array of critical damage types. The array size **must** match the size of the `critical-damages` array
- `rollAttack`: A `<boolean>` to determine if the to-hit attack roll should be rolled
- `rollDamage`: A `<boolean>` to determine if the damage rolls should be rolled
- `rollCritical`: A `<boolean>` to determine if the damage being rolled should be critical damages (used if `rollAttack: false`)
- `critical-limit`: (Optional) A `<number>` that determines the minimum value to consider the d20 roll as a critical hit. Defaults to 20. (used if `rollAttack: true`)
- `d20`: (Optional) The d20 dice to use for the roll in case of special abilities. Defaults to `1d20` (can be set to `1d20min10` or `1d20ro<=1` for example)
- `attack-source`: The attack source (Can be "item", "action", or "spell")
- `attack-type`: The type of attack (can be "Melee" or "Ranged")
- `reach`: (Optional) The reach distance for melee attacks
- `range`: (Optional) The range distance for ranged attacks
- `save-ability`: (Optional) The saving throw ability in case the attack requires the target to perform a saving throw
- `save-dc`: (Optional) The DC for the target's saving throw.
- `proficient`: (Optional) A `<boolean>` To determine if the character is proficient with this weapon (only for `attack-source: item`)
- `properties`: (Optional) An `<Array<string>>` array of property strings that relate to the weapon being used (For example, "Light", "Finesse", "Two-handed", etc...)
- `mastery`: (Optional) A `<string>` with the name of the mastery that the character has over this weapon
- `effects`: (Optional) An `<Array<string>>` array of effect names that are applied to this roll


An attack roll (same for a [spell-attack](#spell-attack)) will generally have `rollAttack` or `rollDamage` set to `true` to define if we're rolling the to-hit or the damages. Both can also be set together to roll both at once. 
If the attack roll is being made, the `critical-limit` value will determine if the attack succeeded as a critical hit or not. If only damages are rolled, then `rollCritical` will determine if the damage being rolled should be regular or critical damage.

If the attack is a hit and damages are rolled, then the `damages` (and `damage-types`) array is used to roll for damages, if it's a critical hit, then both the `damages` and `critical-damages` arrays should be used. 
The `critical-damages` array should contain only damages that would apply in the case of a critical hit (constant damage should not apply, unless the user is using a homebrew rule for critical calculations, and special abilities that deal extra damage on criticals should be added). 

#### spell-card
Display a spell's description card.
The `roll` field should be set to `0`.

Additional fields added to the roll request:
- `name`: The spell name
- `description`: The spell description
- `level-school`: A string for the spell's level and school ("1st Level Divination", or "Evocation Cantrip" for example)
- `cast-at`: (Optional) If the spell is being cast at a higher level, then this would display the level it is being cast at as a string ("3rd", "4th", etc...)
- `range`: The range of the spell as a string ("Touch", "Self", "60ft.", etc..)            
- `concentration`: A `<boolean>` on whether the spell requires concentration
- `ritual`: A `<boolean>` on whether the spell can be cast as a ritual
- `duration`: The duration of the spell ("Instantaneous", "1 round", "10 minutes", etc..)
- `casting-time`: The time it takes to cast the spell ("1 action", "1 reaction", "10 minutes", etc...)
- `components`: A comma separated string for the components required ("V" or "V, S" or "V, S, M (a crystal worth 50gp)" for example)
- `aoe`: (Optional) The range of the Area of Effect if the spell has an AoE range
- `aoe-shape`: (Optional) The shape of the AoE if the spell is an AoE ("Spehre", "Cube", etc...)

#### spell-attack
Roll a spell attack. 

This combines the additional fields from both the [attack](#attack) and [spell-card](#spell-card) roll types, as it is both a spell and an attack roll.

#### roll-table
Roll from a table

Additional fields added to the roll request:
- `name`: The roll table name
- `formula`: The dice formula to roll
- `table`: The roll table content. This is a `<Object<string:Object>>` where each entry is a column in the table with the key being the column name and the value is itself an `<Object<string:string>>` mapping a roll result to a string result.

Note that the roll results can be a range of values, for example, a d6 roll table of the form:
| 1d6  | Treasure Type |
|------|---------------|
| 1-3  | Coins         |
| 4    | Weapons       |
| 5    | Armor         |
| 6    | Magic Items   |

This would cause the following roll action to be sent:
```js
{
    action: "roll",
    character: {...},
    roll: "1d6",
    advantage: 1,
    whisper: 0,
    name: "Treasure Chest",
    formula: "1d6",
    table: {
        "Treasure Type": {
            "1-3": "Coins",
            "4": "Weapons",
            "5": "Armor",
            "6": "Magic Items"
        }
    }
}
```

#### hit-dice
Roll a Hit Die for the character

Additional fields added to the roll request:
- `class`: The class name for which the hit dice is being rolled
- `multiclass`: A `<boolean>` to indicate whether the character is multiclassed
- `hit-dice`: The Hit Die formula to roll
- `effects`: (Optional) An `<Array<string>>` array of effect names that are applied to this roll

#### death-save
Roll a death saving throw

Additional fields added to the roll request:
- `modifier`: (Optional) The modifier to add to the death saving throw (would apply in case of magic items)
- `effects`: (Optional) An `<Array<string>>` array of effect names that are applied to this roll

#### chat-message
Display a chat message.
The `roll` field should be set to `0`.

Additional fields added to the roll request:
- `name`: The title of the message (usually empty or the source material)
- `message`: The chat message to display as a string.

#### digital-dice
This type is only used as part of the `message.request` field in a `rendered-roll` message. It is used to notify a VTT that the user made a custom roll of digital dice in the D&D Beyond page and reports the result of the roll to the VTT.

Additional fields added to the roll request:
- `name`: The title of the digital dice roll

#### custom
Sent when a custom dice roll is being made. This is usually if you have a formula in a block of text and that custom formula gets rolled.
The `roll` field will contain the formula to roll.

Additional fields added to the roll request:
- `name`: The title for this roll. It's usually the name of the item/feature that had the formula
- `description`: (Optional) A description of the roll
- `modifier`: (Optional) The dice formula to roll

### Beyond20 object formats

Some of the messages above use specific objects definitions that are used in more than one place. Here are the definition of those structures

#### Forwarded message response format
When a message is sent which is meant to be dispatched to all VTTs, the sender will receive a response in the following format:
```js
{
    success,   // <Boolean> A boolean to determine if it was successfully forwarded to at least one VTT
    vtt,       // <Array<String>> An array of strings determining which VTT tabs were found and received the request. `null` in case of error
    error,     // <String> An error explaining the failure to forward the message
    request    // <Object> The original request that was sent
}
```
The `vtt` field is either `null` (in case of error) or an array of strings. The possible string values are: `roll20`, `fvtt`, `custom` and `dndbeyond`.
It is possible to have a `success: false` even without an error. That can happen in the case of user configuration which tells Beyond20 not to send to any VTT. In that case, the `vtt` array will contain `dndbeyond` to instruct the DDB page to render the roll in its own page. 

#### Whisper Type Format
The whisper type is an enum, a `<number>` value which can take the following values:

- `0`: Don't whisper the roll
- `1`: Whisper the roll
- `2`: Query the user for what type of roll to make
- `3`: Don't whisper the roll but hide all revealing information (character name, attack name and description)


#### Roll Type Format
The roll type is an enum, a `<number>` value which can take the following values:

- `0`: Normal roll
- `1`: Roll twice any d20 rolls and display both
- `2`: Query the user for what type of roll to make
- `3`: Roll with advantage (roll twice and keep the highest)
- `4`: Roll with disadvantage (roll twice and keep the lowest)
- `5`: Roll 3 times any d20 rolls and display all 3 results
- `6`: Roll with super advantage (roll 3 times and keep the highest)
- `7`: Roll with super disadvantage (roll 3 times and keep the lowest)

Internally, Beyond20 also uses the following values, though they should never appear in the messaging API as those would get replaced before being sent out:
- `8`: Roll with advantage (override user choice due to a special feat or skill)
- `9`: Roll with disadvantage (override user choice due to a special feat or skill)

#### Beyond20 Character Format
A Character object will represent the character sheet from which the rolls are being made.
It must have the following fields in it:
- `name`: The character name
- `type`: The type of character
- `url`: The URL to that character's sheet
- `avatar`: (Optional) URL to the character's avatar
Additional fields are also added for character and monster types.

The type can be anything, such as a "spell" or a "feat" or an "item", etc... A `spell` character means that the rolls are being made from a D&D Beyond standalone spell page rather than the spell being rolled from a monster or character's sheet.

Though the `type` can be any string to represent the type of sheet sending the roll requests, here are the ones used in Beyond20:
- `spell`: A spell page
- `item`: An item's page
- `source`: A source book
- `feat`: A feat page
- `Character`: A PC character sheet
- `Monster`: A monster's stat block
- `Vehicle`: A vehicle's stat block
- `Creature`: A creature's stat block. A creature is any monster/npc added to a PC's character sheet under the Extra tab
- `Extra-Vehicle`: A vehicle's stat block from a character's Extra tab

##### Character character fields
The following fields are also included in the Character object for a character of type `Character`:
```js
{
    "source",           // <string> The source site of the character sheet (default: "D&D Beyond")
    "id",               // <string> The character sheet ID.
    "abilities",        // <Array<Ability>> Array containing the abilities scores of the character
    "classes",          // <Object<string:string>> An object where each key is a class the character has and the value is the level of that character in that class
    "level",            // <string> The total level of the character
    "race",             // <string> The character's race
    "ac",               // <string> The character's AC
    "proficiency",      // <string> The character's proficiency modifier
    "speed",            // <number> The character's speed
    "hp",               // <number> The character's current HP
    "max-hp",           // <number> The character's maximum HP
    "temp-hp":          // <number> The character's Temp HP
    "exhaustion",       // <number> The exhaustion level of the character
    "conditions",       // <Array<string>> Array of strings containing the conditions the character is suffering from
    "class-features",   // <Array<string>> Array of strings containing the class features of the character
    "racial-traits",    // <Array<string>> Array of strings containing the racial traits of the character
    "feats",            // <Array<string>> Array of strings containing the feats of the character
    "actions",          // <Array<string>> Array of strings containing the actions available to the character
    "spell_modifiers",  // <Object<string:string>> An object where each key is a class the character has and the value is the spell modifier of that character in that class
    "spell_saves",      // <Object<string:string>> An object where each key is a class the character has and the value is the Spell save DC of that character in that class
    "spell_attacks",    // <Object<string:string>> An object where each key is a class the character has and the value is the Spell attack modifer of that character in that class
    "settings",         // <Object> The character's settings
    "discord-target"    // <string> (Optional) The discord target to send the rolls to
}
```


The `saves` field is an object where each key is the saving throw's ability (in its abbreviated form, as it appears in the stat block) and the value is the saving throw's modifier.
The `skills` field is an object where each key is the name of a skill check and the value is its modifier.
The `discord-target` can be used to hold the first 12 character's a discord server's secret ID and is used to force the roll renderer to choose a specific discord target channel for the rolls from this character.
The `settings` field is important as it will contain the character specific settings. While most of the settings will have been consumed in order to build a roll (like whether to include sneak attack damage or other similar feats), it's worth paying attention to the `settings.custom-roll-dice` field setting which will indicate a customer modifier to add to any d20 roll.

See [Ability format](#ability-format) for the format of the ability scores array.

##### Monster character fields
The following fields are also included in the Character object for a character of type `Monster`, `Vehicle`, `Creature` or `Extra-Vehicle`:
```js
{
    "id",               // <string> The monster or vehicle ID. In the case of a creature/extra-vehicle, it will contain the creature's name as the ID is not available
    "cr",               // <string> The monster's Challenge rating
    "ac",               // <string> The monster's AC
    "hp",               // <string|number> The monster's current HP
    "hp-formula",       // <string> The monster's HP Formula
    "max-hp",           // <number> The monster's maximum HP (only applies to extras)
    "temp-hp":          // <number> The monster's Temp HP (only applies to extras)
    "speed",            // <string> The monster's speed
    "abilities",        // <Array<Ability>> Array containing the abilities scores of the monster
    "actions",          // <Array<string>> Array of strings containing the actions available to the monster
    "saves",            // <Object<string:string>> Object of each saving throw modifier from the stat block
    "skills",           // <Object<string:string>> Object of each skill check modifier from the stat block
    "discord-target",   // <string> (Optional) The discord target to send the rolls to
    "creatureType",     // <string> (Optional) if the type is "Creature" then this will specify the creature type (Familiar, Wild Shape, Beast Companion, etc...)
    "settings",         // <Object> (Optional) character specific options (the parent character's in case of Wild Shape creature)
}
```

The `saves` field is an object where each key is the saving throw's ability (in its abbreviated form, as it appears in the stat block) and the value is the saving throw's modifier.
The `skills` field is an object where each key is the name of a skill check and the value is its modifier.
The `discord-target` can be used to hold the first 12 character's a discord server's secret ID and is used to force the roll renderer to choose a specific discord target channel for the rolls from this character.
See [Ability format](#ability-format) for the format of the ability scores array.

#### Ability Format
A character or monster's abilities are represented by an array of 4 values of the form:
`[ability_name, ability_abbreviation, ability_score, ability_modifier]`

For example:
```js
abilities: [
    ['Strength', 'STR', '12', '+1'],
    ['Dexterity', 'DEX', '14', '+2'],
    ['Constitution', 'CON', '16', '+3'],
    ['Intelligence', 'INT', '3', '-4'],
    ['Wisdom', 'WIS', '18', '+4'],
    ['Charisma', 'CHA', '20', '+5']
]
```

#### Roll Format
A Roll object defines the result of a dice formula roll, which may contain zero or more actual dice formulas and multiple operands.

It has the following format:
```js
{
    "formula",          // <string> The dice formula that made the roll
    "parts",            // <Array<DiceRoll|string|number>> An array of each portion of the formula
    "fail-limit",       // <number|null> (Optional) The lower limit under which a dice roll is considered a critical failure (default 1)
    "critical-limit",   // <number|null> (Optional) The higher limit above which a dice roll is considered a critical success (default 20)
    "critical-failure", // <boolean> Whether the roll result was a critical failure
    "critical-success", // <boolean> Whether the roll result was a critical success
    "discarded",        // <boolean> Whether this roll is being discarded
    "type",             // <string> The roll type
    "total"             // <number> The total roll result
}
```

The roll will contain a formula which will cause zero or more dice rolls to occur. Their results will be in the `parts` field and the total of all parts will be in `total`. The `type` of roll can be `to-hit` or `damage` or `saving-throw`, etc... 
In the case of a advantage/disadvantage for example, the entire roll could be discarded and if that's the case, `discarded` will be `true`.

The `parts` field is an array which will contain either a `DiceRoll` object (See [Dice Roll Format](#dice-roll-format) for the format of the dice rolls), a string representing the operator to use, or a number. For example a `1d20 + 3` formula would cause the parts to be `[DiceRoll, '+', 3]`

#### Dice Roll Format
A Dice Roll object defines the result of a dice roll. The difference with the above Roll object, is that this is specifically for dice being rolled and does not include any operands. It can also only have rolls of the same type of dice

It has the following format:
```js
{
    "formula",      // <string> The dice formula
    "amount",       // <number> The number of dice that were rolled
    "faces",        // <number> The number of faces on the dice being rolled
    "total",        // <number> The total result of the roll
    "modifiers",    // <string> (Optional) Any modifiers to the dice formula
    "rolls": [      // <Array<Object>> Array of roll results 
        {
            "roll",         // <number> The result of the roll
            "discarded",    // <boolean> (Optional) Whether this dice roll is discarded
        }
    ]
}
```


#### Damage Roll Info Format
Damage rolls are an array of 3 elements:
- `<string>` The damage type
- `<Roll>` The roll result
- `<number>` The damage flags

See the [Roll](#roll-format) structure above for the format of the Roll result object.
The damage flags will help determine what kind of damage it is. It is a bitfield which can have multiple flags set at once. The available flags are:

- `0`: The damage is a message to the user. In this case, the roll result will be ignore and the damage type contains the message. This is used in cases like "damage leaps to a target within 30 feet" (chaotic bolt). With a damage flag of 0, no other flag must be set
- `1`: Regular damage from the weapon/spell
- `2`: Damage from a versatile weapon used two handed
- `4`: Additonal damage (anything other than the first damage from the weapon/spell)
- `8`: Healing
- `16`: Critical damage


## The DOM API
The DOM API is a way for Beyond20 to communicate with other extensions or websites by sending custom events to the document itself. All events have the `Beyond20_` prefix and will hold the an array in the `detail` field of the `CustomEvent`, which represents the arguments of the event.

On the D&D Beyond website itself, when rolls are made, they are sent both to VTT tabs but also as DOM events to the D&D Beyond website. The messages are in the format of `Beyond20_${request.action}` so you would expect to see `Beyond20_roll`, `Beyond20_rendered-roll`, `Beyond20-hp-update`, etc... with the `detail` field of the `CustomEvent` containing an array with a single element, which would be the request being sent.

On a custom website and on DnD Beyond itself, you receive instead the following events:
- `Beyond20_Loaded(settings)`: This event is sent when Beyond20 is loaded onto the website. It is a good way for a website to know if Beyond20 is enabled and loaded into it
- `Beyond20_NewSettings(settings)`: This event is sent shortly after the `Beyond20_Loaded` event and is sent whenever Beyond20 global settings are updated.

On a custom website, you receive the following events:
- `Beyond20_RenderedRoll(request)`: This event is sent with a `rendered-roll` request in it. If a `roll` message is received, the roll will first be pre-rendered (with `rendered: "fallback"` field set) and will be sent to the DOM as a `Beyond20_RenderedRoll` event too.
- `Beyond20_UpdateHP(request)`: This event is sent with a `hp-update` request in it.
- `Beyond20_UpdateConditions(request)`: This event is sent with a `conditions-update` request in it.
- `Beyond20_UpdateCombat(request)`: This event is sent with a `update-combat` request in it.

A custom website that wants to act as a character sheet can also send custom events to Beyond20 through its DOM in order to have the roll requests transmitted to other running VTTs.

- `Beyond20_SendMessage(request)`: This event will send a message to Beyond20 for redistribution.

Note that the `Beyond20_SendMessage` DOM event API expects to receive a `request` object in the `detail` field (as a single element array).
The request must follow the format of the [Messaging API](#message-api) defined above, and only the following `action` values will be accepted and forwarded: `roll`, `rendered-roll`, `hp-update`, `conditions-update` and `update-combat`.

### Listening to custom events
Here is a simple helper function you can use to listen to custom Beyond20 events on a website's DOM:

```js
function addBeyond20EventListener(name, callback) {
    const event = ["Beyond20_" + name, (evt) => {
        const detail = evt.detail || [];
        callback(...detail)
    }, false];
    document.addEventListener(...event);
    return event;
}
```

It can then be called like this (note that the `Beyond20_` prefix is not used in the name).
```js
addBeyond20EventListener("Loaded", (settings) => console.log("Beyond20 is loaded on the site"));
addBeyond20EventListener("RenderedRoll", (request) => displayBeyond20Roll(request));
```
The return value can be stored to be later used with a `document.removeEventListener`.

### Sending custom events
You can send a custom event to Beyond20 with the simple following code:
```js
function sendBeyond20Event(name, ...args) {
    const event = new CustomEvent("Beyond20_" + name, { "detail": args });
    document.dispatchEvent(event);
}
```

Note that if you are trying to send that DOM event from a privileged scope (i.e: from a different extension), you may need to use the `cloneInto` function to clone the arguments data into the window's scope. This restriction only applies to FireFox which has a more restrictive security context for browser extensions.

In that case, use the following:
```js
function sendBeyond20Event(name, ...args) {
    // You would need a function isFirefox to check if the extension is running in Firefox
    const detail = isFirefox() ? cloneInto(args, window) : args;
    const event = new CustomEvent("Beyond20_" + name, { "detail": detail });
    document.dispatchEvent(event);
}
```

## Integrating with Beyond20

To integrate your website or extension with Beyond20, it should now be fairly easy. Here are the steps to take:
- Add an event listener on the DOM for Beyond20's `Loaded` event
- If Beyond20 is loaded on the site, add support for integrating with it (adding Roll buttons to send requests to B20, listening to roll events from B20)
- If your site is a VTT, when receiving a roll event, display the rendered html roll, or display the roll using the data in the request
- If your site is a character sheet, send a roll event when the user clicks on the roll button

Use the documentation above to find the available events you can send, and what fields they contain.

The user will need to add your site's domain to Beyond20's custom domain list under the advanced options, or you can [contact us](https://github.com/kakaroto/Beyond20/issues/new) to add your site to the list of known sites which support Beyond20.

### Example
Using a simple website with source book content as an example, we can implement a small extension that integrates the read-aloud text with Beyond20 with the following code:

```js
// Copied from the documentation above
function addBeyond20EventListener(name, callback) {
    const event = ["Beyond20_" + name, (evt) => {
        const detail = evt.detail || [];
        callback(...detail)
    }, false];
    document.addEventListener(...event);
    return event;
}
// Copied from the documentation above
function sendBeyond20Event(name, ...args) {
    const event = new CustomEvent("Beyond20_" + name, { "detail": args });
    document.dispatchEvent(event);
}

// Beyond20 extension is loaded and listening for events on this site
function loaded() {
    console.log("Beyond20 is loaded on the site. Adding B20 roll icon...");
    // Find the read aloud text divs in the page
    const readAloud = document.querySelectorAll(".read-aloud");
    for (const div of readAloud) {
        const chapter = div.closest("h1,h2,h3,h4,h5,h6").textContent;
        const message = div.querySelector(".content").textContent;
        // Add a roll button icon to the div
        const icon = document.createElement("i");
        icon.style = "float: right; cursor: pointer;";
        icon.classList.add("fas", "fa-dice-d20");
        icon.title = "Send to VTT";
        div.prepend(icon);
        // On click, send a SendMessage DOM event with a roll action of type chat-message
        icon.addEventListener("click", () => {
            const request = {
                action: "roll",
                type: "chat-message",
                character: {
                    name: document.title,
                    source: "My Custom Site",
                    type: "Book",
                    url: window.location.href
                },
                roll: 0,
                advantage: 0,
                whisper: 0,
                // chat-message specific fields
                name: chapter,
                message: message
            }
            sendBeyond20Event("SendMessage", request);
        });
    }
}

// Listen to the Loaded event from Beyond20
addBeyond20EventListener("Loaded", () => loaded());
```

For more complex rolls, see the messaging API documentation above for the other types of available actions or roll types. You can also make rolls in D&D Beyond to get good examples of what Beyond20 itself sends when rolls are made.