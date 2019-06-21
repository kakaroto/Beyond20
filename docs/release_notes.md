v0.3
===

This is a major update that I've been working on for a while. As I'm moving away from Roll 20, I've added support for Foundry VTT which works so much better for me. In order to do that, I've had to change some of the way that Beyond20 works and move a lot of the logic out of the Roll20 module and into the D&D Beyond module.

Another consequence is that the extension now needs permission to access all websites and that's simply because Foundry VTT can be self-hosted on any website. If the extension doesn't find a FVTT instance on the page, it won't load anything. If you are worried about what it does exactly, feel free to review the source code on [Github](https://github.com/kakaroto/Beyond20).

Roll20 support will continue of course, so you don't need to worry about that, but now you can also use Beyond20 with FVTT.

A lot of my time was also spent on writing a full campaign exporter and a Roll20 -> FVTT converter which I might release at some point in the future. For now it's available in beta to my [Patreon](https://patreon.com/kakaroto) subscribers. 

There's a couple of bugfixes and some new features, but the FVTT support is the major take away from this version!