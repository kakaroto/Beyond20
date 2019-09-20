v0.6
===

Another month, another Beyond20 update! I won't bore you with long release notes this time. This adds a couple of features that were requested on the github [issue tracker](https://github.com/kakaroto/Beyond20/issues) and fixes some bugs as well. I am mostly just responding to requests at this point so if there's something you'd like the extension to do, let me know and I'll work on it.

The two main feature of this release are the ability to display spell cards from monster stat blocks directly without having to open the spell page separately, and better support for Vehicles. With the `Baldur's Gate: Descent into Avernus` release, we now have some new types of Vehicle stat blocks for Infernal Machines and Beyond20 parses those and allows you to roll them. I've also improved the regular monster stat block parsing to let you roll monster features.

There are other features and bugfixes as well, so I recommend checking out the [Changelog](Changelog) for the full list.

Thanks again and always, for all those who donated as well as to my [Patrons](https://patreon.com/kakaroto) who have paid for the development of this update. I'd also like to thank those who reported the bugs or gave the ideas for the features that were added in this release!


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