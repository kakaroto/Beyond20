## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v2.10.0

I hope you like the new features, and hopefully the killer feature you were waiting for was just added.

If you enjoy using Beyond20 and find it useful for your games, please consider [showing your appreciation](/rations) by offering me some rations or your patronage.

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

{% include_relative known_issues.md %}

# Release Notes

v2.10.0 (November 17th 2024)
===

Hi everyone,

It's time for another update to Beyond20. This release fixes some of the few parsing issues that have slowly crept up during the last month, due to D&D Beyond continuously changing their character sheets, but it also has a few new features as well.

Other than adding support for some of the new 2024 rules (new monsters, species, backgrounds, Great Weapon Fighting, Great Weapon Master, Polearm Master), it also finally properly implements Firefox's optional permissions API, allowing Firefox users to enjoy the same dynamic permissions as Chrome user had. This also removes for Firefox users the previously mandatory discord permissions and brings support for Roll20's Discord Activity on par with the Chrome implementation.

There's more work to be done in the next few weeks and months to continue supporting the new changes with the 2024 rules, but this is a very good starting point.
You can see the full list of changes in the [Changelog](/Changelog#v2100).

As usual, thank you to all contributors, especially [@dmportella](https://linktr.ee/dmportella), as well as to my generous [Patrons](https://patreon.com/kakaroto) and [Ko-fi/Github](/rations) supporters. 

Happy rolling!

---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

v2.10.0 (November 17th 2024)
===
- **Feature**: *Firefox*: Add support for optional permission requests, and remove mandatory Discord permissions
- **Feature**: Added support for 2024 edition of Great Weapon Fighting (by [@dmportella](https://github.com/dmportella))
- **Feature**: Added support for 2024 edition of Great Weapon MAster (by [@dmportella](https://github.com/dmportella))
- **Feature**: Added support for 2024 edition of Polearm Master (by [@dmportella](https://github.com/dmportella))
- **Feature**: Sent custom DOM API events to D&D Beyond pages
- **Feature**: Add support for species pages
- **Feature**: Add support for backgrounds pages
- **Bugfix**: Fix support for Monster actions using new terminology introduced in 2024 rules (by [@dmportella](https://github.com/dmportella))
- **Bugfix**: Fix support for character creatures (by [@dmportella](https://github.com/dmportella))
- **Bugfix**: Fix parsing of creature's HP
- **Bugfix**: Fix distinguishing between ability checks and saving throws
- **Bugfix**: Fix support for character conditons and exhaustion levels
- **Bugfix**: Fix DOM API message for custom domains when settings are updated
- **Bugfix**: Fix parsing of Emanate Wrath action
- **Bugfix**: Prevent parsing of dice formulas in user comments
- **Bugfix**: *FVTT*: Fix creating Beyond20 actors on Foundry VTT v12 (by [@zambo](https://github.com/zambo))
- **Bugfix**: *Firefox*: Fix support for Roll20 Discord Activity

---

Click [here](/Changelog) for the full Changelog of previous versions.
