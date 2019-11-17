## Beyond20 has just been installed or updated

Congratulations! Beyond20 was just updated to the latest version.

I hope you like the new features, and hopefully the killer feature you were waiting for was just added. In that case, maybe you want to [show your appreciation](rations)?

Thank you all for your support!

* [Release Notes](#release-notes)
* [Changelog](#changelog)

# Known issues

Some issues are known to me and are being worked on, others might be caused by a new feature that was just added in the latest update and I'm facepalming at not catching it before I made the release. 

Head over to the [github issue tracker](https://github.com/kakaroto/Beyond20/issues) to see the list of known issues.

If you find an issue that isn't in the list, I'd appreciate you letting me know about it (either by creating one, or by reaching out to me over on [Discord](https://discord.gg/ZAasSVS)!

# Release Notes

Another month, another Beyond20 update! I won't bore you with long release notes this time. This adds a couple of features that were requested on the github [issue tracker](https://github.com/kakaroto/Beyond20/issues) and fixes some bugs as well. I am mostly just responding to requests at this point so if there's something you'd like the extension to do, let me know and I'll work on it.

The two main feature of this release are the ability to display spell cards from monster stat blocks directly without having to open the spell page separately, and better support for Vehicles. With the `Baldur's Gate: Descent into Avernus` release, we now have some new types of Vehicle stat blocks for Infernal Machines and Beyond20 parses those and allows you to roll them. I've also improved the regular monster stat block parsing to let you roll monster features and legendary actions.

There are other features and bugfixes as well, so I recommend checking out the [Changelog](Changelog) for the full list.

A big milestone this week is that Beyond20 has now reached 5000 active Chrome users (according to Chrome Web Store statistics) and nearly 450 installs on Firefox. Since I don't really promote Beyond20, this has mostly happened thanks to word of mouth and thanks to the great reviews people have been giving this extension. Thank you everyone for sharing and talking about it and thank you for all the love and words of appreciation I'm receiving from the community, it really means a lot! I'd also like to thank those who reported the bugs or gave the ideas for the features that were added in this release!

And finally, again and always, a special thank you for all those who donated as well as to my [Patrons](https://patreon.com/kakaroto) who have paid for the development of this update.

---

Click [here](/release_notes) for the full release notes from previous versions.

# Changelog

* **Feature**: Roll Spells from Monster stat blocks without opening the spell in a separate window
* **Feature**: Add roll buttons on non-weapon actions of monster stat blocks (Legendary actions or a Dragon's Fearful Presence/Breath attack for example)
* **Feature**: Add support for Vehicle/Ship weapons
* **Feature**: Add support for Infernal machines from *Baldur's Gate: Descent to Avernus*
* **Feature**: Add escape DC parsing in monster stat blocks (when grappling).
* **Feature**: Alert when trying to roll while no VTT window is found or configured to receive the rolls
* **Feature**: Add a "Display in VTT" button for rollable actions
* **Feature**: Add support for rerolling 1 and 2 damage dice for Great Weapon Fighting
* **Feature**: *FVTT*: Play dice sound when rolling dice
* **Feature**: *FVTT*: Make all rolls as out-of-character messages so they appear with the colored border of the character (v0.3.7+)
* **Bugfix**: Fix damage detection in monster stat block where for example a "DC 13 saving throw or take half damage" could be mistaken for 13 damage of type "saving throw or take half"
* **Bugfix**: *FVTT*: Update initiative in combat if rolled more than once
* **Bugfix**: *FVTT*: Do the proper damage calculations when using the 'Apply Damage' context option on chat messages
* **Bugfix**: *FVTT*: Re-calculate total damages when rolling damage multiple times with the 'Roll Damages' button (Auto-roll disabled)
* **Bugfix**: *FVTT*: Do not re-roll damages the first time we click on 'Roll Damages' (gives proper dice values and damage types for Chaos Bolt for example)

---

Click [here](/Changelog) for the full Changelog of previous versions.