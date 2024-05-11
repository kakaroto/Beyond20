## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v2.9.3

I hope you like the new features, and hopefully the killer feature you were waiting for was just added.

If you enjoy using Beyond20 and find it useful for your games, please considerg [showing your appreciation](/rations) by offering me some rations or your patronage.

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

{% include_relative known_issues.md %}

# Release Notes

v2.9.3 (May 10th 2024)
===

Hi again,

D&D Beyond have updated their website once more on May 7th, which broke the ability to roll saving throws, ability checks, initiative, and spells.
As this is the second breaking update in 2 weeks and it took over a week last time to get the new update approved on the Firefox and Edge stores, I've reached out to the D&D Beyond team to work together to avoid this situation in the future. While waiting for their team to reach out, we've also seen DDB revert their website changes on May 9th, but only for a short period of time, before breaking the extension again. This made me very weary on pushing an update prematurely if the site was in constant flux.

At this time, as it's been 3 days (thanks everyone for your patience), I've decided to release a fix and I made sure that the new update would continue to function without breaking, even if DDB reverts their website back again to the older version, so this should satisfy everybody.

I'm keeping a close eye on the situation, and I expect to be in contact again with the DDB team soon so that future updates can have a minimal impact on your games.

Thanks for everyone who helped out with this issue and provided support on Github and Discord. And as usual, thank you as well to all contributors and to my generous [Patrons](https://patreon.com/kakaroto) and [Ko-fi/Github](/rations) supporters.

Enjoy!

v2.9.2 (April 24th 2024)
===

Hi everyone, long time no see!

Today, D&D Beyond has released an update to their character sheets which unfortunately broke Beyond 20 support as many things have changed behind the scenes, making it unable to parse the sheet and make rolls.
This hotfix update fixes that and restores full Beyond 20 functionality, as well as adds a few other bugfixes to the extension and some small new features (See [Changelog](/Changelog#v292) for the full list).
Hopefully I didn't miss anything and it won't break again in the near future, but if D&D Beyond are going to push additional updates, I thank you all in advance for your patience and I promise to be on top of things and release fixes as soon as humanly possible!

In other news, I have been working on Beyond20 recently to add a new cool feature, but it's not yet ready for release. I'm quite excited about this and I can't wait to show you all what we've been cooking up in secret 🤫!

For now, enjoy this small update, and stay ready for a larger upcoming release!

As usual, thank you to all contributors, as well as to my generous [Patrons](https://patreon.com/kakaroto) and [Ko-fi/Github](/rations) supporters, who are making this all possible and keep me motivated. 

Thanks and happy rolling!


---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

v2.9.3 (May 10th 2024)
===
- **Feature**: Allow extensions to send rolls to Beyond20 via the custom DOM API through DDB pages
- **Bugfix**: Fix rolling of spells, initative, ability checks and saving throws, due to DDB character sheet change from May 7th's website update
- **Misc**: Add link to the Edge store on the install page

v2.9.2 (April 24th 2024)
===
- **Feature**: Added support for NPC healing actions, such as the Unicorn (by [@lunethefirst](https://github.com/lunethefirst))
- **Feature**: Prompt for Concentration check if character is War Caster and a Constitution save is rolled (by [@rthorpeii](https://github.com/rthorpeii))
- **Feature**: Add support for clicking on the Digital Dice Versatile damage button to roll damage two handed
- **Feature**: Add a "Display to VTT" button for Blood Curse of the Eyeless feature
- **Feature**: Add support for using a service worker and switch to the Manifest V3 extension specification for Chrome/Edge browsers
- **Bugfix**: Fix character sheet parsing due to updated D&D Beyond website on April 24th 2024 which broke weapon rolls, spells, skills, death saves and other side effects
- **Bugfix**: Fix Digital Dice advantage/disadvantage rolls being summed when the results are identical 
- **Bugfix**: Fix rolling hemocraft die for Blood Curse of the Eyeless
- **Bugfix**: Fix issue rolling a custom skill check with a +0 modifier when rolling with advantage/disadvantage from Digital Dice context menu
- **Bugfix**: Fix a typo which may have caused quick roll buttons for damage only rolls to do a full attack
- **Bugfix**: Fix empty damage type for Chaos Bolt
- **Bugfix**: Fix Circle of Mortality setting label from Death Domain to Grave Domain (by [@Bracciata](https://github.com/Bracciata))
- **Bugfix**: Improve display of damage restrictions by adding a space between the damage type and the restriction
- **Bugfix**: Improve display of various roll results which include extra information between parenthesis to be preceded by a space (by [@Bracciata](https://github.com/Bracciata))
- **Bugfix**: *FVTT*: Fix rolling Chaos Bolt on Foundry using Native Rolls due to missing damage type


---

Click [here](/Changelog) for the full Changelog of previous versions.