## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v2.4.6

I hope you like the new features, and hopefully the killer feature you were waiting for was just added.

If you enjoy using Beyond20 and find it useful for your games, please considerg [showing your appreciation](rations) by offering me some rations or your patronage.

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

{% include_relative known_issues.md %}

# Release Notes

Hi everyone. We're releasing today another bugfix release to Beyond20, due to recent changes to the D&D Beyond website with the arrival of the new [Underdark mode](https://www.dndbeyond.com/forums/d-d-beyond-general/news-announcements/113373-news-underdark-mode-for-character-sheets), which caused some features to stop working correctly. This release fixes the HP syncing as well as the broken special class abilities that were affected by the recent update to D&D Beyond's site.

Another exciting change in this release is a new styling for the roll results, which will show a much cleaner look when rolling into D&D Beyond's site or to your Foundry VTT game. If using FVTT and you have the Beyond20 companion module installed, make sure to update the module too. This change was contributed by [@LorduFreeman](https://github.com/LorduFreeman) and I'm really happy with the results!

Other than these bugfixes and the new styling, there's also a bunch of new special class features added, thanks to [@Aeristoka](https://github.com/Aeristoka) as usual, who has been the main contributor to this release! You can see all the new features in the [Changelog](/Changelog#v246).

Hopefully, there won't be any new bugfixes after this (Last month's multiple releases were annoying to us both!) and the next release, in a couple of months hopefully, will bring in some new major features.

As usual, thank you everyone for your support, and a special thank you to all my [Patrons](https://patreon.com/kakaroto) and [ko-fi/github](/rations) supporters, and for everyone who helped make this possible.

Enjoy, and happy rolling!

---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog
2.4.6 (July 7th 2021)
===

* **Feature**: Change the roll output's styling to look much nicer and be more in line with FVTT's own CSS styling (by [@LorduFreeman](https://github.com/LorduFreeman))
* **Feature**: Add support for Bard: Spiritual Focus (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Wizard: Durable Magic (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Warlock: Grave Touched (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mask of Shadow Elf Cunning Intuition (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix HP syncing not working anymore from the character sheet page (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix display/detection of spell damage types that would affect special abilities (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Clean up bogus damage types from some items (Arrow of Slaying) (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix rolling spell damages from spells that don't have a To Hit value (saving throws or healing) when force critical is enabled
* **Bugfix**: Only compute critical damages on attacks which include a To Hit value, even if force critical is enabled
* **Bugfix**: Fix issue with editing homebrew subclass descriptions which include dice formulas in them
* **Bugfix**: Remove extraneous html content introduced by Beyond20 in the editors of homebrew subclasses
* **Misc**: *FVTT*: Change the FVTT module to appear compatible with 0.8.8 and fix the change from `systems` to `system` in the module's metadata

---

Click [here](/Changelog) for the full Changelog of previous versions.