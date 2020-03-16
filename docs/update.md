## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v1.0

I hope you like the new features, and hopefully the killer feature you were waiting for was just added.

If you enjoy using Beyond20 and find it useful for your games, please considering [showing your appreciation](rations) by offering me some rations or your patronage.

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

Some issues are known to me and are being worked on, others might be caused by a new feature that was just added in the latest update and I'm facepalming at not catching it before I made the release. 

{% include_relative known_issues.md %}

Head over to the [github issue tracker](https://github.com/kakaroto/Beyond20/issues) to see the full list of currently known issues.

If you find an issue that isn't in the list, I'd appreciate you letting me know about it (either by creating one, or by reaching out to me over on [Discord](https://discord.gg/ZAasSVS)!

# Release Notes

v1.0
===

Wow, it's the Vee-One Release! 

Alright, the v1.0 version doesn't hold any particularly special importance. I started releasing Beyond20 ten months ago with v0.1 and this is the 10th release since then. This release is still a pretty major milestone as I'm releasing a new feature in Beyond20 that I'm sure many of you will love. I didn't know if I would be able to do it, but it turned out to be easier than expected, and I present to you : [**Discord Integration**](https://beyond20.here-for-more.info/discord)

You can now invite the Beyond20 Discord bot into your servers and have all your rolls sent to Discord. Be aware that you can either send to Roll20 or to Discord, not both at the same time. Since that limitation is not there for Foundry VTT, I'll try to find a way to achieve the same thing with Roll20, though I'm not sure if it would be possible.

Here's what it looks like (with and without the spoiler tags revealed, click to zoom) : 

[![s7](images/screenshots/discord-hidden.png){:width="300px"}](images/screenshots/discord-hidden.png) ---  [![s8](images/screenshots/discord-rolls.png){:width="300px"}](images/screenshots/discord-rolls.png)

One other thing of note in this release is that I've received my first external code contribution. Thank you Jeremy '[@jaypoulz](https://github.com/jaypoulz)' Poulin who implemented the option to add the dexterity modifier as tie breaker to initiative rolls. 

This release also fixes (for the third time) the changes to D&D Beyond's Encounters page, allowing you, once again, to roll from the stat blocks of monsters directly in the Encounters or the new Combat tracker.

There's plenty more features and a whole lot of bugfixes that made their way into this release and, as usual, you can read the full [Changelog](Changelog#v10) below. I wanted to do so much more, but saying that I've been busy for the past 2 months would be the understatement of the year, so I had to bump some of those features for the next release, but hopefully the Discord integration makes many of you happy and makes up for any feature you may have been waiting for.

I expect v1.1 to be ready in a month or two, to keep up with my usual release schedule, but I'm dedicating most of my time right now to a new business project I've started for hosting Foundry VTT games, so things may be a bit slower than usual in the coming months. With my new business, [The Forge](https://forgevtt.com), my aim is basically to have a user experience resembling Roll 20 when it comes to game and user management but with the powerful Foundry VTT as the core technology behind it. And of course, I'm doing my best to make it as stable, polished and user-friendly as I've tried to do with Beyond20. Check it out if you're curious, but do note that it's currently still in beta and I'm not taking subscriptions just yet other than offering beta access for my patrons.

As usual, I can't end without saying a big thank you to all those who supported this project and who contributed in one way or another. A big thank you to my patrons of course, who are making this possible, and to the 15226 chrome users and 1611 Firefox users (as of today, March 16th) of the extension who are using it, sharing it with their groups and friends, and who write reviews and send me praise/encouragement every day. Thank you all!

If you find Beyond20 useful to you and it helps you in your games, please consider supporting me, either on [Patreon](https://patreon.com/kakaroto), [Github](https://github.com/sponsors/kakaroto) or [Ko-fi](https://ko-fi.com/kakaroto).

Thank you, and happy rolling!


---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

* **Feature**: Added Discord integration via the new Beyond20 Discord Bot!
* **Feature**: Add setting for adding a dexterity tie breaker to initiative rolls (Contributed by Jeremy '@jaypoulz' Poulin)
* **Feature**: Track the monster stat blocks from the new encounter page and combat tracker
* **Feature**: Add support for parsing the avatar of the character/monster and preview image of attacks/items/spells (used in Discord integration)
* **Feature**: Improved dice formula parsing for D&D Beyond integrated dice roller
* **Feature**: Use "Display in VTT" button only for spells/items that do not generate attack or damage rolls
* **Feature**: Add support for parsing "+ your AC" or "+ your Armor Class" dice formulas in description text
* **Feature**: Allow manually selected super-advantage to remain active when rolling with features that force advantage (such as the Rogue's Assassinate)
* **Feature**: *Roll20*: Improve display of Temp HP when assigned to a token bar
* **Feature**: *FVTT*: Add support for HP sync with worlds using the Simple Worldbuilding System
* **Bugfix**: Fix Quick Roll feature not working properly for spells when character has available spell slots
* **Bugfix**: Fix rolling attack roll for weapons affected by magic items
* **Bugfix**: Reset roll type key modifiers (shift, alt, ctrl) when window is unfocused to prevent wrong state in cases of Ctrl-Tab for example
* **Bugfix**: Fix support for disadvantage key modifier with Ctrl/Cmd on Mac OS 
* **Bugfix**: Fix the use of the proper modifier in formulas that have "+ your proficiency bonus"
* **Bugfix**: Apply Hexblade's Curse critical hit on 19 for all attacks, not only weapon attacks
* **Bugfix**: Fix Monster skill checks not adding the modifier when rolled from the new Encounters page
* **Bugfix**: Fix rolling of weapons with no item properties, such as Maces
* **Bugfix**: Fix negative modifiers not being applied to damages when using integrated roller
* **Bugfix**: Consider Vehicle stat blocks as Monsters with regards to the whisper monster rolls setting
* **Bugfix**: Don't consider the "0 hit points by this damage" for the Demon Grinder Vehicle as a damage of type "hit points by this"
* **Bugfix**: *Roll20*: Fix syncing of temp HP with token bars
* **Bugfix**: *FVTT*: Fix updating initiative on combatants already in encounter
* **Bugfix**: *Firefox*: Fix condition tracking not working properly
* **Misc**: Various small miscellaneous fixes
* **Misc**: Add The Forge (https://forgevtt.com) as a whitelisted FVTT server
* **Misc**: Add transparency to the roll type indicator to make it less conspicuous


---

Click [here](/Changelog) for the full Changelog of previous versions.