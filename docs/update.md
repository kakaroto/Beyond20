## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v2.9.4

I hope you like the new features, and hopefully the killer feature you were waiting for was just added.

If you enjoy using Beyond20 and find it useful for your games, please considerg [showing your appreciation](/rations) by offering me some rations or your patronage.

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

{% include_relative known_issues.md %}

# Release Notes

v2.9.5 (JuLy 27th 2024)
===

Hi everyone,

Another bugfix release for Beyond20, to fix various rolls which broke after D&D Beyond progressively updated their character sheets in the recent weeks, which eventually broke rolling ability checks, saving throws, initiative, character actions, class features, feats, and the parsing of spell sources. 

This release also works around a bug in Foundry's v12 dnd5e system which prevented the rolls from Beyond20 from appearing in the chat log.

After multiple pokes, and waiting more than reasonable, it appears that D&D Beyond has no interest in re-establishing communications with the Beyond20 team and ensuring the extension remains compatible with their continuous changes to the website. It is certainly a great disappointment to be honest, but it is what it is, unfortunately.

This release is dedicated to [@dmportella](https://linktr.ee/dmportella) from the community who has stepped up in the past couple of weeks, submitted all the fixes for the extension and helped with github issues. A huge huge thank you for taking care of things while I was incapacitated, and I'd recommend people [buy him a coffee](https://ko-fi.com/gothyl) instead of me this time around! 

As always, thank you everyone who contributed to the project, including my generous [Patrons](https://patreon.com/kakaroto) and [Ko-fi/Github](/rations) supporters.

Enjoy!

---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

v2.9.5 (JuLy 27th 2024)
===
- **Bugfix**: Fix support for rolling Initiative (by [@dmportella](https://github.com/dmportella))
- **Bugfix**: Fix support for rolling Ability checks (by [@dmportella](https://github.com/dmportella))
- **Bugfix**: Fix support for rolling Saving Throws (by [@dmportella](https://github.com/dmportella))
- **Bugfix**: Fix support for rolling Character Actions (unarmed strike, vampirire bite, etc..) (by [@dmportella](https://github.com/dmportella))
- **Bugfix**: Fix support for rolling Class features and Feats (by [@dmportella](https://github.com/dmportella))
- **Bugfix**: *FVTT*: Fix roll data in chat messages failing to display on recent dnd5e system (by [@AlanWaiss](https://github.com/AlanWaiss))
- **Bugfix**: Fix parsing of a spell's source, which was required for class specific spell modifiers, like the Artificer's Arcane Firearm.
---

Click [here](/Changelog) for the full Changelog of previous versions.