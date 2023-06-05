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
Returns a response of the format of a Beyond20 Character (see the `roll` message below for the format of a Character object)


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
    character // <Character> The Character object describing the character
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
    character // <Character> The Character object describing the character
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
- `trait`: Display a character trait
- `action`: Display a character action
- `feature`: Display a character feature
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

> TODO: Fill out details on the various types

#### digital-dice
This type is only used as part of the `message.request` field in a `rendered-roll` message. It is used to notify a VTT that the user made a custom roll of digital dice in the D&D Beyond page and reports the result of the roll to the VTT.

> TODO: Fill out details on the various types
```
        const request = {
            action: "roll",
            character: character.getDict(),
            type: "digital-dice",
            roll: digitalRoll.rolls[0].formula,
            advantage: RollType.NORMAL,
            whisper: whisper,
            sendMessage: true,
            name: digitalRoll.name
        }
```

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
