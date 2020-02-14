v0.9
===

* **Feature**: Add indicator on roll buttons to identify the roll type (advantage, disadvantage, roll twice, etc...)
* **Feature**: Add synchronization of Temporary HP to tokens and character sheets in Roll20 and FVTT
* **Feature**: Add support for HP and Temp HP synchornization for character sheet creatures from the Extra section
* **Feature**: Add a "Display to VTT" button on Equipment and Magic Items pages of D&D Beyond
* **Feature**: Support rolling with Advantage when clicking with the Shift button pressed
* **Feature**: Support rolling with Disadvantage when clicking with the Ctrl button pressed
* **Feature**: Support rolling normally (with no advantage/disadvantage/double rolls) when clicking with the Alt button pressed
* **Feature**: *Firefox*: Add buttons to access Quick Settings menu from Firefox (added for Chrome in v0.7 but finally got it working for Firefox)
* **Feature**: Add option to force an auto-crit on all attacks (against paralyzed enemies for example)
* **Feature**: Add the ability to roll multiple separate custom damage dice, by separating them with a comma (for use with Green-flame Blade for example)
* **Feature**: Add support for spells that add Temp HP instead of healing (such as False Life)
* **Feature**: Add support for Polearm Master Feat, which considers the bonus action as melee
* **Feature**: Add support for Fighter's UA Rune Knight's Giant Might class feature
* **Feature**: Add support for Artificer's Arcane Firearm class feature
* **Feature**: Add support for Draconic Sorcerer's Elemental Affinity class feature
* **Feature**: Add support for rolling the Bardic Inspiration dice, and Blade Flourishes for the College of Swords
* **Feature**: Add support for Cleri's Divine Strike class feature
* **Feature**: Add support for Whispers Bard's Psychic Blades class feature
* **Feature**: Add Attack buttons to roll the to-hit with damage on the various object sizes in the Animate Objects spell description
* **Bugfix**: Fix custom/concentration/ritual Spells and custom weapons which to-hit value was not being parsed properly due to a DNDB website change
* **Bugfix**: Fix quick roll tooltip from being at the wrong position when the page was not scrolled to the top
* **Bugfix**: Fix character settings not being saved properly. Caused double output of conditions on Firefox
* **Bugfix**: Support parsing of monster statblocks from the new My Encounters popup window for monsters
* **Bugfix**: More lax statblock parsing, which fixes the actions from monster 'Orcus' not being parsed properly
* **Bugfix**: Reroll all the dice in a critical hit if a custom dice formula had additive dice formulas
* **Bugfix**: Fix "Display to VTT" button position for Spell pages
* **Bugfix**: *Roll20*: Use /me instead of /emas for condition mapping if user is not a GM as /emas is a GM-exclusive command
* **Bugfix**: *FVTT*: Fix HP syncing for actors when the scene doesn't have a token of the character sheet on it
* **Misc**: Make the Quick Rolls tooltip move with the mouse, as some people were confused by its position, not understanding it was a tooltip
* **Misc**: Make the D&D Beyond Dice roller animation less flashy and quicker to appear
* **Misc**: Added the 'sponsor' button on the github page, and registered for the Github Sponsors program


v0.8
===

