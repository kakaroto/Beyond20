Beyond20: D&D Beyond & Roll20/Foundry VTT Integration
==

[Beyond20](https://beyond20.here-for-more.info/) is a browser extension that integrates the Character Sheet from D&D Beyond into Roll20, Foundry VTT & Discord.

# Install and Use

## Install 

### Chrome

To install Beyond 20 on Chrome, simply head over to the [Chrome Web Store](https://chrome.google.com/webstore/detail/beyond-20/gnblbpbepfbfmoobegdogkglpbhcjofh) and click "Add to Chrome" to get it installed.

### Firefox

To install Beyond 20 on Firefox, simply head over to [Firefox Extensions](https://addons.mozilla.org/en-CA/firefox/addon/beyond-20/) and click "Add to Firefox" to get it installed.

## Use 

Open Roll20 or Foundry VTT in a tab of Chrome or Firefox then your character sheet in D&D Beyond in another tab. If you are using Chrome with Foundry VTT, then you need to click on the Beyond20 icon in the Chrome window's toolbar to activate Beyond20 for your FVTT installation.

Click on the item you want to roll, whether it's initiative, a skill, ability or saving throw check, a weapon or spell attack, a class/racial feat or trait or hit dice, death saving throw, etc... When the D&D Beyond character sheet shows the information about the item you selected in its side panel, there should be a Beyond20 button or B20 icon that appear in the side panel to make the roll. It will automatically pick up on what was selected, and send the roll to all Roll20 or Foundry VTT tabs open.

If a spell/item/action/feat description contains a dice formula (`2d10 + 3` for example) or a modifier formula (`+ 3` for example), that text will be underlined and a B20 dice icon will appear next to it. Click on the formula or the dice to make the roll in the Roll20 tab.

If you click on the Beyond20 button in the toolbar, it will pop open the quick settings menu. Note that the quick settings menu will be different whether you are on the VTT tab or D&D Beyond tab, and it will contain the per-character configuration.

# Build

You need to install the build dependencies by running in Beyond20's source directory: 
`npm install`

You can then build the files using the command `npm run build`

# Developer Mode Installation

All you need is to load the extension from the source :

0. If you already have Beyond20 installed from the Chrome or Firefox stores, disable it.
1. Download the extension for either [Chrome](https://github.com/kakaroto/Beyond20/releases/download/latest/chrome.zip) or [Firefox](https://github.com/kakaroto/Beyond20/releases/download/latest/firefox.zip)
2. Extract the zip file in a directory of your choice

## Chrome

3. Go to Chrome Extensions page (Menu->More Tools->Extensions)
4. Enable Developer Mode (Top-right corner)
5. Click on the 'Load Unpacked' button
6. Select the Directory where you extracted this extension

## Firefox

3. Open "[about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)" in Firefox
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the extension's directory

# License

This extension is released under the GPL v3 license. Read the LICENSE file for more details.

The icon image is based on a public domain image from openclipart. I downloaded it from [wikimedia](https://commons.wikimedia.org/wiki/File:Twenty_sided_dice.svg) and subsequently modified it.

The roll badge icons were designed and created by [Jerry Escandon](https://github.com/Jerryescandon) 

The donation icon is a public domain contribution by Fission Strategy, US, downloaded from [thenounproject](https://thenounproject.com/term/donation/15047/)

The 'up' arrow (docs/images/up-arrow.png) used in the screenshots page is a public domain image shared by OCAL on [clker.com](http://www.clker.com/clipart-16838.html)

The options page was copied in part from the `D&D Beyond Toolbox` extension available [here](https://github.com/mouse0270/Beyonds-Toolbox/). The html and css files are licensed under the MIT license which is provided in the LICENSE.MIT file

The condition icons (FVTT-module/beyond20/conditions) are for the most part taken from https://game-icons.net/ and licensed under a Creative Common CC-BY 3.0 License. You can find each icon's source and respective license in the FVTT-module/beyond20/conditions/LICENSE file