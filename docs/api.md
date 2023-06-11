# Beyond20's API

Beyond20 has an internal API that it uses to communicate events between D&D Beyond and the VTT sites.
This page will describe that API so it can be better understood by fellow developers wanting to make use of Beyond20. 
There are 3 types of APIs that Beyond20 includes.
- Its own internal classes, functions and methods which allows it to do its thing. This API is not documented here as it is internal to the Beyond20 components
- The Messaging API which defines which message requests can be sent between websites and their data format
- The DOM API which defines the DOM custom events that can be sent from and to Beyond20 with websites in order to communicate

## Architecture
The architecture of the Beyond20 extension is relatively simple, in that the extension loads scripts into the Character Sheet pages as well as the VTT pages. Beyond20 also has a background script that runs permanently and is the glue between the Sheet and VTT pages, allowing them to communicate with each other.
A Sheet page can be anything, from a D&D Beyond Character Sheet, to a Spell description page, or a NPC page, or even the Encounter combat tracker. Those are all considered "character sheets" with a very loose definition of what a "character" is. With the recent addition of support for custom domains, a character sheet could also be any non D&D Beyond site.
Similarly, a VTT tab can be any site able to receive a roll request and process it. 

## Message API
Beyond20 uses the browser extension's `sendMessage` API in order to communicate between one tab and another. Some of these messages are only going as far as the Beyond20 background process, while others will get forwarded to any other websites that Beyond20 supports.

Every message sent this way will have a field `action` which determines what the message represents, and additional fields that are specific to the action.

In the documentation below, any reference to a 'tab' will mean a browser tab and will therefor represent any website page(whether from D&D Beyond or a VTT or even the browser popup dialog when clicking the Beyond20 icon in the address bar)

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


#### ability
Rolls an ability check

Additional fields added to the roll request:
- `name`: The name of the ability check being rolled
- `ability`: The abbreviation for the ability being rolled (STR, DEX, CON, INT, WIS, CHA)
- `modifier`: The ability modifier
- `ability-score`: (Optional) The score value of the ability being rolled
- `d20`: (Optional) The type of dice to roll if it's not a standard `1d20` (Can be `1d20min10` for a minimum roll of 10 for example, in the case of special features)


#### saving-throw
Rolls a saving throw.

Additional fields added to the roll request:
- `name`: The name of the saving throw check being rolled
- `ability`: The abbreviation for the ability being rolled (STR, DEX, CON, INT, WIS, CHA)
- `modifier`: The saving throw modifier
- `proficiency`: (Optional) The type of proficiency the character has (can be `None`, `Proficient` or `Half Proficiency`, or `Expert`)
- `d20`: (Optional) The type of dice to roll if it's not a standard `1d20` (Can be `1d20min10` for a minimum roll of 10 for example, in the case of special features)

#### skill
Rolls a skill check.

Additional fields added to the roll request:
- `skill`: The name of the skill check being rolled or the name of the tool being rolled
- `ability`: The abbreviation for the ability being rolled (STR, DEX, CON, INT, WIS, CHA)
- `modifier`: The skill check modifier
- `proficiency`: (Optional) The type of proficiency the character has (can be `None`, `Proficient` or `Half Proficiency`, or `Expert`)
- `d20`: (Optional) The type of dice to roll if it's not a standard `1d20` (Can be `1d20min10` for a minimum roll of 10 for example, in the case of special features)

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

#### death-save
Roll a death saving throw

Additional fields added to the roll request:
- `modifier`: (Optional) The modifier to add to the death saving throw (would apply in case of magic items)

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

#### Beyond20 Character Format
> TODO: Describe the following structure
#### Whisper Type Format
> TODO: Describe the following structure
#### Roll Type Format
> TODO: Describe the following structure
#### Roll Format
> TODO: Describe the following structure
### Damage Roll Info Format
> TODO: Describe the following structure
