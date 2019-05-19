# Feature list

## Rolls
* Ability checks
* Saving throws
* Skill checks
  * Custom skills (if no ability is specified, a macro will ask the player in Roll2)
* Initiative rolls
  * Rolls with Advantage if the character has the feat
  * Adds the initiative to the tracker
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
  * The dice formula is clickable in the D&D beyond side panel, as well as in the Roll20 chat text
  * The clickable dice can be disabled to not show in the D&D Beyond page or in the Roll20 text, separately
* Character creatures and Monster pages also have clickable dice formulas


## Information sharing
* Spell cards can be displayed in Roll20
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


## Configurable options
* Whisper rolls
* Roll twice for advantage/disadvantage
* Add initiative to the tracker (requires token to be selected)
* Replace dice formulas in Roll20 text
* Add dice formulas roller icon to D&D Beyond text
* Prefix to add to critical hit damage
* Roll20 Character Sheet Template to use
* Roll20 tab specific options
  * Select a tab to send all rolls to
  * Select the campaign to send the rolls to
  * Send rolls to all Roll20 tabs
* D&D Beyond character specific options
  * Automatically update HP in the Roll20 sheets and tokens
  * Send sneak attack damage (Rogues only)
  * Send Disciple of Life healing bonus (Cleric only)
  * Add Jack of all Trades bonus to raw ability checks (Bard only >= 2nd level)

## Roll20 Character Sheet Templates
* D&D 5e By Roll20
  * This is the official character sheet template and the one recommended
* Fallback option for all other templates


## Misc
* Chrome support
* Firefox support
* Friendly developer

# TODO

These are items that are not yet supported but which I plan on adding support for at some point in the future.

* Rolling from monster stat pages
* Add support for skills/items that have advantage/disadvantage notes (like disadvantage on stealth for heavy armor users)
* Add support for more unique features (similar to Sneak Attack/Disciple of Life)
* Add a way to show errors (such as "can't find an open roll20 tab")
* Add support for more character sheet templates in roll20.
* Add a dice roller so it can also be used to roll directly without roll20, if wanted.
* Add support for special cases, like Toll the Dead, Elemental Bane, etc..
* Check entire list of spells and feature to find special cases to support



