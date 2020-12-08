## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v2.3.0

I hope you like the new features, and hopefully the killer feature you were waiting for was just added.

If you enjoy using Beyond20 and find it useful for your games, please considerg [showing your appreciation](rations) by offering me some rations or your patronage.

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

{% include_relative known_issues.md %}

# Release Notes

v2.3.0
===

Hi everyone!

I'm really happy with this new Beyond20 release, as I finally implemented a frequently requested and one of the most postponed features in the history of Beyond20: Custom Hotkeys!

Let's start with the boring part: Bugfixes, bugfixes and as always, more bugfixes. The most important one is the fact that last week, Roll20 changed something in the way their website works and it broke the detection of the OGL sheet, causing the rolls to use the default sheet template (the purple box) which isn't a fan favorite. This is now, of course, fixed. Also worth noting, is the improved and more stable support for Astral Tabletop by `@adriangaro`.

The new feature that got me the most excited about though is the new hotkeys manager. You can now go to Beyond20's options and configure custom hotkeys for anything you may want. Other than the usual Shift/Ctrl/Alt to do rolls with advantage/disadvantage/normal, you can now set a hotkey for enabling or disabling whispers, for using your versatile weapons one-handed or two-handed, for adding custom dice to your rolls, or to toggle any of your character specific features!

![s1](images/screenshots/beyond20-hotkeys.gif)

A couple of other features that I'm happy to finally see added is the support to send to the VTT custom rolls from D&D Beyond's Digital Dice roller, as well as the ability to roll weapon attacks with spells that add damages to it (such as Greenflame Blade and Booming Blade).

As always, `@Aeristoka` has been hard at work implementing support for all the new special class features and feats from the D&D rule books, and we now support all the new content from Tasha's Cauldron of Everything as well.

