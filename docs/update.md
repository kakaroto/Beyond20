## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v2.9.1

I hope you like the new features, and hopefully the killer feature you were waiting for was just added.

If you enjoy using Beyond20 and find it useful for your games, please considerg [showing your appreciation](/rations) by offering me some rations or your patronage.

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

{% include_relative known_issues.md %}

# Release Notes
v2.9.1 (July 5th 2023)
===

Hi again everyone!

We're releasing the 2.9.1 update for your favorite extension already! This is a very small bugfix release, which is released urgently as it addresses a critical issue with Roll20.
Earlier today, Roll20 have changed something in their app's URL which causes Beyond20 to stop recognizing it, this update should fix that.
There's also a few small fixes to the "Display Avatar" feature that also snuck in as they were fixed recently as well.

We hope Roll20 don't change anything further and the extension continues to work for months to come.

As usual, thank you to all contributors, as well as to my generous [Patrons](https://patreon.com/kakaroto) and [Ko-fi/Github](/rations) supporters, who are making this all possible. 

Thanks and enjoy!

v2.9.0 (June 24th 2023)

Hi Beyond20 lovers!

It's time for another update to your favorite extension! This one has been cooking for a long time, and there's many reasons for that.

The OGL scandal from WotC in January has definitely had a negative impact on the community as a whole, but Beyond20 has also never been so stable and in need of so little maintenance. While the extension is pretty much "feature complete" at this stage, and the very few bugs that have been reported were not critical, we've still worked to bring a new exciting feature which I think might open up Beyond20 to even more future possibilities.

This update brings a few corrections to small bugs that have been reported in the last months, as well as the addition of some new features. I encourage you to check the [Changelog](/Changelog#v290) for the full list of changes. The big chunk of this update though is the new ability for websites to integrate with Beyond20, not just as a VTT, but also as character sheets. This means that Beyond20 can become the glue that connects any character sheet website to any VTT website.

In order to make that possible, an extensive documentation of our [API](/api) has been written and this should hopefully allow various websites to send their rolls to Beyond20, letting it pass along that data to the player's VTT, making it a truly universal extension. I have heard from quite a few websites who are excited to bring the ability to roll from their sheets to any VTT via Beyond20!

I expect, as more websites start supporting Beyond20, that we'll see additional improvements to the API and a possible increase in activity to support various use cases that may be non-d&d specific.
I can't wait to see what the future brings and how Beyond20's horizon gets expanded with this new feature.

As usual, thank you to all contributors, as well as to my generous [Patrons](https://patreon.com/kakaroto) and [Ko-fi/Github](/rations) supporters, who are making this all possible. 

Thank you everyone and keep on rolling!😄

---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

v2.9.1 (July 5th 2023)
===

- **Bugfix**: *Roll20*: Fix detection of Roll20 tab after today's Roll20 change to their app's URL
- **Bugfix**: Fix the "Display avatar" option on a character sheet when digital dice are enabled
- **Bugfix**: *Roll20*: Fix display of avatars with the default sheet option
- **Bugfix**: *FVTT*: Correct open a popup dialog for a shared avatar when using digital dice

v2.9.0 (June 24th 2023)
===

* **Feature**: Add support for custom sheet websites to send rolls to VTTs through Beyond20
* **Feature**: Added full [API](/api) documentation for Beyond20 internal messaging and DOM events
* **Feature**: Add support for custom modifiers/damages to Wild Shape extra creatures
* **Feature**: Add support for posting read-aloud text to Discord
* **Feature**: Add support for Radiant Soul from Celestial Aasimar (MotM) (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add a hotkey to display attack instead of rolling it
* **Bugfix**: Send rolls to game log as "Self" when whispering
* **Bugfix**: Fix Rage damage not applying to Wild Shape extra creatures anymore
* **Bugfix**: Fix freeze when the game log sidebar is locked in the encounters page
* **Bugfix**: Remove special support for Otherworldly Glamour for skill checks as DDB implemented it on their side, which caused it to double the bonus (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Change behavior of Vicious Weapon Damage to only display on critical hits as it only triggers on a roll of 20
* **Bugfix**: Fix parsing of DDB dice formulas that include tooltips
* **Bugfix**: Fix Beyond20 icon alignment in buttons
* **Bugfix**: *FVTT*: Remove deprecation warnings for Foundry VTT v10
* **Misc**: A few cleanups in how events are sent to make for a cleaner API
* **Misc**: Added a few websites to the list of known VTT/Sheet domains for future implementation support
* **Misc**: Add osrbeyond.com, codex.dragonshorn.com and dscryb.com to the list of known VTT/Sheet domains for their upcoming integration with Beyond20.


---

Click [here](/Changelog) for the full Changelog of previous versions.