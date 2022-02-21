## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v2.6.1

I hope you like the new features, and hopefully the killer feature you were waiting for was just added.

If you enjoy using Beyond20 and find it useful for your games, please considerg [showing your appreciation](/rations) by offering me some rations or your patronage.

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

{% include_relative known_issues.md %}

# Release Notes

Hi everyone! It's time for another release already.

This update is a bugfix release, which we felt needed to be out sooner rather than later considering some of the bugs that popped up recently. It doesn't add much in terms of new features, but there's plenty of bugs to fix to improve everyone's games. Some of the more problematic issues we've seen reported were related to the combat tracker failing to sync properly with Roll20, duplicate prompts for Toll the Dead on Roll20, and whispered rolls not working properly on Foundry VTT. 

The big feature introduced in this update (which served to fix another bug) was the ability to roll from the digital dice boxes in monster stat blocks. So if you're on the Encounters page and looking at your monsters, you can roll with Beyond20 directly using the clickable digital dice buttons from D&D Beyond, instead of the Beyond20 icons that we added to the statblocks. This makes for a much cleaner look as well!

This release was almost entirely brought to you by [@Aeristoka](https://github.com/Aeristoka), thank you as usual for helping with Beyond20 and keeping all those pesky bugs away! If anyone wants to thank Aeristoka for his work, you can buy him a coffee on [Ko-fi](https://ko-fi.com/aeristoka)! This release has also seen the addition of a new contributor to the project, so I want to say welcome and thanks to [@jjchambl](https://github.com/jjchambl) for his contribution!

And finally, I want to thank all of my [Patrons](https://patreon.com/kakaroto) and [Ko-fi/Github](/rations) supporters, and those who reported the bugs they've found and for everyone else who helped make this release possible. Thank you all for your support and your love!

I hope this update makes your games run smoother, and happy gaming!

---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

v2.6.1 (February 21st 2022)
===

* **Feature**: Add the ability to hook into the Digital Dice buttons of monster stat blocks (Encounters) when available, instead of adding the Beyond20 icons to the statblock
* **Feature**: Add support for displaying the healing portion of Vampiric Touch
* **Feature**: Add an option to disable sending rolls to the D&D Beyond Game Log
* **Feature**: Add support for Monk: Diamond Soul class feature (adds proficiency to death saves at level 14) (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add the ability to roll critical damages on special attacks (like Sneak Attack) which has no "To Hit" value, when using Force Critical (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Command-Click as default additional hotkeys on Mac OS X, due to Control-Click being an accessibility hotkey on Macs
* **Bugfix**: Fix initiative value from the combat tracker not being parsed properly
* **Bugfix**: *Roll20*: Fix issue of missing combatants in the turn tracker when synchronizing with D&D Beyond's Combat tracker
* **Bugfix**: *Roll20*: Fix the turn tracker showing empty or old value when starting a combat with the tracker closed
* **Bugfix**: Fix some roll formulas in digital dice boxes being incorrect when switching between monsters in the Encounters page
* **Bugfix**: *Roll20*: Remove duplicate prompt for Toll the Dead damage from Roll20 (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: *FVTT*: Fix whispered rolls being overridden by Foundry VTT on roll type messages and showing as public rolls
* **Bugfix**: *FVTT*: Fix Life Transference and Vampiric Touch damages failing to roll due to flavor text
* **Bugfix**: *Roll20*: Fix Life Transference and Vampiric Touch showing an empty healing value
* **Bugfix**: Fix the extra damage/healing from College of Spirits: Spirital Focus not applying until level 6 (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Do not show total of one-handed and two-handed weapon attacks when there are no other damages to sum up (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Further fixes to the renaming of the two-handed/one-handed damage tyeps (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix the description text of the Celestial Radiant Soul option which was incorrectly describing the Wildfire spirit bond (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix adding non-numeric damages to the total calculation
* **Bugfix**: Do not use Great Weapon Fighting on Brutal Critical/Savage Attacks when using versatile weapons one-handed (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: *Roll20*: Add missing modifier to rolls when digital dice is enabled (by [@jjchambl](https://github.com/jjchambl))
* **Bugfix**: *Roll20*: Clean up the display of custom modifiers in attack rolls (by [@jjchambl](https://github.com/jjchambl))
* **Bugfix**: Fix for the quickrolls tooltip being shifted due to the D&D Beyond sale/offer banners at the top of the site (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix the options dialog being too wide and unusable on large monitors (by [@jjchambl](https://github.com/jjchambl))
* **Bugfix**: Fix Crimson Rite not applying on Predatory Strike attacks (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix Divine Smite support for Polearm Master attacks when used as an opportunity attack reaction (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Prevent non-roll action buttons in monster statblocks from showing a roll icon after the advantage/disadvantage hotkey is pressed
* **Misc**: Change the "Use Digital Dice" option to enabled by default, for new Beyond20 installs (by [@Aeristoka](https://github.com/Aeristoka))


---

Click [here](/Changelog) for the full Changelog of previous versions.