## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v2.7.0

I hope you like the new features, and hopefully the killer feature you were waiting for was just added.

If you enjoy using Beyond20 and find it useful for your games, please considerg [showing your appreciation](/rations) by offering me some rations or your patronage.

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

{% include_relative known_issues.md %}

# Release Notes

Hi all, it's time for a Beyond20 update!

This update is being released in a bit of a rush as today, D&D Beyond made a change to the character sheets which broke the detection of the character name, breaking HP syncing among other things. 

That being said, this is not just another small bugfix release, as this release is packed with many new features, as well as many other bugfixes.

I'm super excited about one of the features that's been brewing for a very long time, and it's the ability to let users enter a custom URL to load Beyond20 on, making it send its parsed and rendered rolls to any website. While this won't be immediately useful to you, it will open the path for any VTT to implement support for Beyond20 natively, or for other smaller extensions to bridge the gap between Beyond20 and other VTTs. I can't wait to see what comes out of this feature.

Another big change is to the Roll20 combat tracker support, as it will now hide the monster names by default, to avoid spoilers, but it will also be able to match tokens to multiple monsters with the same name without the need to add the "(A)", "(B)", etc.. prefixes to every token. 

This release adds a total of 8 new features and fixes 7 issues. Please refer to the [Changelog](/Changelog#v270) for the full details of the changes.

As usual, thank you to all contributors, as well as to my generous [Patrons](https://patreon.com/kakaroto) and [Ko-fi/Github](/rations) supporters, who are making this possible. 

Happy rolling!

---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

v2.7.0 (June 18th 2022)
===

* **Feature**: Add the ability to specify custom domains to load Beyond 20 on, opening the path for other VTT websites to natively add support for Beyond20.
* **Feature**: *Roll20*: Add support for auto-selecting monsters of the same name in the combat tracker when running an encounter with multiple instances of the same monster
* **Feature**: *Roll20*: Add option to show "Unknown Creature" (customizable) in the combat tracker for monsters not mapped to a token
* **Feature**: *Roll20*: Add an option to use the Beyond20 roll renderer without digital dice, allowing nicer and more customizable attack and damage outputs, with totals calculation
* **Feature**: Add support for displaying Feats to the VTT from the Feats page (by [@IsaacAbramowitz](https://github.com/IsaacAbramowitz))
* **Feature**: Specify the exact damage type for Genie's Wrath (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Artificer's Arcane Jolt on Infused weapons (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for extra damage on natural 20s for Vicious Weapons (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix parsing of monster attacks which deal constant damage with no dice formula
* **Bugfix**: Add Crimson Rite damage to Polarm Master Bonus Attacks (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix character name detection caused by last DDB character sheet update
* **Bugfix**: Fix issue displaying result of non-standard dice (d3) when rolling with Digital Dice enabled
* **Bugfix**: Fix display of total damages in versatile attacks that displayed total 1-handed and total 2-handed uselessly
* **Bugfix**: Fix setting changes not properly propagating to open items and equipment pages
* **Bugfix**: *Roll20*: Fix issue with the combat tracker when matching multiple enemies with the same name where each turn, the token associated could be different


---

Click [here](/Changelog) for the full Changelog of previous versions.