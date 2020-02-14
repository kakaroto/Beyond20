## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v0.9

I hope you like the new features, and hopefully the killer feature you were waiting for was just added. In that case, please considering [showing your appreciation](rations)?

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

Some issues are known to me and are being worked on, others might be caused by a new feature that was just added in the latest update and I'm facepalming at not catching it before I made the release. 

Head over to the [github issue tracker](https://github.com/kakaroto/Beyond20/issues) to see the list of known issues.

If you find an issue that isn't in the list, I'd appreciate you letting me know about it (either by creating one, or by reaching out to me over on [Discord](https://discord.gg/ZAasSVS)!

# Release Notes

v0.9
===

It's time for the v0.9 release of your favorite extension! This adds support for a lot of special feats and class features, thanks to @Kelijyr on [Discord](https://discord.gg/ZAasSVS) who tracked down most of them. I've fixed the bugs that have been reported recently, and added some cool new features as well. My favorite is the ability to quickly roll with advantage by holding Shift when clicking the roll button. You can also roll with disadvantage by holding Ctrl, or do a normal roll by holding Alt. Thanks to @TheSheep from [Github](https://github.com/kakaroto/Beyond20/issues/81) for the suggestion and proof of concept.

Another cool feature, is the syncing of Temp HP for your characters and the HP and Temp HP for your Extra creatures. Make sure you rename that "Wolf" Beast Companion that follows you into a unique name to avoid changing the HP of all the wolves attacking you in your next battle. And one final thing which took way too long to achieve was the addition of the quick settings button for Firefox users. I originally thought it was a Firefox bug but I finally realized that Chrome was not following the specification and I had to work around it to achieve what I was trying to do. But now it works, so that's great.

As usual, big thanks to everyone who helped, supported me, reported bugs, gave feature suggestions, or just spread the word about this extension to their friends and gaming groups. A special thank you as always to [my Patrons](https://patreon.com/kakaroto) who keep me motivated.

I have also recently joined the [Github Sponsors](https://github.com/sponsors/kakaroto) program, and for the first year, Github is matching contributions up to 5000$ per developer, so [check it out!](https://github.com/sponsors/kakaroto)

If you find Beyond20 useful to you and it helps you in your games, please consider supporting me, either on [Patreon](https://patreon.com/kakaroto), [Github](https://github.com/sponsors/kakaroto) or [Ko-fi](https://ko-fi.com/kakaroto).

Thank you, and happy rolling!

---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

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


---

Click [here](/Changelog) for the full Changelog of previous versions.