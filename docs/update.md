## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v2.4.3

I hope you like the new features, and hopefully the killer feature you were waiting for was just added.

If you enjoy using Beyond20 and find it useful for your games, please considerg [showing your appreciation](rations) by offering me some rations or your patronage.

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

{% include_relative known_issues.md %}

# Release Notes

2.4.3
===

I'm really excited about this Beyond20 update, as it adds a feature I've been wanting to add for a long time.

While this is marked as 2.4.2, which means it's a "minor" update, it's actually got some really major features, like the ability to roll from source books and classes pages, and a newly added support for roll tables (give the treasure tables in the DMG a try)!

This release also adds support for the latest Foundry VTT stable version 0.8.6 which was released today, so for those of you who have updated your Foundry to the latest release, you'll be able to use Beyond20 without problems.
If you haven't seen the latest Foundry update video (with a nice feature tour of the VTT), I recommend you check out the video on Foundry's youtube : [https://www.youtube.com/watch?v=nuyzLlk_QQQ](https://www.youtube.com/watch?v=nuyzLlk_QQQ) and of course, if you want to enhance that gaming experience even further and get the best hosting there is, with plenty of awesome features on top, you have to drop by to [The Forge](https://forge-vtt.com) and subscribe! 😄

Among other smaller bugfixes, a long standing bug that was fixed in this release is the one where dice formulas in the class features list or action snippets might get split in two and appear as two separate formulas. I finally managed to figure out a way to fix that bug, so hopefully there are no more issues there.

Overall, I'm quite happy with this release, and I suggest you check out the [Changelog](/Changelog#v242) for the full list of changes (a small/readable changelog for once).
I have recently posted a [status update](https://www.patreon.com/posts/status-update-51779621) on my Patreon that lists my current projects and plans for the short term, if anyone is curious and/or interested in giving it a read.

Thank you to all my [Patrons](https://patreon.com/kakaroto) and [ko-fi/github](/rations) supporters, and for everyone who helped make this possible.

Thank you all for using this software and for being part of this amazing community.
Enjoy, and keep rolling!

**UPDATE**: Oups, a small (but critical) bug slipped through 2.4.2 released earlier today. The 2.4.3 release should fix it along with a couple of other small bugs discovered.

---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog
v2.4.3 (June 1st 2021)
===

* **Feature**: Add support for the roll tables in character sheets too
* **Bugfix**: Fix a crash that happened on the long rest dialog
* **Bugfix**: Fix settings not propagating to source and classes pages
* **Bugfix**: Fix the merging of two adjacent formulas within ddb tooltips not working in all use cases

v2.4.2 (June 1st 2021)
===

* **Feature**: Add the ability to roll from formulas in source book pages
* **Feature**: Add the ability to roll from formulas in classes pages
* **Feature**: Add the ability to parse roll tables and roll their results directly to the VTT
* **Feature**: *FVTT*: Add support for Foundry VTT 0.8.x new Dice API
* **Feature**: Add support for advantage/disadvantage badges on death saves (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add suport for Ranger: Natural Explorer (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Roll critical damage dice when using the "Force Critical" option and rolling damages only
* **Feature**: Add the ability to parse and roll formulas with multiple different dice in them (1d10+1d8 for example, instead of 1d10+mod)
* **Bugfix**: Fix roll dice in feature snippets that are split into two separate rolls due to tooltips (Deflect Missiles, Talons, Radiance of the Dawn, Hands of Healings, etc...)
* **Bugfix**: Fix dice duplication in the Foundry VTT 0.7.x with Dice So Nice module, when using dice pools
* **Bugfix**: Fix Brutal Critical for Perfect rolls Homebrew critical rule (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix Brutal Critical processing non weapon damage for the dice selection (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix the death save icon not appearing upon page reload
* **Bugfix**: Fix custom dice in action snippets disappearing after a side panel is opened
* **Bugfix**: Fix missing settings variable when rolling from an equipment/magic item page
* **Bugfix**: *Firefox*: Fix extension options scrollbar flickering on Firefox
* **Bugfix**: *Roll20*: Fix character name showing as "null" in Roll20 in some instances


---

Click [here](/Changelog) for the full Changelog of previous versions.