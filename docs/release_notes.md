v1.1
===

Hey everyone, it's time for a new Beyond20 release!

That's a lie, it's actually not time for the release, but D&D Beyond has been updating their character sheet layout recently and Beyond20 was therefore broken for some users who were selected by D&D Beyond for beta testing the new layout.

This means that I'm making a release earlier than expected, which unfortunately also means that it doesn't have all of the new features I had planned for v1.1. The big change in this update is of course the fact that it will now also work for those using the **new D&D Beyond sheet layout**. The change might not be visible to most of you, but there were some internal changes to the website that required Beyond20 to parse the page differently.

While there's also a couple of bugfixes in this update (as usual, refer to the [Changelog](Changelog#v11) for the full details), there are also two interesting features that were added :
- You can use in custom spell/action/weapon descriptions the formula `1d20 + your spell save DC` or `+ your Wizard spell attack` or `+ your Cleric spell modifier`, etc... to have those parsed and add the proper modifiers. These special formulas join the other `+ your dexterity modifier`, `+ your Paladin level`, `+ your proficiency bonus` and `+ your AC` that were already supported.
- You can now define the damage type for your custom damage dice in the character sheet's beyond20 quick settings. To specify the damage type, simply prefix your formula with the type separated with a colon, for example `Rage: 2` or `Fury of the small: 3, Magic Weapon: 1`

The Discord integration functionality turned out to be much more popular than I initially thought it would be, and I was hoping to add some new cool features to it, but due to the urgency of this release, that's delayed. I will work on getting it more fleshed out for next time though, I promise.

I'd also like to take a moment to quickly address the current global crisis. Due to COVID-19, there are many people who have been forced to move their D&D games to online play, and this can be seen by the sudden surge in popularity of the Beyond20 extension. It is a bittersweet feeling, since, while I am deeply saddened by what's happening outside our homes, I am also proud to have been able to help people stay connected and ease their experience in how they play their favorite game online.
When I made the last release, I had announced that I'd achieved, ten months after the initial release, a total of 15 226 chrome and 1 611 Firefox users (on March 16th), and today, three weeks later (on April 8th), Beyond20 now has 58 292 chrome and 5 665 Firefox users. That's almost 4 times the users in just 3 weeks, and it's all been because of you, isolating yourselves and instead of spreading the virus, you were spreading through word of mouth, how much you love my extension and find it helpful.

I like to end these release notes with my usual thank yous. First, I'd like to thank the D&D Beyond team who have reached out to me and have granted me access to the alpha character sheet in advance so I could update Beyond20 to work with the new layout. Working with them has been a real pleasure, and I wanted to thank them for being so friendly and open.

I'd also like to thank all of you who have sent me rations/coffees through the [Ko-fi](https://ko-fi.com/kakaroto) link or who pledged on [Patreon](https://patreon.com/kakaroto) through my [support](/support) page. The outpouring of love and support has been tremendous and is what keeps me working and updating Beyond20 for you all. 

