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