* **Feature**: Add Quick Rolls feature to quickly roll skills, attacks, spells from the main page directly
* **Feature**: Add support for Super Advantage and Super Disadvantage rolls
* **Feature**: Track Character Condition changes and display them in the VTT
* **Feature**: Add roll type option of always rolling three twice instead of twice (For Elven Accuracy Feat; limited support on Roll20)
* **Feature**: Cache the To-Hit value of weapons attacks so they can be rolled from the Equipment page
* **Feature**: Add support for the Paladin's Improved Divine Smite extra radiant damage
* **Feature**: Add support for special spell: Absorb Elements (Doesn't duplicate all the damage types)
* **Feature**: Add support for special spell: Life Transference (Shows healing amount on FVTT, clarifies the value on Roll20)
* **Feature**: Add support for special spell: Toll the Dead (Queries if the target is missing hit points)
* **Feature**: *Roll20*: When rolling initiative with 'add to tracker' enabled and 'roll twice' (or thrice), queries the user for advantage mode
* **Feature**: *FVTT*: Map Character Conditions to status effects (Requires Beyond20 FVTT module version 0.7+)
* **Bugfix**: *Roll20*: Fix the 'incognito' whisper mode where the monster name was leaked with the 'Speaking As' feature
* **Bugfix**: Fix inability to roll when opening the character sheet for the first time with a mobile or tablet layout
* **Bugfix**: Fix duplication of the "Roll initiative" lines in stat blocks when switching monsters in the My Encounters page
* **Bugfix**: Fix the spell name for concentration or ritual spells since the recent change to D&D Beyond content
* **Bugfix**: Fix Great Weapong Fighting dice reroll being mistakenly applied on some two-handed non-melee weapons
* **Bugfix**: Fix the spell level/school display missing spaces introduced in the recent code refactor of v0.7
* **Bugfix**: Fix character action list not being properly cached which may lead to loss of character options on mobile
* **Bugfix**: Fix parsing of stat block attacks for Clay Gladiator and Scout which had typos in the official D&D Beyond pages
* **Bugfix**: Fix Spell Attack roll which show displayed the modifier instead of rolling the 1d20
* **Bugfix**: *FVTT*: Fix dice roll formulas in descriptions not being clickable in FVTT 0.4.x
* **Bugfix**: *Dice Roller*: Fix display bug on rolls after opening the quick settings dialog
* **Bugfix**: Fix full settings window opening donate link inside the iframe instead of a new tab

v0.7
===

* **Feature**: Add a Dice Roller within D&D Beyond for players not using Roll20 or FVTT
* **Feature**: Add option for alternate critical damage calculations based on common homebrew rules
* **Feature**: Add an 'incognito' monster whisper mode where rolls are displayed but monster name and action names are hidden
* **Feature**: Add a 'Roll Initiative' button to monster/vehicle stat blocks (rolls dexterity but allows adding to tracker)
* **Feature**: Add a "Roll Twice" option when querying the user for advantage.
* **Feature**: *Chrome*: Add a Beyond 20 button to D&D Beyond and VTT pages for easy access to quick settings
* **Feature**: Open the 'More Options' link as dialogs within the page instead of opening the browser's extension page
* **Feature**: Add support for Bloodhunter's Crimson Rite feature
* **Feature**: Add support for Ranger's Dread Ambusher feature
* **Feature**: Add support for Paladin's Legendary Strike (UA) feature
* **Feature**: Add support for Warlock's Hexblade's Curse feature
* **Feature**: Add support for Rogue's Assassinate feature
* **Feature**: *FVTT & Dice Roller*: Standardize appearance of chat messages when using simple rolls
* **Feature**: *FVTT & Dice Roller*: When rolling with advantage/disadvantage, display both rolls instead of only the result
* **Bugfix**: *Roll20*: Fix Brutal Critical/Savage Attacks brutal damage not being rolled on some critical rolls
* **Bugfix**: *Roll20*: It seems Beyond 20 now works in Roll20's popped out chat window
* **Bugfix**: *FVTT*: Show the world's title instead of its name in the browser's tab title
* **Bugfix**: *FVTT*: Critical hits of 18 or 19 (due to Improved or Superior Critical features) now appear green as expected
* **Bugfix**: Make parser for monster actions in stat blocks less rigid so it can find action names in some homebrew monsters
* **Bugfix**: Fix item/feature or spell descriptions not being properly displayed when they contain lists
* **Misc**: Use non-intrusive notification when opening a character sheet and no VTT window is found
* **Misc**: Add monster specific options to a monster page's quick settings menu
* **Misc**: Fix typos of "Save Attacks" instead of "Savage Attacks"
* **Misc**: Using the new in-page quick settings dialog, setting a custom dice formula and dismissing the dialog will now accept the change
* **Misc**: Updated donate link to redirect to beyond20.here-for-more.info/rations instead of paypal.me/kakaroto
* **Misc**: *FVTT*: Major refactor of how message rendering is done internally to allow for the dice roller to work

v0.6
===

* **Feature**: Roll Spells from Monster stat blocks without opening the spell in a separate window
* **Feature**: Add roll buttons on non-weapon actions of monster stat blocks (Legendary actions or a Dragon's Fearful Presence/Breath attack for example)
* **Feature**: Add support for Vehicle/Ship weapons
* **Feature**: Add support for Infernal machines from *Baldur's Gate: Descent to Avernus*
* **Feature**: Add escape DC parsing in monster stat blocks (when grappling).
* **Feature**: Alert when trying to roll while no VTT window is found or configured to receive the rolls
* **Feature**: Add a "Display in VTT" button for rollable actions
* **Feature**: Add support for rerolling 1 and 2 damage dice for Great Weapon Fighting
* **Feature**: *FVTT*: Play dice sound when rolling dice
* **Feature**: *FVTT*: Make all rolls as out-of-character messages so they appear with the colored border of the character (v0.3.7+)
* **Bugfix**: Fix damage detection in monster stat block where for example a "DC 13 saving throw or take half damage" could be mistaken for 13 damage of type "saving throw or take half"
* **Bugfix**: *FVTT*: Update initiative in combat if rolled more than once
* **Bugfix**: *FVTT*: Do the proper damage calculations when using the 'Apply Damage' context option on chat messages
* **Bugfix**: *FVTT*: Re-calculate total damages when rolling damage multiple times with the 'Roll Damages' button (Auto-roll disabled)
* **Bugfix**: *FVTT*: Do not re-roll damages the first time we click on 'Roll Damages' (gives proper dice values and damage types for Chaos Bolt for example)

v0.5
===

- **Feature**: Roll the appropriate die when clicking on a Superiority Die or Maneuvers feature instead of displaying its description
- **Feature**: Query for skill and proficiency when rolling a tool from the equipment
- **Feature**: Improve support for casting Chaos Bolt spell.
- **Feature**: *FVTT*: Add custom support for Chromatic Orb and Chaos Bolt spells.
- **Bugfix**: Fix rolling from spell pages not working anymore
- **Bugfix**: Roll damages even without a "To-Hit" for Custom Actions
- **Bugfix**: *FVTT*: Clicking 'Roll Damages' when auto-roll damage is disabled will now re-roll the damage dice.
- **Misc**: Decrease Chrome extension permissions and require manual activation for FVTT installations (See [Release Notes](release_notes#v05) for more information)
- **Misc**: Replace all remaining occurences of "Roll20" with "VTT"

v0.4
===

- **Feature**: Add option to decide if character is using one-handed or two-handed versatile weapons
- **Feature**: *FVTT*: query for advantage and custom skills.
- **Feature**: *FVTT*: Replace dice in description text.
- **Feature**: *FVTT*: Add support for the auto-roll damage option
- **Feature**: *FVTT*: Nicer display output for rolls
- **Feature**: Add "Roll20 Template" option in the Roll20 popup menu
- **Bugfix**: Fix non-visible messages on Roll20 when using other tempaltes even if template is set to 'Other templates'
- **Bugfix**: No need to roll critical damages for spells that have no 'to-hit'. Fixes 3d Dice rolls doubled on healing spells.
- **Bugfix**: Fix spell attack dice disappearing
- **Misc**: Remove the green/red on death saving throws above/below 10 as it was apparently confusing to players (might re-add as an option).

v0.3
===

- **Feature**: Support for sending the rolls to [Foundry Virtual TableTop](http://foundryvtt.com) (FVTT) as an alternative to Roll20
- **Feature**: The Whisper rolls Yes/No option has now become a Yes/No/Query where it can now prompt the user on every roll
- **Feature**: The Roll Advantage Yes/No Option has now become a Normal/Double/Query/Advantage/Disadvantage option
- **Feature**: Add support for Melee/Ranged Spell attack actions for monster stat blocks.
- **Feature**: Parse "+ your <class> level" or "+ your <ability> bonus" to the dice formula parsing algorithm.
- **Feature**: Support the new "My Encounters" website format since the recent D&D Beyond update.
- **Bugfix**: *Roll20*: Fix HP syncing when it didn't always update the HP in the character sheet itself.
- **Bugfix**: Make attack buttons in monster stat blocks styled correctly after D&D Beyond removed the CSS for it
- **Bugfix**: Fix action descriptions having extra spaces in a monster stat block
- **Bugfix**: Fix damage for actions (like Unarmed attacks) when a custom dice is set.
- **Bugfix**: More relaxed monster action parsing algorithm to work better with homebrewed monsters.

v0.2
===

- **Feature:** Add per character custom roll and damage dice formulas
- **Feature:** Add option to disable auto-roll damage and crit dice
- **Feature:** Add support for the Fighter's Improved Critical and Superior Critical features
- **Feature:** Add support for the Barbarian's Brutal Critical and Half-Orc's Savage Attacks features
- **Feature:** Add support for Barbarian Rage (damage and advantage on STR rolls)
- **Feature:** Add special support for Chromatic Orb spell to ask for the damage type to use
- **Feature:** Add support for rolling abilities on Vehicles
- **Bugfix:** Fix Jack of All Trades being broken in v0.1
- **Bugfix:** Fix clicking the Display button executing the roll too
- **Bugfix:** Fix dice replacement in monster pages if the feature/action name has a "+X" in it
- **Bugfix:** Fix encounter page not being handled if navigated to from the my-encounters page directly
- **Bugfix:** Disable options until settings are loaded to avoid changing an option then getting it overwritten
- **Misc:** Per user request, updated Donate link to one that allows paying with credit cards
- **Misc:** HP syncing is now a global setting instead of a per-character setting
- **Misc:** Clean up of quick settings window to make room for more per-character options


v0.1
===

- **Feature:** Full support for Monster stat blocks and character Creatures (roll for Abilities, Saves, Skills and Weapon attacks)
- **Feature:** Add support for rolling monsters from the My Encounters page
- **Feature:** Add support for rolling dice and display spell cards from Spell pages
- **Feature:** Add Class/Racial Features parsing and new options for using Sharpshooter and Great Weapon Master Feats
- **Feature:** Add option to choose what components to display during a spell attack
- **Misc:** Major improvement to the way rolls are displayed when clicked from descriptions in the Roll20 chat
- **Misc:** Only allow Disciple of Life option if the Cleric is of the Life domain
- **Misc:** Change the way Sneak attack bonus is sent so it also gets doubled if Crit

v0.0.9
===

- **Feature:** Add preliminary Monster and Creatures support (only dice formulas are clickable for now)
- **Bugfix:** Fix Firefox support which got completely broken in 0.0.8
- **Bugfix:** Correctly fix the HP syncing feature and add support for HP=0.
- **Bugfix:** Fix wrong damage value in with weapons that have multiple types of damages
- **Bugfix:** Fix critical damage rolls for multi-damage attacks

v0.0.8.1 (Firefox-only)
===

- **Bugfix:** Fix bug where HP management only works if VTT ES extension is installed

v0.0.8
===
- **Feature:** Add support for HP management (Requires VTT ES extension installed, for now)
- **Feature:** Add ability to select which Roll20 page to send the rolls to
- **Feature:** Add per-character settings to roll Sneak Attack, Disciple of Life, Jack of all Trades
- **Feature:** Add roll dice icon to spell attack modifier
- **Misc:** Brand new website!

v0.0.7
===

- **Feature:** Add support for Firefox
- **Feature:** Add a "Display in Roll20" button for weapons and attack spells
- **Feature:** Add support for custom skills
- **Bugfix:** Don't roll the second dice in 3D dice roller if not rolling with advantage
- **Bugfix:** Fix damage output with multiple additional damages in custom weapons
- **Bugfix:** Fix GreenFlame Blade damage output when level < 5

v0.0.6
===

- **Feature:** Add option to send initiative to the turn tracker
- **Feature:** Add support for Firefox and fix firefox specific issues
- **Bugfix:** Fix 1d20 added to spell description for +x modifiers
- **Misc:** Change the "First/Second Roll" for other templates into a better name

v0.0.5
===

- **Bugfix:** Fix issue with settings getting reset if we modify an option in the toolbar popup
- **Misc:** Change tag names for default template rolls to make them more readable

v0.0.4
===

- **Feature:** Add support for other roll20 character sheet templates
- **Bugfix:** Fix custom dice formulas gettings messed up if we change spell level casting

v0.0.3
===

- **Feature:** Add option to disable substitution of dice formulas
- **Feature:** Add option for critical hit prefix
- **Bugfix**: Fix dice formula detection

v0.0.2
===

- **Feature:** Add a settings window and a popup menu to quickly change settings
- **Feature:** Add option to not always roll with advantage
- **Feature:** Inject into shared D&D Beyond character sheet, not just our own creations
- **Feature:** Switch to page actions (toolbar icon highlighted only on dndbeyond and roll20 pages)
- **Bugfix:** Fix double roll of equipment items when clicking on the beyond20 button in the top-right


v0.0.1
===
- Initial release with support for all types of roles
