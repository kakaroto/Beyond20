## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v0.7

I hope you like the new features, and hopefully the killer feature you were waiting for was just added. In that case, maybe you want to [show your appreciation](rations)?

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

Some issues are known to me and are being worked on, others might be caused by a new feature that was just added in the latest update and I'm facepalming at not catching it before I made the release. 

Head over to the [github issue tracker](https://github.com/kakaroto/Beyond20/issues) to see the list of known issues.

If you find an issue that isn't in the list, I'd appreciate you letting me know about it (either by creating one, or by reaching out to me over on [Discord](https://discord.gg/ZAasSVS)!

# Release Notes


The #ThankYouPatrons release!

This release is dedicated to my generous [patrons](https://patreon.com/kakaroto) who are making this possible by supporting my projects. Today (November 19th) is the [#ThankYouPatrons event](https://www.thankyoupatrons.com) organized by Patreon. As I asked recently my patrons which projects they would like me to focus on, I was surprised to see Beyond 20 at the top of the poll results, so I've worked day and night to making this release possible for today in order to celeberate all those who have generously given me their support.

As a way of thanking them for their support, I've made this a big release with some major improvements and new features. The most important of which is the addition of a new Dice Roller for anyone using D&D Beyond without a Virtual TableTop (or using one that isn't supported by Beyond20).

I have also added a new option for how critical hit dice are calculated so you can select some of the more used homebrew rules instead of the D&D 5e PHB rules. I unfortunately could not add a 'double dice result' option even if I know it's a popular one, because the way Roll20 does its rolls makes it impossible. 

I've also added Beyond 20 button for quickly accessing the settings in both the VTT and the D&D Beyond pages. I've realized that many users never noticed that they can click on the Beyond20 icon in the toolbar to get character specific options, so I hope this makes it much more visible to everyone and makes it easier to access and use as well.

The new support for many of the special class features is another important change : You can now enable through the quick settings menu the following features : Bloodhunter's Crimson Rite, Ranger's Dread Ambusher, Paladin's Legendary Strike, Warlock's Hexblade's Curse and the Rogue's Assassinate.

There are many other smaller improvements or bugfixes, and I invite you to check out the full [Changelog](Changelog#v07) for more details.

Thank you to everyone who submitted their feature requests or reported bugs they found, please continue to do so and I'll be happy to tackle those as soon as possible.

And finally, again and always, a special thank you to [my Patrons](https://patreon.com/kakaroto) who are making this possible and for everything they've done for me!

Happy rolling!

---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

* **Feature**: Add a Dice Roller within D&D Beyond for players not using Roll20 or FVTT
* **Feature**: Add option for alternate critical damage calculations based on common homebrew rules
* **Feature**: Add an 'incognito' monster whisper mode where rolls are displayed but monster name and action names are hidden
* **Feature**: Add a 'Roll Initiative' button to monster/vehicle stat blocks (rolls dexterity but allows adding to tracker)
* **Feature**: Add a "Roll Twice" option when querying the user for advantage.
* **Feature**: *Chrome*: Add a Beyond 20 button to D&D Beyond and VTT pages for easy access to quick settings
* **Feature**: Open the 'More Options' link as dialogs within the page instead of opening the browser's extension page
* **Feature**: Add support for Bloodhunter's Crimson Rite feature
* **Feature**: Add support for Ranger's Dread Ambusher feature
* **Feature**: Add support for Paladin's Legendary Strike (UA) feature
* **Feature**: Add support for Warlock's Hexblade's Curse feature
* **Feature**: Add support for Rogue's Assassinate feature
* **Feature**: *FVTT & Dice Roller*: Standardize appearance of chat messages when using simple rolls
* **Feature**: *FVTT & Dice Roller*: When rolling with advantage/disadvantage, display both rolls instead of only the result
* **Bugfix**: *Roll20*: Fix Brutal Critical/Savage Attacks brutal damage not being rolled on some critical rolls
* **Bugfix**: *Roll20*: It seems Beyond 20 now works in Roll20's popped out chat window
* **Bugfix**: *FVTT*: Show the world's title instead of its name in the browser's tab title
* **Bugfix**: *FVTT*: Critical hits of 18 or 19 (due to Improved or Superior Critical features) now appear green as expected
* **Bugfix**: Make parser for monster actions in stat blocks less rigid so it can find action names in some homebrew monsters
* **Bugfix**: Fix item/feature or spell descriptions not being properly displayed when they contain lists
* **Misc**: Use non-intrusive notification when opening a character sheet and no VTT window is found
* **Misc**: Add monster specific options to a monster page's quick settings menu
* **Misc**: Fix typos of "Save Attacks" instead of "Savage Attacks"
* **Misc**: Using the new in-page quick settings dialog, setting a custom dice formula and dismissing the dialog will now accept the change
* **Misc**: Updated donate link to redirect to beyond20.here-for-more.info/rations instead of paypal.me/kakaroto
* **Misc**: *FVTT*: Major refactor of how message rendering is done internally to allow for the dice roller to work

---

Click [here](/Changelog) for the full Changelog of previous versions.