Thanks to everyone who submitted bug reports, who suggested feature requests, those who contributed to the project with their own pull requests (`@Aeristoka`, `@adriangaro`, `@rispig`, `@flangelier` and `@Kvalyr`) as well as those who answer questions and offer tech support to others in our [Discord server](https://discord.gg/ZAasSVS).

A big thank you as well to all my [Patrons](https://patreon.com/kakaroto) as well as those who sent their support via [ko-fi or github](/rations), and for all the encouragement I received over the past few months. You keep motivating me to continue supporting this amazing software that I love, despite my perpetually full schedule.

For anyone who was interested in trying out [Foundry VTT](https://foundryvtt.com), but you've been put off by the initial license purchase requirement, one of the recent features I added to [The Forge](https://forge-vtt.com/?referral=beyond20) is the ability to try out and explore Foundry and all of its features before buying it, so head over to The Forge, and click the "[Try Foundry Now](https://www.youtube.com/watch?v=XJUIDvaqPcg)" button to give it a try with a temporary license so you can see how amazing Foundry is, before you buy it. Then when you do, I'd appreciate it if you also used [The Forge](https://forge-vtt.com/?referral=beyond20) for your hosting services :)

Enjoy this release, and happy dice rolling!


---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

v2.3.0
===

* **Feature**: Add a hotkeys manager to allow setting custom hotkeys for controlling Beyond20's behavior🥳🎉
* **Feature**: Add the ability to enable/disable whisper via hotkey
* **Feature**: Add support for rolling with Super Advantage/Disadvantage (Elvin Accuracy) using a hotkey
* **Feature**: Add support for toggling one-handed/two-handed use of a weapon using hotkeys
* **Feature**: Add the ability to temporarily toggle any of the character specific settings via a hotkey
* **Feature**: Add the ability to add or subtract custom dice to rolls via hotkeys (Bless/Guidance/Bane/Bardic Inspiration/etc...)
* **Feature**: Add support for rolling weapons including special spell damages (greenflame blade, booming blade)
* **Feature**: Allow queuing up of rolls when the Digital Dice are enabled so all rolls are executed
* **Feature**: Add support for capturing and transferring digital dice rolled manually through D&D Beyond's interface
* **Feature**: Add support for parsing the item customization options (Hex Weapon, Pact Weapon)
* **Feature**: Display a class feature's choices (such as selected profiency or the Monastic Tradition) when displaying a feature to the VTT
* **Feature**: Add option to hide from the player the results of a whispered roll that is sent to Discord (by [@rispig](https://github.com/rispig))
* **Feature**: Add a notification when the class features are parsed so the user gets visual feedback when it's done
* **Feature**: Wizard Bladesong: Support concentration constitution saves and adds the intelligence modifier (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Apply Great Weapon Master for the Polearm Master bonus action (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Paladin's Oath of Devotion Sacred Weapons (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Ranger Fey Wanderer Otherworldly Glamour (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Cleric's Blessed Strikes (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Sorcerer Trance of Order's Clockwork Soul (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Druid Circle of Spore's Symbiotic Entity (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Warlock Genie Patron's Genie's Wrath (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for the Eldritch Invocation: Lifedrinker (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Piercer feat (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Artificer's Battlesmith arcane Jolt (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: *Roll20*: Add option to display the full spell description on spell attacks (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: *Roll20*: Fix detection of the OGL sheet template after recent website design change
* **Bugfix**: Fix issue where the Beyond20 settings dialog was getting pasted into the chat area of a monster's page when "More Options" is clicked
* **Bugfix**: Fix parsing of a vehicle's action stations from the Extras tab of a character sheet
* **Bugfix**: Fix parsing of damages in monster actions when the average result isn't included in the statblock (by [@flangelier](https://github.com/flangelier))
* **Bugfix**: Fix Alchemist Artificer: Alchemical Savant that was getting applied to non dice rolls (such as Aid) (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Add support for some older browser by ignoring features (custom notes) that depend on newer browser updates
* **Bugfix**: Avoid having the discord name overflowing to the right of the window if the selected friendly name is too long
* **Bugfix**: Set a maximum width to the discord combobox and add ellipsis to the name to prevent other option names from being unavailable
* **Bugfix**: Fix support for Fighter's Giant Might, as the feature was renamed "Giant's Might" (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix Ranger Fey Wanderer's Dreadful Strikes to support the level scaling post UA (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix the Bard's Psychic Blade's support conflicting with the Rogue's Psychic Blade class feature 🤦 (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix parsing of a monster's skills, which were invalid in the encounter page due to a change in format
* **Bugfix**: Fix the hotkey to override the roll type being ignored if the "always ask" option is selected
* **Bugfix**: Fix the possibility of the roll icon reverting to 'normal' after pressing and releasing the shift/ctrl hotkey
* **Bugfix**: Only use the Sharpshooter/Great Weapon Master option if the character has the Feat
* **Bugfix**: Remove the dice icon on the "Display in VTT" button next to a monster's avatar and change the styling of the button
* **Bugfix**: Fix rolls breaking if digital dice are enabled and the damage is a fixed value with no dice
* **Bugfix**: Fix dice rolls not detecting the critical fail/success and coloring the result in some situation with the Beyond20 roll renderer
* **Bugfix**: Fix critical damages not being rolled with digital dice disabled and using Beyond20 roll renderer
* **Bugfix**: Display the full spell card information from a monster page when using the "hide monster name" whisper name
* **Bugfix**: Fix custom messages not working properly if the whisper or roll type setting is set to "always ask"
* **Bugfix**: Fix unreliable support of Collossus slayer feat. Does not query anymore and is handled like Sneak Attack (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: *Roll20*: Fix rolls not being sent with the correct character "speaking as"
* **Bugfix**: *Roll20*: Fix detection of some character names to speak rolls as by trimming leading and trailing spaces
* **Bugfix**: *Roll20*: Fix custom chat messages not displaying correctly when using the Beyond20 roll renderer
* **Bugfix**: *Astral*: Changed implementation of roll buttons (when using digital dice) to work after reloading the page. They should work consistently now. (by [@adriangaro](https://github.com/adriangaro))
* **Bugfix**: *Astral*: Fixed digital dice rolls / rendered rolls for Astral. Reverted to normal behaviour when no dice are rolled. (by [@adriangaro](https://github.com/adriangaro))
* **Bugfix**: *Astral*: Fixed Astral access token acquisition in some specific edge cases. (by [@adriangaro](https://github.com/adriangaro))
* **Bugfix**: *Astral*: Fixed some issues related to slow loading of chat widget in Astral. (by [@adriangaro](https://github.com/adriangaro))
* **Bugfix**: *Astral*: Changed rendered roll formulas in Astral using the syntax recommended by @Redmega. (by [@adriangaro](https://github.com/adriangaro))
* **Bugfix**: *Astral*: Fixed some errors related to speak as character functionality. (by [@adriangaro](https://github.com/adriangaro))
* **Misc**: Clarify the text for the "click the features and traits" alert on new character sheets (by [@Aeristoka](https://github.com/Aeristoka))
* **Misc**: Remove the mention from the "send custom notes" feature information that falsly stated being supported on Roll20 only
* **Misc**: Rename the "Fighter: Sharpshooter" option to "Feat: Sharpshooter" to be more accurate
* **Misc**: Rename the "Rage: You are raging" option to "Barbarian: Rage!" to be more in line with other options formatting
* **Misc**: Add an information banner in the extension popup on non D&D Beyond and VTT pages to decrease confusion on how to use the extension
* **Misc**: Updated to the website's FAQ

---

Click [here](/Changelog) for the full Changelog of previous versions.