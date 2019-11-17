# Virtual Tabletops supported
* [Roll 20](https://roll20.net)
* [Foundry VTT](http://foundryvtt.com)

# Feature list

See the [Screenshots](screenshots) page for a video tour of all the features listed here.

## Character Sheet
* Ability checks
* Saving throws
* Skill checks
  * Custom skills (if no ability is specified, a macro will ask the player in the VTT)
* Initiative rolls
  * Rolls with Advantage if the character has the feat
  * Adds the initiative to the tracker
* Support for custom roll and damage dice bonuses
* Mellee weapon attacks
* Ranged weapon attacks
  * Support for Two-handed damage
  * Support for weapons dealing more than one type of damage
  * Support for custom weapons
  * Support for critical damage
* Attack spells
  * Support for multiple damages
  * Support spells with saving throw or To-Hit, or with straight damage
  * Can display the spell instead of rolling it if wanted
* Hit dice
  * Supports multi-classing
* Death saving throws
* `+ X` modifier in descriptions (Will roll a `1d20 + X`)
* The attack spell modifiers can be clicked to roll the dice if needed
* Dice formulas in descriptions can be clicked to roll the dice
  * Dice formulas are detected in items, spells, actions or custom actions, class features, racial traits or Feats
  * The dice formula is clickable in the D&D beyond side panel, as well as in the VTT chat text
  * The clickable dice can be disabled to not show in the D&D Beyond page or in the VTT text, separately
* Creatures stat blocks
* Vehicles stat blocks
* Tools

## Monsters and Character creatures
* Hit points
* Ability checks
* Saving throws
* Skills
* Dice formulas in features/action descriptions
* Ranged and Melee weapon attacks
* Display spells from tooltip information
* Monsters from the My Encounters page directly supported

## Vehicles
* Ability checks

## Spell Compendium Pages
* Dice formulas from description
* Display button to display the spell card

## Information sharing
* Spell cards can be displayed in VTT
  * Higher level casts will be detected and shown
* Attack spells can also be displayed instead of rolled
* Attack spells with material components will have the material printed
* Equipment Items
* Weapons can also be displayed instead of rolled
* Actions and custom actions
* Class feature
* Racial traits
* Feats
* Character traits

## Special Class Features/Racial Traits/Feats supported
* Rogue: Sneak Attack
* Life domain Cleric: Disciple of Life
* Champion Fighter: Improved Critical and Superior Critical
* Bard: Jack of All Trades
* Barbarian: Rage
* Barbarian: Brutal Critical
* Half-Orc: Savage Attacks
* Feat: Sharpshooter
* Feat: Great Weapon Master
* Fighting Style: Great Weapon Fighting

# Special Spells supported
* Chromatic Orb: Macro to ask which damage type to use
* Chaos Bolt: Damage type set to 'chaotic energy' instead of rolling for each damage (Roll20) or query damage type depending on roll result.

## Configurable options
* Whisper rolls (yes, no, query the user)
* Whisper rolls for monster pages
* Roll types (normal, roll twice, query the user, roll with advantage, roll with disadvantage)
* Auto roll damage and crit
* Add initiative to the tracker (requires token to be selected)
* Automatically update HP in the VTT sheets and tokens
* Roll20 Character Sheet Template to use
  * D&D 5E By Roll20
  * Other Templates
* Replace dice formulas in VTT text
* Add dice formulas roller icon to D&D Beyond spell page and character sheet
* Add dice formulas roller icon to D&D Beyond stat blocks
* Add roll buttons to monster, creature and vehicle stat blocks
* Prefix to add to critical hit damage
* Components to display during a spell attack
  * All components (V, S, M)
  * Only material components if needed
  * No components
* Prefix to display with spell components during an attack
* VTT tab specific options
  * Select a tab to send all rolls to
  * Select the campaign (Roll2) or world (FVTT) to send the rolls to
  * Send rolls to All tabs, Only Roll20 Tabs, Only FVTT Tabs
* D&D Beyond character specific options
  * Custom roll dice formula bonus
  * Custom damage dice formula bonus
  * Versatile weapon choice (one-handed, two-handed, roll both options)
  * Send sneak attack damage (Only Rogues)
  * Send Disciple of Life healing bonus (Only Life domain Cleric)
  * Add Jack of all Trades bonus to raw ability checks (Only Bards >= 2nd level)
  * Apply Sharpshooter Feat for the next roll (Only if Feat is available)
  * Apply Great Weapon Master Feat for the next roll (Only if Feat is available)
  * Add Brutal Critical and Savage Attacks damage to critical hits (Only Barbarians with the feature, or Half-Orcs)
  * Add Rage damage and advantage on STR checks (Only Barbarians)

## Roll20 Character Sheet Templates
* D&D 5e By Roll20
  * This is the official character sheet template I use and develop for and the one I recommend
* Fallback option for all other templates


## Misc
* Chrome support
* Firefox support
* Friendly developer :)

# TODO

These are items that are not yet supported but which I plan on adding support for at some point in the future.

{% include_relative TODO.md %}