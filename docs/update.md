## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v2.4.1

I hope you like the new features, and hopefully the killer feature you were waiting for was just added.

If you enjoy using Beyond20 and find it useful for your games, please considerg [showing your appreciation](rations) by offering me some rations or your patronage.

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

{% include_relative known_issues.md %}

# Release Notes

v2.4.1
===

Hello everyone! We're releasing a small bugfix release that polishes some of the new features introduced in 2.4.0 and fixes some newly found bugs. 
This release was also necessary due to the recent changes in Roll20 who changed the way the character sheet template is detected, causing Beyond20 to revert back to the default template. This is unfortunately the third time they changed it in recent weeks (I mentioned that in the 2.4.0 release notes) and they kept switching back and forth between the old and the new method, so I wanted it to stabilize a bit first before releasing a fix. This update supports 3 different detection methods, so hopefully, we got you covered for the foreseeable future!

There are also a few new features in this release, such as support for Raging from a Druid/Barbarian Wildshape creature, or displaying a monster's non-attack traits. I'd recommend you check out the full [Changelog](/Changelog#v241) for details. 

In other news, I'm continuing my work on bringing integrations with D&D Beyond to make life easier for my users. This time, it's in the form of a source book conversion integration with [The Forge](https://forge-vtt.com). The feature is still in beta and available as early access to my Patrons, and you can see it in action here : [https://youtu.be/DkS7w7hkg3Y](https://youtu.be/DkS7w7hkg3Y)

Speaking of patrons, another thank you goes to all my [Patrons](https://patreon.com/kakaroto) and [ko-fi/github](/rations) supporters as well as to those who contributed code to this release: Thank you all!

Enjoy, and as always, happy dice rolling!


---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

v2.4.1 (April 25th 2021)
===
* **Feature**: Add support for Raging from a Wildshape creature (for Druid/Barbarian multiclassers)
* **Feature**: Add the ability to display NPC's traits in the VTT (non attack actions/features)
* **Feature**: Add support for using Utensils as tools (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Spirit Guardians (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Display the roll formula when doing a custom digital dice roll
* **Feature**: Add support for rolling Shadow Blade attacks as melee weapons when added as a custom action (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: *Roll20*: Fix OGL sheet template detection as Roll20 keeps changing it
* **Bugfix**: Fix and improve the handling of special spell and class features which was refactored in 2.4.0 (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix support for some monster attacks that use incorrect capitalization in the description (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Prevent Empowered Evocation damage from happening on non-Wizard spells (by [@cashoes](https://github.com/cashoes))
* **Bugfix**: Fix support for adding modifier to the superiority die of Parry and Rally Maneuvers (by [@tyler-macinnis](https://github.com/tyler-macinnis))
* **Bugfix**: Fix Sneak Attack being always rolled on Pshycic Blade regardless of setting (by [@atomicpeach](https://github.com/atomicpeach))
* **Bugfix**: Fix quick roll areas not registering clicks in some situations
* **Bugfix**: Fix hotkey settings tooltip not updating after modifying the hotkeys
* **Bugfix**: Correctly parse the 2d20kh1/2d20kl1 when rolling an attack with advantage/disadvantage in D&D Beyond's Digital Dice
* **Bugfix**: Fix misaligned Beyond20 icons in the monster statblocks of Encounters pages
* **Bugfix**: Fix spell icons duplicating when switching between similar monsters in the Encounters page
* **Misc**: Added release dates to the Changelog

---

Click [here](/Changelog) for the full Changelog of previous versions.