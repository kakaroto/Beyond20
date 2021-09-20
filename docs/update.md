## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v2.5.0

I hope you like the new features, and hopefully the killer feature you were waiting for was just added.

If you enjoy using Beyond20 and find it useful for your games, please considerg [showing your appreciation](rations) by offering me some rations or your patronage.

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

{% include_relative known_issues.md %}

# Release Notes

Hello Beyonders! We are due another major release of Beyond20 and this one packs a couple of really cool features!

The feature I'm most happy about is the new integration with the D&D Beyond Game Log. This feature was coming for a long time and was complicated to get working properly, but you will now be able to see the detailed result from Beyond20 in your Game Log and your friends/players/minions will be able to see the exact formulas and results of each roll made by Beyond20, whether you use the Digital Dice or not!

Another cool feature is the ability to set a target Discord channel to send rolls to, on a per-character basis. That should make it easier for people playing in multiple campaigns, not to have to switch their discord settings every time. You can now also set custom damage formulas or custom modifier formulas for your hotkeys, instead of being limited to the hardcoded choices we previously offered.

Finally, last but not least, I'm happy to announce the ability to send read aloud text from source books directly into the chat of your favorite VTT!

This is of course only a small subset of the changes, and I recommend you check out the full [Changelog](/Changelog#v250) to see all of the new features and bugfixes that went into this release.

As usual, I want to thank all of my [Patrons](https://patreon.com/kakaroto) and [ko-fi/github](/rations) supporters, and for everyone who helped make this release possible. Thank you all for your support and your love!

Enjoy this update, and keep rolling!

---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog
2.5.0 (September 20th 2021)
===

* **Feature**: Add support for sending the detailed roll results to the D&D Beyond Game Log
* **Feature**: Add the ability to set custom modifier/damage formulas when setting up hotkeys
* **Feature**: Add option to set a target discord channel on a per-character basis
* **Feature**: Add Beyond20 button on read-aloud text boxes to send as chat message to the VTT
* **Feature**: Add support for applying custom modifiers and custom damages from hotkeys to Monster rolls too
* **Feature**: Query for the advantage/disadvantage on skill checks that have a magical conditional advantage/disadvantage badge
* **Feature**: Add buttons to display character's proficiencies to the VTT
* **Feature**: Add support for adding magical modifiers on death saves (from Luck Stone, or Cloak of Protection)
* **Feature**: Add item quantities when rolling/displaying an item
* **Feature**: Add button to display a character sheet's avatar to the VTT
* **Feature**: Add the ability to roll non standard dice formulas (1d2, 1d50, etc..) when using the digital dice
* **Feature**: Show the character's avatar next to each roll when using the html roll renderer
* **Feature**: Add support for Mark of Warding Dwarf - Warder's Intuition (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mark of Scribing Gnome - Gifted Scribe (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mark of Healing Halfling - Healing Touch (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mark of Hospitality Halfling - Ever Hospitable (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mark of Finding Half-Orc/Human - Hunter's Intuition (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mark of Handling Human - Wild Intuition (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mark of Making Human - Artisan's Intuition (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mark of Passage Human - Intuitive Motion (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mark of Sentinel Human - Sentinel's Intuition (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mark of Warding Dwarf (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add special handling for Spirit Shroud spell (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add special handling for Destructive Wave spell (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Update the CSS styling further for the roll renderer (by [@LorduFreeman](https://github.com/LorduFreeman))
* **Feature**: Send Beyond20 roll request information to the DOM as a custom event, which could allow other extensions to take advantage of that data
* **Feature**: Send roll requests and rendered rolls to other D&D Beyond players through the Game Log (does not appear but could be used by other extensions)
* **Bugfix**: Fix bug calculating the modifier in custom skills when querying for the ability to use (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Prevent the custom digital dice rolls from being sent to the game log, polluting it with hard to parse roll information
* **Bugfix**: Fix "Force Critical" option being ignored when rolling damages only on spells (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Clean up alertify classes from comments sections of items, monsters, spells, vehicles to prevent comments polluting the page
* **Bugfix**: Fix duplicate roll buttons appearing on vehicle statblocks
* **Bugfix**: Fix broken attacks for the Animate Objects spell
* **Bugfix**: Remove querying for advantage when rolling a custom formula rather than an attack/ability check
* **Bugfix**: Fix adding quick roll areas to the modifiers preview in the "Change Theme" panel
* **Bugfix**: Fix discord logo in the options menu not being visible anymore
* **Bugfix**: Fix issue rolling custom dice formula with the digital dice when the whisper type is set to "Ask every time"
* **Bugfix**: Fix the game log hijacking digital dice rolls in the encounters page
* **Bugfix**: *FVTT*: Fix Temp HP syncing by removing the HP Max override when Temp HP is set (by [@Aeristoka](https://github.com/Aeristoka))
* **Misc**: Add proficiency flag to saving throw requests sent by Beyond20
* **Misc**: Fix the "available in chrome store" image not loading on the website
* **Misc**: Remove Toucan sponsorhip from the website (nobody seemed particularly interested in their product 🤷‍♂️)

---

Click [here](/Changelog) for the full Changelog of previous versions.