## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v2.4.0

I hope you like the new features, and hopefully the killer feature you were waiting for was just added.

If you enjoy using Beyond20 and find it useful for your games, please considerg [showing your appreciation](rations) by offering me some rations or your patronage.

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

{% include_relative known_issues.md %}

# Release Notes

v2.4.0
===

Another Beyond20 update is ready for you!
This update has been long overdue, and I can't believe that the last update was in December already. Thankfully, it seemed like Beyond20 has been particularly stable in recent months, and other than the Game Log feature, which I'm still investigating how to properly address, things have been rather smooth with only a few hotkeys related bugs.

This update fixes most of the issues with the hotkeys feature from last update, but also adds support for handling a bunch of special class features, bringing the coverage even higher in 2.4.0. The support for these special class features and spells is brought to you by `@Aeristoka`, who is, as always, on top of things! We've also got some cool new features, relating to the hotkeys handling, which has been a popular feature since its release in 2.3.0. 

One of the big changes that I've done has been to add support for doing native rolls in Foundry, which would allow the Beyond20 rolls to integrate with other Foundry VTT modules for example. This work is still unfinished unfortunately, but some of the required changes for it to function are coming as part of this release. The native rolls support will be released soon(-ish) as part of the Beyond20 Companion Module, and would not require an update to the browser extension itself.

A recent change in Roll20 has also caused Beyond20 to break a couple of days ago, where the roll templates being used had reverted back to the default template. Thankfully, this was an easy fix and is part of this release as well.

I'd like to give a special thank you to `@Aeristoka` who has been holding down the fort and doing a lot of work in recent months to keeping Beyond20 updated with new class features support, UA changes as well as general tech support, bug triaging and bugfixing.

