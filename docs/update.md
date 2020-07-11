## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v2.1.1

I hope you like the new features, and hopefully the killer feature you were waiting for was just added.

If you enjoy using Beyond20 and find it useful for your games, please considerg [showing your appreciation](rations) by offering me some rations or your patronage.

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

Some issues are known to me and are being worked on, others might be caused by a new feature that was just added in the latest update and I'm facepalming at not catching it before I made the release. 

{% include_relative known_issues.md %}

Head over to the [github issue tracker](https://github.com/kakaroto/Beyond20/issues) to see the full list of currently known issues.

If you find an issue that isn't in the list, I'd appreciate you letting me know about it (either by creating one, or by reaching out to me over on [Discord](https://discord.gg/ZAasSVS)!

# Release Notes

v2.1.1
===

Hey everyone! Here's another small bugfix release of Beyond20. It's only been a few days since the 2.1 release, but I introduced some rather critical bugs in the last release (that's what happens when you add "one last fix before I release" at 6AM which ends up breaking other stuff instead).

This update fixes some issues with the attack rolls being sent properly for some spells and weapons, as well as initiative rolls being sent twice. There's also a nice new experimental feature that was added by [@shadow7412](https://github.com/shadow7412) which adds synchronization of the Combat Tracker with Roll20 (no support yet for Foundry).

If you've just been updated to 2.1.1 directly, please refer to the release notes and changelog of the 2.1 release below from a couple of days ago for more information about this update.

Thanks!

v2.1
===

Another month, another Beyond20 release.
This time, it's mostly a bugfix release, and while I wanted to release this earlier—considering the number of bugs that crept into the v2.0 update—I found myself lacking the time and energy to do much work on Beyond20. Thankfully, there weren't too many bad bugs in v2.0, nothing game breaking at least, so I allowed myself to concentrate on other works and to actually take some time off and finally rest for the first time in months (yeay!). Most of the initial bugs were fixed by Aeristoka who has been contributing a large number of features and bugfixes lately, so everybody send some thanks his way!

Today unfortunately, D&D Beyond have [updated](https://www.dndbeyond.com/changelog/844-character-sheet-changelog-july-7th-updates) the character sheet and it broke Beyond20 pretty much instantly for everybody. This has forced me to rush out this release to you all, but I didn't want it to be an underwhelming release with just a few fixes, so I spent the afternoon and all night working on trying to cram as much features and bugfixes into this release. I still managed to do about half (23 out of 51) of the originally planned features/fixes for 2.1, so I'm pretty happy with that.

That's about it, a short release notes this time, the main changes here are bugfixes, especially for the break from the July 7th update of D&D Beyond, and a few general improvements to the user experience. There's still plenty of changes to read about in the [Changelog](/Changelog#v21).

Finally, as usual, a big thank you to all who have sent me [rations](https://ko-fi.com/kakaroto) or who support me via [Patreon](https://patreon.com/kakaroto).

If you find Beyond20 useful and it helps you run your games more smoothly, please consider [supporting](/rations) me and Beyond20.

Thank you, stay safe, and, as usual, happy rolling!

---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

v2.1.1
===
* **Feature**: Add synchronization of D&D Beyond's combat tracker with Roll20's Combat tracker (By [@shadow7412](https://github.com/shadow7412))
* **Feature**: Add support for the Wizard's Bladesong class feature (By [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Aarakocra Talons as Natural Weapons (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix incorrect detection of "To Hit" values (spells in action page and customized weapons) 
* **Bugfix**: Prevent initiative rolls from being sent twice  
* **Bugfix**: Fix HP not syncing immediately if applying damage/healing from the main page directly
* **Bugfix**: *Roll20*: Show the spell's name when rolling a spell without to-hit using the Beyond20 renderer
* **Bugfix**: *Roll20*: Fix "Display in VTT" for a monster's avatar when using the Beyond20 renderer 

v2.1
===
* **Feature**: Add Quick Roll Area to the Digital Dice buttons for "To Hit" and "Damages" in Actions and Spells tabs
* **Feature**: Add support for the Bard's Silver Tongue class feature (By [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Natural Weapons (Claws, Bites, Tails, Ram, Horns, Hooves, etc..) (By [@Aeristoka](https://github.com/Aeristoka)) 
* **Feature**: Add support for Dragon's Breath Spell attack (By [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Path of the Zealot's Divine Fury (By [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Use a slightly less biased random number generator (1 in a few trillion chances of having a biased result) (By [@shadow7412](https://github.com/shadow7412))
* **Feature**: *FVTT:* Save Roll information in ChatMessage (allows interoperability with Dice So Nice module) (By [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Make Quick Roll icon clickable and change the mouse pointer when hovering on it
* **Feature**: Change the Quick Roll tooltip's arrow to point to the quick roll area instead of the tooltip itself, to avoid confusion
* **Feature**: Make Quick Roll areas show a clickable mouse pointer
* **Feature**: Hide monster names when showing their avatars in whisper mode
* **Feature**: Query for whisper type on the D&D Beyond page instead of the VTT which allows the "Ask every time" option to work with Discord integration
* **Feature**: Add hint in the settings popup about the Shift/Ctrl/Alt hotkey for changing the roll type 
* **Feature**: Add support for monster that do multiple damages of a single type (Orc War Chief)
* **Bugfix**: Fix support for the new Character Sheet update of D&D Beyond's 7th of July update
* **Bugfix**: Fix adding the initiative to the initiative tracker when using the Digital Dice
* **Bugfix**: Fix Cast button not working when using the Quick Roll area to click on it
* **Bugfix**: Fix issue with rolling hit dice (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix issue with Polearm Master Bonus attack and Great Weapon Fighting (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix issue preventing Chaos Bolt from working properly (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix issue with Brutal Critical/Savage Attacks when using "Perfect Dice" critical homebrew rules (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix custom damage parsing when using ":" as separator without a space (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix roll type query not appearing when a skill check has an advantage/disadvantage badge (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix display issue with some sentences that were garbles after the python to javascript conversion
* **Bugfix**: Fix issue with separate roll damages breaking when character's name has a quotation mark in it
* **Bugfix**: Small fix to quick roll tooltip position so it is better centered
* **Bugfix**: Fix initiative value not updating when switching between statblocks in the Encounters page
* **Bugfix**: Fix parsing of some monster stat blocks that had non-breaking spaces in their actions' descriptions
* **Bugfix**: Fix issue of displaying results of zero when doing a monster's attack that has a to-hit value but no damages
* **Bugfix**: Fix issue with rolling actions that have "--" as their "To Hit" value (Fist of Unbroken Air)
* **Bugfix**: *Roll20*: Fix newly introduced bug where custom roll modifiers that uses queries may not change the roll to display as a critical hit when it's not
* **Bugfix**: *Roll20*: Fix bug where damages could not be rolled separately on a monster with "Hide Monster and Attack Name" whisper mode
* **Bugfix**: *Roll20*: Show critical success/failure colored results on rolls using the Beyond20 roll renderer
* **Bugfix**: *Roll20*: Change the Beyond20 renderer display so it doesn't say "To Hit" on non attack rolls
* **Bugfix**: *Roll20*: Add the "Roll Damages" button when using the Beyond20 renderer with the 'auto roll damages' option disables
* **Misc**: Improved and more standard build and packaging process (By [@moritonal ](https://github.com/moritonal))


---

Click [here](/Changelog) for the full Changelog of previous versions.