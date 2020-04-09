## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v1.1

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

v1.1
===

Hey everyone, it's time for a new Beyond20 release!

That's a lie, it's actually not time for the release, but D&D Beyond has been updating their character sheet layout recently and Beyond20 was therefore broken for some users who were selected by D&D Beyond for beta testing the new layout.

This means that I'm making a release earlier than expected, which unfortunately also means that it doesn't have all of the new features I had planned for v1.1. The big change in this update is of course the fact that it will now also work for those using the **new D&D Beyond sheet layout**. The change might not be visible to most of you, but there were some internal changes to the website that required Beyond20 to parse the page differently.

While there's also a couple of bugfixes in this update (as usual, refer to the [Changelog](Changelog#v11) for the full details), there are also two interesting features that were added :
- You can use in custom spell/action/weapon descriptions the formula `1d20 + your spell save DC` or `+ your Wizard spell attack` or `+ your Cleric spell modifier`, etc... to have those parsed and add the proper modifiers. These special formulas join the other `+ your dexterity modifier`, `+ your Paladin level`, `+ your proficiency bonus` and `+ your AC` that were already supported.
- You can now define the damage type for your custom damage dice in the character sheet's beyond20 quick settings. To specify the damage type, simply prefix your formula with the type separated with a colon, for example `Rage: 2` or `Fury of the small: 3, Magic Weapon: 1`

The Discord integration functionality turned out to be much more popular than I initially thought it would be, and I was hoping to add some new cool features to it, but due to the urgency of this release, that's delayed. I will work on getting it more fleshed out for next time though, I promise.

I'd also like to take a moment to quickly address the current global crisis. Due to COVID-19, there are many people who have been forced to move their D&D games to online play, and this can be seen by the sudden surge in popularity of the Beyond20 extension. It is a bittersweet feeling, since, while I am deeply saddened by what's happening outside our homes, I am also proud to have been able to help people stay connected and ease their experience in how they play their favorite game online.
When I made the last release, I had announced that I'd achieved, ten months after the initial release, a total of 15 226 chrome and 1 611 Firefox users (on March 16th), and today, three weeks later (on April 8th), Beyond20 now has 58 292 chrome and 5 665 Firefox users. That's almost 4 times the users in just 3 weeks, and it's all been because of you, isolating yourselves and instead of spreading the virus, you were spreading through word of mouth, how much you love my extension and find it helpful.

I like to end these release notes with my usual thank yous. First, I'd like to thank the D&D Beyond team who have reached out to me and have granted me access to the alpha character sheet in advance so I could update Beyond20 to work with the new layout. Working with them has been a real pleasure, and I wanted to thank them for being so friendly and open.

I'd also like to thank all of you who have sent me rations/coffees through the [Ko-fi]https://ko-fi.com/kakaroto) link or who pledged on [Patreon](https://patreon.com/kakaroto) through my [support](/support) page. The outpouring of love and support has been tremendous and is what keeps me working and updating Beyond20 for you all. 

Thank you as well for all of you who told others of the extension or who came to my [Discord](https://discord.gg/ZAasSVS) to thank me or to tell me how much you loved my work.

If you find Beyond20 useful to you and it helps you run your games more smoothly, please consider [supporting](/rations) me and Beyond20.

Thank you, stay safe, and, as usual, happy rolling!


---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

* **Feature**: Add support for the new D&D Beyond character sheet layout
* **Feature**: Save and cache spell modifiers/attack/save DC information from character sheets
* **Feature**: Add support for dice formulas using "+ your spell save DC" or "+ your Wizard spell attack", etc..
* **Feature**: Add ability to specify the damage type in custom damage formulas
* **Bugfix**: Always round initiative value to decimal when using the tie breaker option
* **Bugfix**: Don't send HP update information to VTT if HP syncing is disabled
* **Bugfix**: Remove trailing spaces from character names to avoid issues with HP syncing name match
* **Bugfix**: Fix damage total calculation breaking when enabling Rage
* **Bugfix**: Fix damage total calculation breaking when enabling Sharpshooter
* **Bugfix**: Fix statblock detection for character sheet creatures when using the integrated dice roller
* **Bugfix**: Fix issue with the "Send rolls to" being reset to an invalid value when changing settings
* **Bugfix**: *FVTT*: Fix detection of FVTT tab when using a route prefix
* **Misc**: Fix Donate button size being too big in the popout dialog in non-dnd/roll20/fvtt websites
* **Misc**: *Chrome*: Add permissions for forge-vtt.com as I prepare for using a new domain


---

Click [here](/Changelog) for the full Changelog of previous versions.