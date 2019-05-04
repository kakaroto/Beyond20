Beyond20: D&D Beyond & Roll20 Integration
==

Beyond20 is a chrome extension that integrates the Character Sheet from D&D Beyond into Roll20.
This is a work in progress proof of concept, and for now, the structure is still not entirely defined.

# Build

This extension is written in 'python', more precisely in RapydScript and you will need RapydScript-NG installed to compile the .pyj source files into .js
I don't know if it's totally compatible with rapydscript itself as I've used rapydscript-ng myself. 

To install :
`sudo npm install rapydscript-ng -g`

Install RapidScript-NG then type 'make' to compile the *.pyj into *.js

    Note: The .js files are already included in the source repository... I don't usually include built files in a repo, but I guess .js files are still source code and that makes it easier for people to just try the extension without having to first install rapydscript.

# Installation
All you just need to do is load it into Chrome, so go to chrome extensions, enable developer mode, do 'load unpacked' and select the extension's directory.

# Using it
Open Roll20 VTT in a tab of chrome then your character sheet in D&D Beyond in another tab, click on the item you want to roll, whether it's initiative, a skill, ability or saving throw check, a weapon attack or hit dice (for now), and when the D&D Beyond character sheet shows the information about that in its side panel, click the Beyond20 button or B20 icon that appear in the side panel to make the roll. It will automatically pick up on what was selected, and send the roll to all roll20 tabs open.
If you click on the Beyond20 button in the toolbar, it will enable/disable whispering of rolls (for now).

# License
This extension is released under the GPL v3 license. Read the LICENSE file for more details.

The icon image is based on a public domain image from openclipart. I downloaded it from https://commons.wikimedia.org/wiki/File:Twenty_sided_dice.svg and subsequently modified it.

# TODO
- Add support for attacks/spell attacks, and for casting spells (show its description as a spell card), as well as feats, class/race features, and non-attack actions/reactions descriptions.
- Add support for skills/items that have advantage/disadvantage notes (like disadvantage on stealth for heavy armor users)
- Add ability to select which roll20 VTT page to send the rolls to
- Add a way to show errors (such as "can't find a roll20 tab")
- Add a settings view to configure things like whisper rolls, roll with/without advantage, auto-roll damage, configure the macro to send to roll20, etc..
- Add a dice roller so it can also be used to roll directly without roll20, if wanted.



