## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version : v2.0

I hope you like the new features, and hopefully the killer feature you were waiting for was just added.

If you enjoy using Beyond20 and find it useful for your games, please considerg [showing your appreciation](rations) by offering me some rations or your patronage.

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

Some issues are known to me and are being worked on, others might be caused by a new feature that was just added in the latest update and I'm facepalming at not catching it before I made the release. 

{% include_relative known_issues.md %}

Head over to the [github issue tracker](https://github.com/kakaroto/Beyond20/issues) to see the full list of currently known issues.

If you find an issue that isn't in the list, I'd appreciate you letting me know about it (either by creating one, or by reaching out to me over on [Discord](https://discord.gg/ZAasSVS)!

# Release Notes

v2.0
===

Hi and welcome to the Two-Point-Oh release of Beyond20!

This is yet another major release version of Beyond20. I have decided to make the jump directly to the 2.0 version because of just how massive this release is and the amount of work that went into it. One of the big changes and which took the most time was a near rewrite of the entire extension into pure Javascript, making the move from the python-like Rapydscript language that I used previously. The change makes Beyond20 generally better, easier to work with and maintain long term.

I usually say this at the end, but this time, I want to start by giving a very special thank you to all my [patrons](https://www.patreon.com/kakaroto) and all the generous people who supported my work by sending rations through [Ko-fi](https://ko-fi.com/kakaroto) or other means. Without you, I wouldn't have had the courage and motivation to spend this much time working on making this release, especially with how busy and chaotic my life has been in the last few months.

As some of you may already know, I've worked relentlessly in the past few months on my new D&D related project and new business venture, [The Forge](https://forge-vtt.com), which is a hosting service for [Foundry VTT](https://foundryvtt.com) games. With Foundry VTT officially releasing just last week (on May 22nd) and me doing my best to [release The Forge](https://www.patreon.com/posts/release-party-37398469) on the same date, it has been a very stressful and chaotic time, but the launch went smoothly and I'm very happy with the results so far. I have still managed to take the time every few days and dedicate myself to working on Beyond20, and that has paid off greatly with this release being ready so soon and being so extensive.

Another big and important thing to mention relating to this release is the number of external contributions that were received, making Beyond20 greater than one man's work. Some of the contributions were small, others were large, and others were non quantifiable. We now have new amazing artwork, made by [Jerry Escandon](https://github.com/Jerryescandon) that makes the Beyond20 icons look beautiful and sleek and much nicer at the low resolutions needed by Beyond20. We've also had code contributions by [@Brunhine](https://github.com/Brunhine), [@spisin](https://github.com/spisin), [@kbuzsaki](https://github.com/kbuzsaki), [@Ainias](https://github.com/Ainias) and last but not least [@Aeristoka](https://github.com/Aeristoka). Aeristoka has also been a huge help in systematically testing every feature of Beyond20 after the rewrite of the extension and reporting all the bugs he could find as well as fixing many of them himself. What this means is that if you find a bug, you can now blame Aeristoka, not me!🤣

I know that some of you may have wanted to see this release appear sooner, especially with the D&D Beyond Digital Dice release that affected our Quick Rolls feature, but let me give you a little bit of perspective before diving into the new features in this release.

So far in nearly one year, up to the 1.1 release last month, 173 issues (bugs and feature requests) were opened on the issue tracker with most of them being closed over that same period of time. In the last 8 weeks alone, we've had 152 new issues created and closed. Here's a little table (for those who like statistics) showing how many changes (according to the github commit log history) each version had and how long it took to prepare that release.

| Release | Code changes | Development time |
|---------|--------------|------------------|
| 0.8     | 30 commits   |  17 days         |
| 0.9     | 37 commits   |  69 days         |
| 1.0     | 37 commits   |  32 days         |
| 1.1     | 24 commits   |  24 days         |
| 2.0     | 161 commits  |  53 days         |

Oh and by the way, Beyond20 now has over 132 000 users which is just incredible! 🥳

Now let's get down to the interesting bits. What does this release bring you?

You should definitely check out the full [Changelog](/Changelog#v20) to see all of the new features and bugfixes that this release brings. I personally think the most important new feature is the rewrite to Javascript, but none of you will care about that, so you'll probably be most excited about the integration with D&D Beyond's amazing new Digital Dice feature. You can now do all your rolls using the dice from D&D Beyond, and have it roll all your To Hit and Damage dice and send all of the results to your VTT of choice.

The other big change, is with regards to Discord Integration. I promised you last time, that I would enhance the features of the Discord integration, and I did. It is still not as complete as I would hope, but it should hold you over until the next round of features are added. You can now add multiple Discord destination channels to Beyond20 and choose where you want the rolls to go. You can also give a friendly name to the channel so you don't need to remember which secret key goes to which channel. I have also added support for specifying a channel dedicated to whispers when creating your secret key, as well as specifying options, the only one available now being the ability to disable the spoiler tags for the roll formulas. See the updated instructions on the [Discord](/discord) page for more information.

Another change that I am very happy about is the automatic detection of the character sheet template used on Roll20. We've had so many people asking about "why does Beyond20 send an empty message" and us having to point them to the [FAQ](/faq) that I've had to tackle that issue and make Beyond20 smarter. Now if your game is not using the 'D&D 5e By Roll20' character sheet template, then it will automatically use the default template instead. This also applies when using pre-rendered rolls when you roll using the Digital Dice.

Finally, I'd like to reiterate my thank you to all who have sent me rations/coffees through the [Ko-fi](https://ko-fi.com/kakaroto) link or who pledged on [Patreon](https://patreon.com/kakaroto) through my [support](/support) page.

If you find Beyond20 useful to you and it helps you run your games more smoothly, please consider [supporting](/rations) me and Beyond20.

Thank you, stay safe, and, as usual, happy rolling!


---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

* **Feature**: Add integration with the D&D Beyond Digital Dice
* **Feature**: Update the Beyond20 icon sets to make them more beautiful and usable at low resolutions. Icons provided by [Jerry Escandon](https://github.com/Jerryescandon)
* **Feature**: *Discord*: Add a channel manager for Discord secret keys to allow easily switching channel destinationse](https://github.com/Brunhine))
* **Feature**: *Discord*: Add support for whispered rolls in the Discord integration
* **Feature**: *Roll20*: Automatically check for character sheet template and display the roll according to the campaign setting
* **Feature**: Add quick roll button to Initiative
* **Feature**: Add ability to send pre-rolled dice using the Digital Dice to Foundry and Roll20
* **Feature**: *Discord*: Add support for customizing rolls (no spoiler tags) when requesting a secret key from the Discord Bot
* **Feature**: *Discord*: Hide monster name, attack and formulas on Discord rolls when using the "hide monster name" whisper mode (By [@Brunhin
* **Feature**: *Discord*: Add support for linking back to the character, spell and item, when rolling to discord
* **Feature**: Add ability to display a monster avatar in the VTT (By [@Brunhine](https://github.com/Brunhine))
* **Feature**: *Roll20*: Add custom modifiers to the display of the modifier field in Roll20 rolls (by [@spisin](https://github.com/spisin))
* **Feature**: Allow the use of reroll modifiers on custom dice formulas
* **Feature**: Differentiate between one handed and two handed damages for versatile weapons when rolling both damage types
* **Feature**: Detect Advantage/Disadvantage indicator on skills and apply them to skill checks (By [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add the proper modifiers to a Fighter's Parry and Rally maneuvers
* **Feature**: Differentiate between Brutal Critical damages and Savage Attacks damages (By [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Consider Unarmed Strike as natural weapons for class features that affect weapon attacks (brutal critical, giant might, etc..) (By [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for roll formulas in descriptions of the form "+ half your `<class>` level"
* **Feature**: Add support for Ranger's Colossus Slayer class feature (By [@Brunhine](https://github.com/Brunhine))
* **Feature**: Add support for Ranger's Planar Warrior class feature (By [@Brunhine](https://github.com/Brunhine))
* **Feature**: Add support for Protector Aasimar's Radiant Soul class feature (By [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Flames of Phlegethos Feat (By [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Ranger's Slayer's Prey class feature
* **Feature**: Add support for Ranger's Gathered Swarm class feature
* **Feature**: Add support for Cleric's Supreme Healing class feature
* **Feature**: Add support for Rogue's Reliable Talent class feature
* **Feature**: Add support for the Elemental Adept Feat
* **Bugfix**: Fix some edge cases in roll formula formatting in ability descriptions (By [@Brunhine](https://github.com/Brunhine))
* **Bugfix**: Fix Fighter's Giant Might class feature not scaling its dice properly at level 11 (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix Cleric's Divine Strike to work for non melee weapons as well (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix handling of Great Weapon Fighting for the Polarm Master bonus action (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Roll Sneak Attack damages on Psychic Blades action (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix saving throws quick roll not working anymore (By [@kbuzsaki](https://github.com/kbuzsaki))
* **Bugfix**: Do not display duplicate custom dice icons in the class features list
* **Bugfix**: Fix the integrated dice roller not rolling 'd4' formulas (instead of '1d4') such as in the Bless spell
* **Bugfix**: Apply Great Weapon Fighting rerolls to a weapon's additional damages
* **Bugfix**: Fix Cleric's Life Transference damage being wrongly calculated
* **Bugfix**: Fix custom damage labels being ignored for spells and actions
* **Bugfix**: Fix class feature descriptions not being properly displayed
* **Bugfix**: Fix rolling tools from Equipement due to change in equipment type
* **Bugfix**: *Roll20*: Prevent multiple dice rolls in a single formula from appearing as separate formulas
* **Bugfix**: *Foundry VTT*: Fix add to initiative breaking with 0.6.0 release (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: *Foundry VTT*: Fix applying damage or healing to a token from a custom roll
* **Bugfix**: *Foundry VTT*: Fix condition syncing with tokens (By [@Brunhine](https://github.com/Brunhine))
* **Bugfix**: *Foundry VTT*: Fix PC/NPC Names being displayed in lowercase (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: *Foundry VTT*: Fix loading the Beyond20 setting icon in whitelisted pages
* **Bugfix**: *Discord*: Use the correct URL for Discord monster link back when rolling from encounter pages
* **Bugfix**: *Discord*: Send the correct whisper setting when sending the roll to Discord
* **Bugfix**: *Discord*: Fix displaying Equipment and Magic Items to Discord
* **Misc**: **Major rewrite** of the Beyond20 extension to use pure Javascript instead of Rapydscript language
* **Misc**: Allow Beyond20 to work within iframes (By [@Ainias](https://github.com/Ainias))
* **Misc**: Remove roll type indicators and use the new badge icons to represent the roll type
* **Misc**: Change internal dice formula reference to be more streamlined and independent of specific VTT implementations
* **Misc**: Make the quick roll icon remain fixed in place and disappear with a small delay
* **Misc**: Fix some dice rolls failing on pre-v3 D&D Beyond character sheets (irrelevant at this point)



---

Click [here](/Changelog) for the full Changelog of previous versions.