Thank you as well for all of you who told others of the extension or who came to my [Discord](https://discord.gg/ZAasSVS) to thank me or to tell me how much you loved my work.

If you find Beyond20 useful to you and it helps you run your games more smoothly, please consider [supporting](/rations) me and Beyond20.

Thank you, stay safe, and, as usual, happy rolling!


v1.0
===

Wow, it's the Vee-One Release! 

Alright, the v1.0 version doesn't hold any particularly special importance. I started releasing Beyond20 ten months ago with v0.1 and this is the 10th release since then. This release is still a pretty major milestone as I'm releasing a new feature in Beyond20 that I'm sure many of you will love. I didn't know if I would be able to do it, but it turned out to be easier than expected, and I present to you : [**Discord Integration**](https://beyond20.here-for-more.info/discord)

You can now invite the Beyond20 Discord bot into your servers and have all your rolls sent to Discord. Be aware that you can either send to Roll20 or to Discord, not both at the same time. Since that limitation is not there for Foundry VTT, I'll try to find a way to achieve the same thing with Roll20, though I'm not sure if it would be possible.

Here's what it looks like (with and without the spoiler tags revealed, click to zoom) : 

[![s7](images/screenshots/discord-hidden.png){:width="300px"}](images/screenshots/discord-hidden.png) ---  [![s8](images/screenshots/discord-rolls.png){:width="300px"}](images/screenshots/discord-rolls.png)

One other thing of note in this release is that I've received my first external code contribution. Thank you Jeremy '[@jaypoulz](https://github.com/jaypoulz)' Poulin who implemented the option to add the dexterity modifier as tie breaker to initiative rolls. 

This release also fixes (for the third time) the changes to D&D Beyond's Encounters page, allowing you, once again, to roll from the stat blocks of monsters directly in the Encounters or the new Combat tracker.

There's plenty more features and a whole lot of bugfixes that made their way into this release and, as usual, you can read the full [Changelog](Changelog#v10) below. I wanted to do so much more, but saying that I've been busy for the past 2 months would be the understatement of the year, so I had to bump some of those features for the next release, but hopefully the Discord integration makes many of you happy and makes up for any feature you may have been waiting for.

I expect v1.1 to be ready in a month or two, to keep up with my usual release schedule, but I'm dedicating most of my time right now to a new business project I've started for hosting Foundry VTT games, so things may be a bit slower than usual in the coming months. With my new business, [The Forge](https://forgevtt.com), my aim is basically to have a user experience resembling Roll 20 when it comes to game and user management but with the powerful Foundry VTT as the core technology behind it. And of course, I'm doing my best to make it as stable, polished and user-friendly as I've tried to do with Beyond20. Check it out if you're curious, but do note that it's currently still in beta and I'm not taking subscriptions just yet other than offering beta access for my patrons.

As usual, I can't end without saying a big thank you to all those who supported this project and who contributed in one way or another. A big thank you to my patrons of course, who are making this possible, and to the 15226 chrome users and 1611 Firefox users (as of today, March 16th) of the extension who are using it, sharing it with their groups and friends, and who write reviews and send me praise/encouragement every day. Thank you all!

If you find Beyond20 useful to you and it helps you in your games, please consider supporting me, either on [Patreon](https://patreon.com/kakaroto), [Github](https://github.com/sponsors/kakaroto) or [Ko-fi](https://ko-fi.com/kakaroto).

Thank you, and happy rolling!



v0.9
===

It's time for the v0.9 release of your favorite extension! This adds support for a lot of special feats and class features, thanks to @Kelijyr on [Discord](https://discord.gg/ZAasSVS) who tracked down most of them. I've fixed the bugs that have been reported recently, and added some cool new features as well. My favorite is the ability to quickly roll with advantage by holding Shift when clicking the roll button. You can also roll with disadvantage by holding Ctrl, or do a normal roll by holding Alt. Thanks to @TheSheep from [Github](https://github.com/kakaroto/Beyond20/issues/81) for the suggestion and proof of concept.

Another cool feature, is the syncing of Temp HP for your characters and the HP and Temp HP for your Extra creatures. Make sure you rename that "Wolf" Beast Companion that follows you into a unique name to avoid changing the HP of all the wolves attacking you in your next battle. And one final thing which took way too long to achieve was the addition of the quick settings button for Firefox users. I originally thought it was a Firefox bug but I finally realized that Chrome was not following the specification and I had to work around it to achieve what I was trying to do. But now it works, so that's great.

As usual, big thanks to everyone who helped, supported me, reported bugs, gave feature suggestions, or just spread the word about this extension to their friends and gaming groups. A special thank you as always to [my Patrons](https://patreon.com/kakaroto) who keep me motivated.

I have also recently joined the [Github Sponsors](https://github.com/sponsors/kakaroto) program, and for the first year, Github is matching contributions up to 5000$ per developer, so [check it out!](https://github.com/sponsors/kakaroto)

If you find Beyond20 useful to you and it helps you in your games, please consider supporting me, either on [Patreon](https://patreon.com/kakaroto), [Github](https://github.com/sponsors/kakaroto) or [Ko-fi](https://ko-fi.com/kakaroto).

Thank you, and happy rolling!


v0.8
===

Another update already! This was meant to be a small bugfix release, but I still managed to add nice set of new features as well. The one I'm most happy about is the Quick Rolls feature which lets you roll ability checks, actions/weapons/spells directly from the main page without having to open the side panel first then click on the beyond20 icon. I am most happy about the fact that I managed to do this without adding tons of new dice icons everywhere in the character sheet. All you need to do is click on the ability/save/skill modifier or the icon next to the attack (or the small 'Cast' button next to spells) to have the Quick Roll happen. Conveniently, a Beyond20 icon will appear as a tooltip above the areas that are considered quick rolls to make them recognizable. You can still click anywhere else (where the tooltip doesn't appear) to open the side panel normally without auto-rolling. The option can also be disabled of course in case you don't like it, but I expect this will be a fan favorite!

I have also added support for super advantage and super disadvantage rolls (and roll thrice for FVTT users or those using the Dice roller). That was a compromise in trying to add support for the Elven Accuracy feat which was very difficult to get right. Note that on Roll20, if you use the 'D&D 5e by Roll20' character sheet template, there is no way of rolling a third dice, so 'roll thrice' acts as a 'roll twice', but the 'super advantage/super disadvantage' modes will work just fine as it will actually roll 3 dice even though only two are shown, the second roll box will be an advantaged/disadvantaged roll. You can hover on that box to see all the dice results.

Last major feature that was added is the condition tracking for the character sheets. If using FVTT and you have the Beyond20 FVTT module (which you should), then update the module as it will allow you to automatically set condition status effects on the tokens. For Roll20 unfortunately, I never understood any of their status effect icons and I didn't want to choose some as representing specific D&D conditions as I expect everyone has their own interpretation of each icon's meaning.

Finally, I've fixed a bunch of bugs from the last release, and added support for a new Paladin class feature and handling for three special spells. As usual, I suggest you check out the full [Changelog](Changelog#v08) for more details.

Also, as usual, I'll thank everyone who helped, supported this project, reported bugs or gave feature suggestions, or just spread the word about this extension to their friends and gaming groups. A special thank you as always to [my Patrons](https://patreon.com/kakaroto) who are always motivating me to keep doing what I love!

Happy Rolling!


v0.7
===

The #ThankYouPatrons release!

This release is dedicated to my generous [patrons](https://patreon.com/kakaroto) who are making this possible by supporting my projects. Today (November 19th) is the [#ThankYouPatrons event](https://www.thankyoupatrons.com) organized by Patreon. As I asked recently my patrons which projects they would like me to focus on, I was surprised to see Beyond 20 at the top of the poll results, so I've worked day and night to making this release possible for today in order to celeberate all those who have generously given me their support.

As a way of thanking them for their support, I've made this a big release with some major improvements and new features. The most important of which is the addition of a new Dice Roller for anyone using D&D Beyond without a Virtual TableTop (or using one that isn't supported by Beyond20).

I have also added a new option for how critical hit dice are calculated so you can select some of the more used homebrew rules instead of the D&D 5e PHB rules. I unfortunately could not add a 'double dice result' option even if I know it's a popular one, because the way Roll20 does its rolls makes it impossible. 

I've also added Beyond 20 button for quickly accessing the settings in both the VTT and the D&D Beyond pages. I've realized that many users never noticed that they can click on the Beyond20 icon in the toolbar to get character specific options, so I hope this makes it much more visible to everyone and makes it easier to access and use as well.

The new support for many of the special class features is another important change : You can now enable through the quick settings menu the following features : Bloodhunter's Crimson Rite, Ranger's Dread Ambusher, Paladin's Legendary Strike, Warlock's Hexblade's Curse and the Rogue's Assassinate.

There are many other smaller improvements or bugfixes, and I invite you to check out the full [Changelog](Changelog#v07) for more details.

Thank you to everyone who submitted their feature requests or reported bugs they found, please continue to do so and I'll be happy to tackle those as soon as possible.

And finally, again and always, a special thank you to [my Patrons](https://patreon.com/kakaroto) who are making this possible and for everything they've done for me!

Happy rolling!


v0.6
===

Another month, another Beyond20 update! I won't bore you with long release notes this time. This adds a couple of features that were requested on the github [issue tracker](https://github.com/kakaroto/Beyond20/issues) and fixes some bugs as well. I am mostly just responding to requests at this point so if there's something you'd like the extension to do, let me know and I'll work on it.

The two main feature of this release are the ability to display spell cards from monster stat blocks directly without having to open the spell page separately, and better support for Vehicles. With the `Baldur's Gate: Descent into Avernus` release, we now have some new types of Vehicle stat blocks for Infernal Machines and Beyond20 parses those and allows you to roll them. I've also improved the regular monster stat block parsing to let you roll monster features and legendary actions.

There are other features and bugfixes as well, so I recommend checking out the [Changelog](Changelog) for the full list.

A big milestone this week is that Beyond20 has now reached 5000 active Chrome users (according to Chrome Web Store statistics) and nearly 450 installs on Firefox. Since I don't really promote Beyond20, this has mostly happened thanks to word of mouth and thanks to the great reviews people have been giving this extension. Thank you everyone for sharing and talking about it and thank you for all the love and words of appreciation I'm receiving from the community, it really means a lot! I'd also like to thank those who reported the bugs or gave the ideas for the features that were added in this release!

And finally, again and always, a special thank you for all those who donated as well as to my [Patrons](https://patreon.com/kakaroto) who have paid for the development of this update.


v0.5
===

Another small update but one that is long overdue, also there's a lot to talk about.  
As Beyond20's feature list has stabilized and it does most of what I want it to do, I haven't been working on it as much as I was before (until/unless people request features on [Github](https://github.com/kakaroto/Beyond20/issues) which I'm happy to handle). This update fixes the bug where spell pages weren't working anymore, it adds a few new features which you can read about in the [Changelog](Changelog), but the one major change is one that will affect FVTT users on Chrome.

Starting from v0.5, if you are using FVTT on Chrome (Firefox users are unaffected), you will need to click on the Beyond20 icon in the toolbar to 'activate' Beyond20 on your FVTT tab. The reason for this change is that, since FVTT can be hosted anywhere, I had to have very broad persmissions for Beyond20, basically giving it access to every website, and it doesn't seem like Google likes that very much so every update has been stuck for 7 to 10 days while a Google employee reviews it to make sure it doesn't do anything malicious. The Google Chrome Web Store will also add a new policy, effective October 15th 2019 to restrict extensions that use broad permissions and Beyond20 might be taken down unless I make this change.  
By not having access to every website, Beyond20 cannot verify if the current page is an FVTT installation, so Beyond20 will not work by default on FVTT. The solution however is to click on the Beyond20 icon in the toolbar which is your way of telling Chrome that you give the extension permission to access the current page. That will activate Beyond20 for the FVTT page and then it will work just as it did before! I've also updated the FVTT companion module so it shows an information banner reminding you to activate it when you first load the page.

Other than that, most of my work in the last month has been concentrated on making modules for FVTT. I've completely finished my transition away from Roll20 and into FVTT as my VTT of choice and I couldn't be happier. While [FVTT](http://foundryvtt.com) is still considered Beta software, I think it's much more stable than Roll20 ever was, it has also surpassed it by miles in terms of performance, features, stability, ease of use, etc.. (the only big thing missing is macro support, but with an extensive API and a modules framework, it doesn't matter to me as much), if you're curious about why I like it so much, you can read a comment I wrote about it [here](https://www.dndbeyond.com/forums/d-d-beyond-general/general-discussion/38455-beyond20-integrating-d-d-beyond-with-roll20?comment=42).

That being said, on that same forum, I've seen a few people worried that it means Beyond20 will stop supporting Roll 20 and I want to assure you that this isn't the case. While I'm not a Roll 20 user anymore, I will keep implementing all new features for both Roll 20 and FVTT and will keep maintaining the software (bugfixes) for both platforms as well. In the same way that I fix and test Beyond20 on Firefox even though I don't use Firefox personally.

Finally, a big shout out to all those who donated to me via Paypal and to my [Patron](https://patreon.com/kakaroto) subscribers who have been supporting my work in the recent months (and therefore, paid for this Beyond20 update).  
Thank you all!


v0.4
===

A small update but it took a while to do as I'm working on other things lately. I've finished the support for FVTT basically and fixed the outstanding bugs. I'll now be mostly concentrating on FVTT modules and other similar work, though Beyond20 will continue to get updates to fix any bugs found or add features as they get requested.

In other news, it's my birthday in a few days, so yeay!


v0.3
===

This is a major update that I've been working on for a while. As I'm moving away from Roll 20, I've added support for Foundry VTT which works so much better for me. In order to do that, I've had to change some of the way that Beyond20 works and move a lot of the logic out of the Roll20 module and into the D&D Beyond module.

Another consequence is that the extension now needs permission to access all websites and that's simply because Foundry VTT can be self-hosted on any website. If the extension doesn't find a FVTT instance on the page, it won't load anything. If you are worried about what it does exactly, feel free to review the source code on [Github](https://github.com/kakaroto/Beyond20).

Roll20 support will continue of course, so you don't need to worry about that, but now you can also use Beyond20 with FVTT.

A lot of my time was also spent on writing a full campaign exporter and a Roll20 -> FVTT converter which I might release at some point in the future. For now it's available in beta to my [Patreon](https://patreon.com/kakaroto) subscribers. 

There's a couple of bugfixes and some new features, but the FVTT support is the major take away from this version!