## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v2.2

I hope you like the new features, and hopefully the killer feature you were waiting for was just added.

If you enjoy using Beyond20 and find it useful for your games, please considerg [showing your appreciation](rations) by offering me some rations or your patronage.

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

{% include_relative known_issues.md %}

# Release Notes

v2.2
===

Hi again, it's time to drop another massive Beyond20 update!

This update has been brewing for a while, and every day for the last month, I thought I'd finally be ready to release it, but there was always something taking up my time, or some new issue that needed to be fixed first. I felt bad, because I thought this overdue update wasn't going to amount to much, as I've been too busy spending most of my time working on [The Forge](https://forge-vtt.com/?referral=beyond20), but it turns out I was wrong, and this update is **massive**. It has 73 items in its changelog, over 30% more than the previous 2.0 release, making it the biggest release yet! It's hard to believe it!

Enough chit chat, let's get down to business. This release has a lot of bugfixes, taking care of all the small issues that you may have had, as well as a bunch of quality of life improvements all over the place, I'll let you discover it all through the [Changelog](/Changelog#v22). There are a couple of big features coming in this update, most notably, the support for [Astral Tabletop](https://www.astraltabletop.com) which was contributed by [@adriangaro](https://github.com/adriangaro), who did an amazing job with it. We also now have a much better integration with the D&D Beyond digital dice, as you can finally roll attack and damages separately, as well as see the nice OGL sheet template output on Roll20.

Another useful new feature is that when you first open your character sheet, or when you level up, Beyond20 will remind you to go the `Features & Traits` page of your sheet to update the information it has about the character. There's also support added for quite a few special class features (courtesy of [@Aeristoka](https://github.com/Aeristoka)) and the ability to set a custom message to be sent along specific attacks (to run macros when casting a specific spell or display an image when using your weapon for example), thanks to [@John-Paul-R](https://github.com/John-Paul-R).

As you have noticed, there are quite a few contributors who have helped make this release possible, so I'd like to thank them for their code contributions, as well as thank those who have been helping out/answering questions in our [Discord server](https://discord.gg/ZAasSVS). Finally, a big thank you as well to all of you who have sent me [rations](https://ko-fi.com/kakaroto) or who support me via [Patreon](https://patreon.com/kakaroto). You are the ones motivating me to keep on improving this beautiful piece of software!

If you find Beyond20 useful and it helps you run your games more smoothly, please consider [supporting](/rations) me and Beyond20. Alternatively, I'd invite you all to check out [The Forge](https://forge-vtt.com/?referral=beyond20), my hosting service for Foundry VTT which makes it super easy to get started playing on the best Virtual Tabletop that exists.

Thank you, and, as usual, happy rolling!


---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

v2.2
===

* **Feature**: Add support for Astral Tabletop (by [@adriangaro](https://github.com/adriangaro))
* **Feature**: Add support for rolling instruments as tools (by [@John-Paul-R](https://github.com/John-Paul-R))
* **Feature**: Add ability to roll attack and damage separately from the quick-rolls area
* **Feature**: *Roll20*: Add ability to use the OGL sheet when rolling with Digital Dice enabled
* **Feature**: Improve the Digital Dice notification to show only the first full roll with modifiers
* **Feature**: Add an alert to the user to remind them to visit the Features & Traits page when the sheet is new or after a level up
* **Feature**: Add a setting for overriding the critical limit on attacks (for magical/homebrew items that grant that ability)
* **Feature**: Add "Roll Twice" as an option when querying the user for the roll type
* **Feature**: Set the "Normal Roll" as the first/default option when query the user for the roll type
* **Feature**: Show indicator of adv/disadv when rolling initiative as it rolls as a single formula
* **Feature**: Add support for displaying an Artificer's infusions
* **Feature**: Add support for displaying the background feature to VTT
* **Feature**: Add Beyond20 dice icons to roll from the action/feature snippets directly
* **Feature**: Move the user query for advantage/disadvantage roll to the D&D Beyond page
* **Feature**: Move the user query for custom skills to the D&D Beyond page
* **Feature**: Move the user query for rolling tools and instruments to the D&D Beyond page
* **Feature**: Add a "Use Tool" and "Use Instrument" button for tools and instrument items
* **Feature**: Save the last choice made by the user in the whisper/advantage query dialogs
* **Feature**: Add abilility to send custom chat messages/macros to VTT when doing a roll (by [@John-Paul-R](https://github.com/John-Paul-R))
* **Feature**: Roll the Spell Attack as a full attack instead of a custom d20 modifier. Allows use of the advantage settings
* **Feature**: Add the ability to switch the D&D Beyond sidebar to the selected spell's level when clicking on a spell which is the same as the one already displayed, but at a different level
* **Feature**: Add support for Halfling Luck feature
* **Feature**: Add support for Fey Wanderer's Dreadful Strikes (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Barbarian's Indomitable Might (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for fighter's Remarkable Athlete (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Alchemist Artificer's Alchemical Savant (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Artificer's Armorer Power Armor attacks (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Oath of Conquest: Invincible Conqueror (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Wildfire Druid: Enhanced Bond (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for conditionally enabling the Divine Fury class feature
* **Feature**: *FVTT*: Add support for Foundry VTT 0.7.x
* **Feature**: *FVTT*: Call a hook with the roll request data to let modules handle intercept and handle the roll instead (to allow for native rolls)
* **Bugfix**: Fix rolling spells multiple times when using the cast button after changing the spell level
* **Bugfix**: Don't query for roll type when rolling initiative with "roll twice" set, and instead only add the first result to tracker
* **Bugfix**: Fix the Display Avatar option not sending the avatar to discord when rolling to Roll20/FVTT at the same time
* **Bugfix**: Fix detecting the character's level when they've reached level 20 on XP progression, as the XP bar gets filled instead of showing level 20
* **Bugfix**: When digital dice are enabled, move the quick roll area for abilities to the digital dice button
* **Bugfix**: Set the quick roll area to the correct section of the sheet when the sheet is configured to show the modifier in the primary abilities box
* **Bugfix**: Add quick roll to the initiative button in mobile layout
* **Bugfix**: Don't roll crit damage on conditional damage of a monster statblock that applies on a saving throw
* **Bugfix**: Fix detecting the Escape DC for attacks from monster stat blocks
* **Bugfix**: Fix rolls with invalid modifier for attacks in monster stat blocks that do not have a to-hit value
* **Bugfix**: Fix the missing comma separating saving throws in a monster stat block after Beyond20 adds its dice
* **Bugfix**: Fix parsing of skills with spaces ('Sleight of hand', 'Animal Handling') in a monster stat block
* **Bugfix**: Fix display of damages in Roll20 when using the roll renderer, for multiple damages of the same type
* **Bugfix**: Do not add a "Roll Damages" button if auto-roll-damages is disabled but the attack has no damages
* **Bugfix**: Add support for Paladin's Improved Divine Smite when used with Polearm Master Bonus Attack (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix Polearm Master Bonus Attack not applying for Tavern Brawler Strikes (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix Polearm Master Bonus Attack not applying Paladin's Improved Divine Smite (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix Polearm Master Bonus Attack not applying Great Weapon Fighting rerolls (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix Polearm Master Bonus Attack not applying for Tavern Brawler Strikes (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix parsing of character level when using XP-based progression (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix Discord logo overlapping over the settings description (by [@John-Paul-R](https://github.com/John-Paul-R))
* **Bugfix**: Fix popup content overlapping the header in the quick settings dialog (by [@John-Paul-R](https://github.com/John-Paul-R))
* **Bugfix**: Fix item description not properly replacing all html entities (by [@John-Paul-R](https://github.com/John-Paul-R))
* **Bugfix**: Fix quick roll notification being shifted down if a banner is shown on D&D Beyond site
* **Bugfix**: Fix monster parsing when an attack has no damage
* **Bugfix**: Use local storage for storing settings, which should fix settings not saving for some users
* **Bugfix**: Hide the character's name in conditions display if it appears twice when the player speaks as the character (by [@macmaxbh](https://github.com/macmaxbh))
* **Bugfix**: Fix "Force Critical" not working for characters with Improved Critical feature
* **Bugfix**: Apply Great Weapon Fighting to brutal damage dice
* **Bugfix**: *FVTT*: Fix updating token health for Simple Worldbuilding System
* **Bugfix**: *FVTT*: Only update tokens HP for tokens that the user owns
* **Bugfix**: *FVTT*: Fix detection of critical hits on 0.7.x
* **Bugfix**: *FVTT*: Force the dice details in the tooltips to be auto expanded
* **Bugfix**: Prevent custom dice from affecting the critical failure/critical success state of attack rolls
* **Bugfix**: Fix "Artificer Chaos Bolt" and Izzet Engineer background and spell sources not being detected correctly (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix handle of special features that depend on an ability being used, when doing a custom skill or tool roll
* **Bugfix**: Fix Advantage/Disadvantage badges on skills not being applied anymore (by [@Aeristoka](https://github.com/Aeristoka))
* **Misc**: Improve FAQ about using Beyond20 with Foundry VTT (by [@shadow7412](https://github.com/shadow7412))
* **Misc**: *FVTT*: Do not use Foundry VTT 0.7.x deprecated APIs based on the running version
* **Misc**: Remove testimonials from site's main page and add link to reviews instead
* **Misc**: Add banner/ad for [The Forge](https://forge-vtt.com) to the main site

---

Click [here](/Changelog) for the full Changelog of previous versions.