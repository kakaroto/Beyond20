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

v0.8
===

Another update already! This was meant to be a small bugfix release, but I still managed to add nice set of new features as well. The one I'm most happy about is the Quick Rolls feature which lets you roll ability checks, actions/weapons/spells directly from the main page without having to open the side panel first then click on the beyond20 icon. I am most happy about the fact that I managed to do this without adding tons of new dice icons everywhere in the character sheet. All you need to do is click on the ability/save/skill modifier or the icon next to the attack (or the small 'Cast' button next to spells) to have the Quick Roll happen. Conveniently, a Beyond20 icon will appear as a tooltip above the areas that are considered quick rolls to make them recognizable. You can still click anywhere else (where the tooltip doesn't appear) to open the side panel normally without auto-rolling. The option can also be disabled of course in case you don't like it, but I expect this will be a fan favorite!

I have also added support for super advantage and super disadvantage rolls (and roll thrice for FVTT users or those using the Dice roller). That was a compromise in trying to add support for the Elven Accuracy feat which was very difficult to get right. Note that on Roll20, if you use the 'D&D 5e by Roll20' character sheet template, there is no way of rolling a third dice, so 'roll thrice' acts as a 'roll twice', but the 'super advantage/super disadvantage' modes will work just fine as it will actually roll 3 dice even though only two are shown, the second roll box will be an advantaged/disadvantaged roll. You can hover on that box to see all the dice results.

Last major feature that was added is the condition tracking for the character sheets. If using FVTT and you have the Beyond20 FVTT module (which you should), then update the module as it will allow you to automatically set condition status effects on the tokens. For Roll20 unfortunately, I never understood any of their status effect icons and I didn't want to choose some as representing specific D&D conditions as I expect everyone has their own interpretation of each icon's meaning.

Finally, I've fixed a bunch of bugs from the last release, and added support for a new Paladin class feature and handling for three special spells. As usual, I suggest you check out the full [Changelog](Changelog#v08) for more details.

Also, as usual, I'll thank everyone who helped, supported this project, reported bugs or gave feature suggestions, or just spread the word about this extension to their friends and gaming groups. A special thank you as always to [my Patrons](https://patreon.com/kakaroto) who are always motivating me to keep doing what I love!

Happy Rolling!

---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

* **Feature**: Add Quick Rolls feature to quickly roll skills, attacks, spells from the main page directly
* **Feature**: Add support for Super Advantage and Super Disadvantage rolls
* **Feature**: Track Character Condition changes and display them in the VTT
* **Feature**: Add roll type option of always rolling three twice instead of twice (For Elven Accuracy Feat; limited support on Roll20)
* **Feature**: Cache the To-Hit value of weapons attacks so they can be rolled from the Equipment page
* **Feature**: Add support for the Paladin's Improved Divine Smite extra radiant damage
* **Feature**: Add support for special spell: Absorb Elements (Doesn't duplicate all the damage types)
* **Feature**: Add support for special spell: Life Transference (Shows healing amount on FVTT, clarifies the value on Roll20)
* **Feature**: Add support for special spell: Toll the Dead (Queries if the target is missing hit points)
* **Feature**: *Roll20*: When rolling initiative with 'add to tracker' enabled and 'roll twice' (or thrice), queries the user for advantage mode
* **Feature**: *FVTT*: Map Character Conditions to status effects (Requires Beyond20 FVTT module version 0.7+)
* **Bugfix**: *Roll20*: Fix the 'incognito' whisper mode where the monster name was leaked with the 'Speaking As' feature
* **Bugfix**: Fix inability to roll when opening the character sheet for the first time with a mobile or tablet layout
* **Bugfix**: Fix duplication of the "Roll initiative" lines in stat blocks when switching monsters in the My Encounters page
* **Bugfix**: Fix the spell name for concentration or ritual spells since the recent change to D&D Beyond content
* **Bugfix**: Fix Great Weapong Fighting dice reroll being mistakenly applied on some two-handed non-melee weapons
* **Bugfix**: Fix the spell level/school display missing spaces introduced in the recent code refactor of v0.7
* **Bugfix**: Fix character action list not being properly cached which may lead to loss of character options on mobile
* **Bugfix**: Fix parsing of stat block attacks for Clay Gladiator and Scout which had typos in the official D&D Beyond pages
* **Bugfix**: Fix Spell Attack roll which show displayed the modifier instead of rolling the 1d20
* **Bugfix**: *FVTT*: Fix dice roll formulas in descriptions not being clickable in FVTT 0.4.x
* **Bugfix**: *Dice Roller*: Fix display bug on rolls after opening the quick settings dialog
* **Bugfix**: Fix full settings window opening donate link inside the iframe instead of a new tab

---

Click [here](/Changelog) for the full Changelog of previous versions.