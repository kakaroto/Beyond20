## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v2.21.0

I hope you like the new features, and hopefully the killer feature you were waiting for was just added.

If you enjoy using Beyond20 and find it useful for your games, please consider [showing your appreciation](/rations) by offering me some rations or your patronage.

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

{% include_relative known_issues.md %}

# Release Notes

v2.21.0 (August 25th 2026)
===

Hi everyone,

Today, we're releasing v2.21.0 with a new 2024 Bladesong option for Bladesinger wizards, as well as support for the Unarmed Fighting fighting style, and grave touch lock is not working on D&D Beyond.

We've also fixed versatile weapon quick-rolls, HP updates for legacy Roll20 games, and false-positive dice parsing for sourcebook labels such as D1 and D0.

You can read the full [Changelog](/Changelog#v2210) below to see all the changes included in this release.

As usual, a big thank you to [@dmportella/Gothyl](https://github.com/dmportella), [@jugarrit](https://github.com/jugarrit), and [@0xguy07](https://github.com/0xguy07) for their work on this release!

Enjoy!
=
v2.20.1 (June 7th 2026)
===

Hi everyone,

This time we're releasing a small hotfix for an issue introduced in the previous release. Users on Chrome who had duplicate rolls on Roll20 or who couldn't get their rolls sent to Roll20 after the extension is reloaded (such as after an update), should not be affected by those bugs anymore.

Thank you to [@dmportella/Gothyl](https://github.com/dmportella) and to[@0xguy07](https://github.com/0xguy07) who fixed the issues in this hotfix.

Have fun!
=
v2.20.0 (June 4th 2026)
===

Hi everyone,

Today's release adds a few small bugfixes to Beyond20, but also tackles a recent issue with the Roll20 website now using two slightly different URLs for the games.

This should get rid of the warning users would see, when they access their games through the new URL, which prevented Beyond20 from sending rolls to Roll20. 

You can read the full [Changelog](/Changelog#v2200) below to see all the changes included in this release.

As usual, a big thank you to [@dmportella/Gothyl](https://github.com/dmportella) and to[@raystuart](https://github.com/raystuart) for their work on this release!
Thank you as well to our generous [Patrons](https://patreon.com/kakaroto) and [Ko-fi/Github](/rations) supporters.

Enjoy!

---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

v2.20.2 (August 25th 2026)
===
- **Feature**: *dndbeyond*: Add support for the 2024 Wizard: Bladesinger: Bladesong feature (by [@jugarrit](https://github.com/jugarrit))
- **Feature**: *dndbeyond*: Add support for the Unarmed Fighting fighting style (by [@dmportella](https://github.com/dmportella))
- **Bugfix**: *dndbeyond*: Fix versatile weapon quick-rolls selecting the wrong damage type (by [@dmportella](https://github.com/dmportella))
- **Bugfix**: *Roll20*: Fix HP updates for legacy games (by [@dmportella](https://github.com/dmportella))
- **Bugfix**: Fix false-positive dice parsing for bare D1 and D0 labels (by [@0xguy07](https://github.com/0xguy07))

v2.20.1 (June 7th 2026)
===
- **Bugfix**: *Roll20*: Fix duplicate messages in Chrome for Roll20 (by [@dmportella](https://github.com/dmportella))
- **Bugfix**: *Roll20*: Fix detection of some Roll20 tabs when reloading the extension while the Roll20 tab is already open (by [@0xguy07](https://github.com/0xguy07))

v2.20.0 (June 4th 2026)
===
- **Feature**: *Roll20*: Add detection and support for the new Roll20 game URL without a trailing slash (by [@dmportella](https://github.com/dmportella))
- **Bugfix**: Fix support for new Elemental Affinity formula damage (by [@raystuart](https://github.com/raystuart))
- **BugFix**: Fix dice formula parsing when it uses a unicode character for the negative sign (by [@dmportella](https://github.com/dmportella))
- **Bugfix**: Fix support for Versatile weapons and conditional damage for spells (by [@dmportella](https://github.com/dmportella))
- **Bugfix**: Fix display for Toll the Dead spell (by [@dmportella](https://github.com/dmportella))


---

Click [here](/Changelog) for the full Changelog of previous versions.
