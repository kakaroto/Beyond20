## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v2.8.0

I hope you like the new features, and hopefully the killer feature you were waiting for was just added.

If you enjoy using Beyond20 and find it useful for your games, please considerg [showing your appreciation](/rations) by offering me some rations or your patronage.

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

{% include_relative known_issues.md %}

# Release Notes

Hi everyone,

It's been a long time since our last Beyond20 update, and it's a testament to how stable and 'perfect' your favorite chrome extension is! Ok, nothing is perfect 😁 but we've had very little activity in our issue tracker in recent months and things just seem to be working. I've been thinking a lot about the future of Beyond20, whether it's good as it is and to not change a working formula, or if it'd be worth it to expand our mission and add some new features that diverge from its core principle. The exciting thing about a new set of features will be a more active development again and more frequent releases. I'll let you know what gets decided.

This long-awaited release adds quite a few small quality of life features, expanding on what we have already, and fixing a few rare bugs that were discovered. Among the most pressing though is a couple of changes to how D&D Beyond website works, especially with regards to accessing a character sheet from the "My Characters" page, which has stopped working recently. We also added support to the new "Read Aloud" text in LMoP adventure, and the new statblocks used in Spelljammer.

Most of the bugfixes were for rare use cases, though some significant work went into adding Foundry V10 support, as well as dramatically improving the support for the "Native Rolls" feature in Foundry VTT (requires v10) with our most recent FVTT module update (1.5.x).

This release adds quite a few features and bugfixes, so please refer to the [Changelog](/Changelog#v280) for the full details of the changes.

One item that doesn't appear in the Changelog but which we worked on as well is the Chrome extension Manifest V3 support. One of the challenges we've had to face unfortunately is the forced upgrade by the Chrome store from Manifest V2 to their Manifest V3 for Chrome extensions. While we did the upgrade and it mostly worked, there were some issues with it that we couldn't fix reliably, and after delaying this release for too long, we decided to downgrade back to Manifest V2 for now so we don't release a version that may be unreliable to our users.
The Chrome decision to force extensions to move to their new MV3 design (by June 2023) is a very controversial one and has been a headache for many developers. We'll take the time in the next few months to ensure the upgrade is smooth and doesn't introduce any new issues in how Beyond20 functions, and we'll hopefully release MV3 support in the next release, without affecting any of our features.

As usual, thank you to all contributors, as well as to my generous [Patrons](https://patreon.com/kakaroto) and [Ko-fi/Github](/rations) supporters, who are making this possible. 

Finally, while it may be a bit too early for it, I want to wish everyone happy holidays and happy new year!
Keep rolling! 😄

---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

v2.8.0 (November 13th 2022)
===

* **Feature**: Add advanced option to export and import your Beyond20 settings to/from file
* **Feature**: Add new option on toggle hotkeys, allowing to permanently toggle options using hotkeys
* **Feature**: Add ability to parse roll tables in Item pages, Spell pages, etc...
* **Feature**: Add support for parsing dice, roll tables, read-aloud, etc.. in Races pages
* **Feature**: Add support for new DDB type of statblocks, appearing in new source books (Spelljammer creatures)
* **Feature**: Add option to allow display of attack description when sending to Discord
* **Feature**: Add support for the new "Read Aloud" formatting D&D Beyond used in Lost Mine of Phandelver (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Death Cleric: Circle of Mortality (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add special handling for Dragon Wing ranged weapon damages and the Flail of Tiamat, and allow setting a note to specify which damage to use (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Save the last user selection of damage queries to default to the same damage type
* **Feature**: Ensure that all queries for advantage are done on the DDB side, rather than in the VTT
* **Feature**: Send the list of monster actions in the Beyond20 requests in case the VTT needs to know that information
* **Feature**: *Roll20*: Add new option to allow display of a spell's details during attacks (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix character parsing not working when accessing a character from the "My Characters" page due to a change in how DDB changes sites
* **Bugfix**: Fix any hotkey modifier (for whisper/advantage/etc...) being forgotten if a user query is open during a roll (such as damage type for Chromatic Orb)
* **Bugfix**: Fix the displayed total in Digital Dice notification to the non-discarded roll in case of advantage/disadvantage
* **Bugfix**: Parse dice formulas in multi-paragraph monster actions (Gelatinous Cube's "Engulf", or a Beholder's "Eye Rays" for example)
* **Bugfix**: Correctly show individual roll results in the Digital Dice notification when multiple dice are rolled
* **Bugfix**: Do not apply the Paladin's Aura of Protection on Death Saves since the character is unconscious (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Do not apply Otherwordly Glamour to Charisma saves (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix Great Weapon Fighting not being applied to brutal critical damage dice when using the Polearm Master bonus attack (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Clean up formula parsing, which fixes among other things, some errors showing on Foundry VTT v10
* **Bugfix**: Fix a leftover quickroll tooltip when rolling a saving throw from the sidebar
* **Bugfix**: *FVTT module v1.5.1*: Fix NPC hp formula when using a Native Rolls actor
* **Bugfix**: *FVTT module v1.5.1*: Port Native Rolls to require Foundry v10 and remove deprecation warnings
* **Bugfix**: *FVTT module v1.5.1*: Fix support for automated animations with Native Rolls
* **Bugfix**: *FVTT module v1.5.1*: Fix incorrect proficiency value being set on non-standard items when using Native Rolls
* **Bugfix**: Remove possibility of a message broker error when sending Beyond20 requests through the Game Log
* **Bugfix**: Fix issue not recognizing some monster actions when a non-breaking space is included in the action name
* **Bugfix**: Fix the Restrained condition appearing as "RRestrained" due to the "R" in the svg icon (by [@IsaacAbramowitz](https://github.com/IsaacAbramowitz))
* **Misc**: Remove support for Astral VTT as the site is now closed permanently
* **Misc**: Add harpy.gg as a recognized VTT which added native support for Beyond20
* **Misc**: Add alchemyrpg.com as a recognized VTT site (with plans to add native support for Beyond20)


---

Click [here](/Changelog) for the full Changelog of previous versions.