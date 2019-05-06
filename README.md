Beyond20: D&D Beyond & Roll20 Integration
==

Beyond20 is a chrome extension that integrates the Character Sheet from D&D Beyond into Roll20.

# Build

This extension is written in 'python', more precisely in RapydScript and you will need [RapydScript-NG](https://github.com/kovidgoyal/rapydscript-ng) installed to compile the .pyj source files into .js
I don't know if it's totally compatible with rapydscript itself as I've used rapydscript-ng myself. 

To install :
`sudo npm install rapydscript-ng -g`

Install RapidScript-NG then type 'make' to compile the *.pyj into *.js

    Note: The .js files are already included in the source repository... I don't usually include built files in a repo, but I guess .js files are still source code and that makes it easier for people to just try the extension without having to first install rapydscript.

# Installation
All you need is to load the extension into Chrome :

1. Go to Chrome Extensions page (Menu->More Tools->Extensions)
2. Enable Developer Mode (Top-right corner)
3. Click on the 'Load Unpacked' button
4. Select the Directory where you extracted this extension

# Using it
Open Roll20 VTT in a tab of chrome then your character sheet in D&D Beyond in another tab, click on the item you want to roll, whether it's initiative, a skill, ability or saving throw check, a weapon or spell attack, a class/racial feat or trait or hit dice, death saving throw, etc...

When the D&D Beyond character sheet shows the information about the item you selected in its side panel, there should be a Beyond20 button or B20 icon that appear in the side panel to make the roll. It will automatically pick up on what was selected, and send the roll to all roll20 tabs open.

If a spell/item/action/feat description contains a dice formula (`2d10 + 3` for example) or a modifier formula (`+ 3` for example), that text will be underlined and a B20 dice icon will appear next to it. Click on the formula or the dice to make the roll in the Roll20 tab.

If you click on the Beyond20 button in the toolbar, it will enable/disable whispering of rolls (for now).

# License
This extension is released under the GPL v3 license. Read the LICENSE file for more details.

The icon image is based on a public domain image from openclipart. I downloaded it from [wikimedia](https://commons.wikimedia.org/wiki/File:Twenty_sided_dice.svg) and subsequently modified it.

The donation icon is a public domain contribution by Fission Strategy, US, downloaded from [thenounproject](https://thenounproject.com/term/donation/15047/)

The options page was copied in part from the `D&D Beyond Toolbox` extension available [here](https://github.com/mouse0270/Beyonds-Toolbox/). The html and css files are licensed under the MIT license which is provided in the LICENSE.MIT file

# TODO
- Add support for skills/items that have advantage/disadvantage notes (like disadvantage on stealth for heavy armor users)
- Add ability to select which roll20 VTT page to send the rolls to
- Add a way to show errors (such as "can't find a roll20 tab")
- Add a settings view to configure things like whisper rolls, roll with/without advantage, auto-roll damage, configure the macro to send to roll20, etc..
- Add a dice roller so it can also be used to roll directly without roll20, if wanted.
- Test and fix bugs