A big thank you as usual to all my [Patrons](https://patreon.com/kakaroto) as well as those who sent their support via [ko-fi or github](/rations), and for all the love we receive from this community. And thank you for the contributors who helped make this release possible: `@Aeristoka`, `@adriangaro`, `@Stoneguard001` and `@IvanGirderboot`.

Again, shameless plug: If you're interested in trying out [Foundry VTT](https://foundryvtt.com), give it a try at [The Forge](https://forge-vtt.com/?referral=beyond20) which allows you to explore Foundry fully with a temporary license. Just sign up and and click the "[Try Foundry Now](https://www.youtube.com/watch?v=XJUIDvaqPcg)" button to get your game setup instantly, and feel free to try it as many times as you need until you fall in love with it, like the rest of us.

We've also recently launched a marketplace on the [Bazaar](https://forge-vtt.com/bazaar/?referral=beyond20) where you can find some amazing modules, maps, and assets packs for your games, and you can even download them for use in your self-hosted Foundry or Roll20 games, if you wish to do so.

Enjoy this release and happy dice rolling!


---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

v2.4.0
===

* **Feature**: Add support for special spells within an item's attack (Green-Flame Blade and Booming Blade for example)
* **Feature**: Add support for sticky hotkeys that don't need to stay pressed to temporarily enable an option (by [@Stoneguard001](https://github.com/Stoneguard001)])
* **Feature**: Add support for a quick preview of configured hotkeys and toggleable by mouse (by [@Stoneguard001](https://github.com/Stoneguard001)])
* **Feature**: Add support for "Force Critical Hit" hotkey
* **Feature**: Add support for Super-advantage and Super-disadvantage hotkeys by differentiating between left and right Ctrl/Shift hotkeys
* **Feature**: Add support for custom damage hotkeys
* **Feature**: Do not send custom digital dice rolls to the VTT if the option to use digital dice is disabled
* **Feature**: Parse and send Range and AoE information separately in the roll data
* **Feature**: Parse and show the AoE Range and shape for spells
* **Feature**: Allow using commas in custom damage formulas, without breaking the formula, when used inside parenthesis, brackets or curly braces (useful for Roll20 macros)
* **Feature**: Add ability to roll spells that only have a save DC (Bestow Curse for example)
* **Feature**: Add special handling of the Hunter's Mark spell due to multiple duplicate damages (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for the Symbiotic Entity special class feature (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mark of Detection Deductive Intuition Half-Elf Variant Racial Feature (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Windwright's Intuition Half-Elf Variant Mark of the Storm Feature (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Charger Feat (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for UA's Fighting Initiate - Great Weapon Fighting (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Empowered Evocation (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Blade of Disaster critical hit limit (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Ranger's Favored Foe feature (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Jim's Magic Missile's unusual critical damage (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Arms of the Astral self, as being an unarmed strike for melee related special abilities (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add a character specific toggle option for the Ranger's Colossus Slayer damage die (by [@IvanGirderboot](https://github.com/IvanGirderboot))
* **Feature**: Add a character specific toggle option for Halfling Luck (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add a character specific toggle option for Genie's Wrath (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: *Astral*: Update the hp, max hp, and temp hp attributes in the character sheet. (by [@adriangaro](https://github.com/adriangaro))
* **Feature**: *Astral*: Update the resource bars to match the hp and temp hp (by [@adriangaro](https://github.com/adriangaro))
* **Feature**: *Astral*: Add an option to allow Beyond20 to configure token resource bars in Astral (by [@adriangaro](https://github.com/adriangaro))
* **Feature**: *FVTT*: Add basic support for doing native rolls in Foundry
* **Bugfix**: *Roll20*: Fix OGL sheet template detection after Roll20's change of design on March 28th 2021
* **Bugfix**: Remove support for Cleric's Disciple of Life Handling as that feature is now [supported directly](https://www.dndbeyond.com/changelog/960-cleric-life-domain-disciple-of-life-update) by D&D Beyond (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix class features and traits displaying the wrong description
* **Bugfix**: Fix game log interfering with digital dice results detection by Beyond20
* **Bugfix**: Fix critical hit/fail detection on discarded and rerolled dice (Halfling Luck for example) (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Remove the addition of Wisdom modifier to Skill checks when using Otherwordly Glamour (added natively by D&D Beyond) (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix single roll options not getting reset after a roll if more than one toggle is enabled (by [@IvanGirderboot](https://github.com/IvanGirderboot))
* **Bugfix**: Fix Unarmed Fighting not being recognized as a melee attack (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix versatile weapon hotkey not overriding the versatile option in some situations
* **Bugfix**: Use keyboard code for hotkeys instead of character code, which fixes some hotkeys failing to trigger if Shift was pressed
* **Bugfix**: Fix negative modifiers turning into positive modifiers when additional modifiers were added to them
* **Bugfix**: Do not display Beyond20 notification when no VTT is found when doing a custom digital dice roll
* **Bugfix**: Do not add a quick roll trigger on the skills heading
* **Bugfix**: Fix support for Ranger's Gathered Swarm which didn't apply to actions and spells (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix damage scaling for Gathered Swarm after it changed from UA to official content (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix detection of some tools and instructions such as Kits, Supplies, Sets and Wagons.
* **Bugfix**: Fix parsing of monster attacks that are not ranged or melee (Piercer for example) (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix parsing of monster statblock damages that were using the Minus unicode character (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix detection of proficiency when rolling tools with Beyond20 (apply reliable talent for example) (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: *Roll20*: Fix invalid formulas when using custom modifiers
* **Bugfix**: *FVTT*: Fix bug with converting DDB rolls into FVTT native rolls in some situations (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: *FVTT*: Use a different method of detecting FVTT tabs which doesn't conflict with title modifying modules
* **Bugfix**: *FVTT*: Fix compatibility with 0.8.0 for finding the world title
* **Bugfix**: *FVTT*: Fix handling of temp HP updates
* **Misc**: Re-order character specific settings to be sorted more naturally
* **Misc**: Build a CI pipeline with Github Actions and remove dist folder from source repository
* **Misc**: Refactored special melee, ranged, weapon and spell attacks into more generic and less error-prone functions (by [@KaKaRoTo](https://github.com/kakaroto) and [@Aeristoka](https://github.com/Aeristoka))
* **Misc**: Add sponsored section to the website and sponsor links for [The Forge](https://forge-vtt.com/?referral=beyond20) and [Toucan](https://jointoucan.com/partners/beyond20)


---

Click [here](/Changelog) for the full Changelog of previous versions.