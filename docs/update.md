## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v2.6.0

I hope you like the new features, and hopefully the killer feature you were waiting for was just added.

If you enjoy using Beyond20 and find it useful for your games, please considerg [showing your appreciation](rations) by offering me some rations or your patronage.

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

{% include_relative known_issues.md %}

# Release Notes

Happy New Year everyone! 🎉

I hope everyone enjoyed the holidays and got plenty of rest. We're kicking off the new year with a new Beyond 20 release, which adds a couple of interesting features, and the much anticipated support for Foundry VTT v9.

The first thing to mention is of course the support for Foundry VTT version 9, which was released only a couple of weeks ago and is looking as great as ever. Unfortunately, with the new release, Beyond20 had stopped working due to breaking API changes in Foundry, and this release fixes it and restores all functionality. We've also updated the Foundry companion module with support for chat damage buttons, allowing you to more easily apply damage or healing to your selected tokens, and also adds support for native Foundry rolls, allowing integration with other Foundry modules, such as midi-qol for example.

One big feature we've worked on is that if you are self hosting Foundry, you can now request permanent permissions for your Foundry domain allowing it to automatically be activated when you load your Foundry game. As usual, you don't need to activate Beyond20 if you use [The Forge](https://forge-vtt.com), but for all those who aren't Forge users (and missing out on its awesomeness), this is a long awaited feature. Thanks to the new permission request system, we've also removed the broad permissions from FireFox, now only requesting access to the sites we actually need, and requiring the user to manually activate Beyond20 on their Foundry self hosted URLs. If you are unfamiliar with the process, you simply need to click on the Beyond20 icon in the address bar to activate the extension for your Foundry game, and you should be able to request the permanent permission from there as well.

[![s1](images/screenshots/beyond20-activate.png)](images/screenshots/beyond20-activate.png)

In other news, we've added a new "Advanced options" section, both to the per-character options and the global options, which gives us a cleaner settings interface, and will also allow us in the future to add some more controversial/rare options without worrying about bloating the UI. We also made good use of the new menu to add some new fine tuning options as well as move existing rarely used options to the Advanced menu. You can find the "Advanced Options" button at the bottom of the Beyond20 options menu.

Another small, but important feature, is that the Beyond20 changelog, which is displayed when the extension is updated, will now only be displayed when you access a D&D Beyond or VTT page. It's a very welcome change, as it used to display the changelog when the extension was updated, which could happen at any time, and could disrupt a user's browsing experience. I'd like to thank [@sleepkever](https://github.com/sleepkever) for the [suggestion](https://github.com/kakaroto/Beyond20/issues/867), because I know it was something annoying (especially last June where there were multiple consecutive updates in a short span of time), and that some users didn't want to disable the option to open the changelog either. This should make everyone happy!

That's it, as always, check out the full [Changelog](/Changelog#v260) to see all of the new features and bugfixes that went into this release.

As usual, I want to thank all of my [Patrons](https://patreon.com/kakaroto) and [ko-fi/github](/rations) supporters, and for everyone who helped make this release possible. Thank you all for your support and your love! You're the ones making Beyond20 possible!

Enjoy this update, and may 2022 bring you lots of natural 20s!


---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

v2.6.0 (January 4th 2022)
===

* **Feature**: *FVTT*: Add support for Foundry v9 (rolls, HP syncing, conditions syncing, initiative tracking, etc...)
* **Feature**: *FVTT*: Add support for (Experimental) Foundry native rolls for 0.8.9 and v9 in the FVTT module 1.4.0 (disabled option by default)
* **Feature**: *FVTT*: Add support for requesting permanent permissions for custom Foundry VTT domains
* **Feature**: Remove broad permissions from FireFox, and switching to a Chrome like system for activating on Foundry VTT tab
* **Feature**: Add an 'Advanced Options' button to separate the more common vs advanced settings in Beyond20 options
* **Feature**: Only open Beyond20 changelog when the user visits a D&D Beyond or VTT page, rather than on extension update
* **Feature**: Hide the custom modifiers in the per-character settings under an Advanced settings toggle
* **Feature**: Add support for sending whispers to the DDB game log 
* **Feature**: Add ability to display an item's image to the VTT from Magic Item pages
* **Feature**: Add character initiative to the D&D Beyond encounters when rolling for Initiative
* **Feature**: Add support for dice formula that use uppercase 'D' instead of 'd' for the dice
* **Feature**: Add support for roll tables which uses a 'Bardic Insp. Die' instead of a dice formula (Bard College of Spirits: Spirit Tales)
* **Feature**: Add support for Warlock: The Celestial: Radiant Soul (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Elemental Weapon damage selection (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Elemental Bane weapon damage selection (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add a query for Spirit Guardian's damage type (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Move all queries to the D&D Beyond site when building a roll request, instead of on the VTT side (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add an advanced option to configure how a hidden monster name/attack should appear (default to '???')
* **Feature**: Add support for a custom raw ability check modifier 
* **Feature**: Rename "One/Two Handed" weapon damages into a shorter "1/2-Hand" display (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add option to always show the type of damage for versatile weapon attacks (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: *FVTT*: Add support for chat damage buttons in the Foundry VTT module
* **Bugfix**: Apply per-character discord target to a character's Extras
* **Bugfix**: Fix issue with some monster actions not being recognized if they started with a space (Mind Flayer Lich Illithilich)
* **Bugfix**: Fix alertify library polluting the comments in DDB pages (tinymce iframe)
* **Bugfix**: Fix formula parsing which uses the unicode minus character (Homunculus Servant in artifier's source)
* **Bugfix**: Fix the Jack of All Trades character option not being visible in the per-character settings
* **Bugfix**: Fix aspect ratio of the character avatar images so they match DDB's display
* **Bugfix**: Trim all damage types, as a damage type might appear preceded with a space in some situations
* **Bugfix**: Fix detection of AoE shape for spells in character sheets (useful for Foundry native roll support)
* **Misc**: Remove support for Paladin's Legendary Strike, as it was not retained from UA (by [@Aeristoka](https://github.com/Aeristoka))
* **Misc**: Updated instructions for the Discord integration
* **Misc**: Remove Toucan sponsorship and fix Discord logo from support page

---

Click [here](/Changelog) for the full Changelog of previous versions.