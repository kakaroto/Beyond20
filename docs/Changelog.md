v2.8.0 (November 13th 2022)
===

* **Feature**: Add advanced option to export and import your Beyond20 settings to/from file
* **Feature**: Add new option on toggle hotkeys, allowing to permanently toggle options using hotkeys
* **Feature**: Add ability to parse roll tables in Item pages, Spell pages, etc...
* **Feature**: Add support for parsing dice, roll tables, read-aloud, etc.. in Races pages
* **Feature**: Add support for new DDB type of statblocks, appearing in new source books (Spelljammer creatures)
* **Feature**: Add option to allow display of attack description when sending to Discord
* **Feature**: Add support for the new "Read Aloud" formatting D&D Beyond used in Lost Mine of Phandelver (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Death Cleric: Circle of Mortality (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add special handling for Dragon Wing ranged weapon damages and the Flail of Tiamat, and allow setting a note to specify which damage to use (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Save the last user selection of damage queries to default to the same damage type
* **Feature**: Ensure that all queries for advantage are done on the DDB side, rather than in the VTT
* **Feature**: Send the list of monster actions in the Beyond20 requests in case the VTT needs to know that information
* **Feature**: *Roll20*: Add new option to allow display of a spell's details during attacks (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix character parsing not working when accessing a character from the "My Characters" page due to a change in how DDB changes sites
* **Bugfix**: Fix any hotkey modifier (for whisper/advantage/etc...) being forgotten if a user query is open during a roll (such as damage type for Chromatic Orb)
* **Bugfix**: Fix the displayed total in Digital Dice notification to the non-discarded roll in case of advantage/disadvantage
* **Bugfix**: Parse dice formulas in multi-paragraph monster actions (Gelatinous Cube's "Engulf", or a Beholder's "Eye Rays" for example)
* **Bugfix**: Correctly show individual roll results in the Digital Dice notification when multiple dice are rolled
* **Bugfix**: Do not apply the Paladin's Aura of Protection on Death Saves since the character is unconscious (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Do not apply Otherwordly Glamour to Charisma saves (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix Great Weapon Fighting not being applied to brutal critical damage dice when using the Polearm Master bonus attack (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Clean up formula parsing, which fixes among other things, some errors showing on Foundry VTT v10
* **Bugfix**: Fix a leftover quickroll tooltip when rolling a saving throw from the sidebar
* **Bugfix**: *FVTT module v1.5.1*: Fix NPC hp formula when using a Native Rolls actor
* **Bugfix**: *FVTT module v1.5.1*: Port Native Rolls to require Foundry v10 and remove deprecation warnings
* **Bugfix**: *FVTT module v1.5.1*: Fix support for automated animations with Native Rolls
* **Bugfix**: *FVTT module v1.5.1*: Fix incorrect proficiency value being set on non-standard items when using Native Rolls
* **Bugfix**: Remove possibility of a message broker error when sending Beyond20 requests through the Game Log
* **Bugfix**: Fix issue not recognizing some monster actions when a non-breaking space is included in the action name
* **Bugfix**: Fix the Restrained condition appearing as "RRestrained" due to the "R" in the svg icon (by [@IsaacAbramowitz](https://github.com/IsaacAbramowitz))
* **Misc**: Remove support for Astral VTT as the site is now closed permanently
* **Misc**: Add harpy.gg as a recognized VTT which added native support for Beyond20
* **Misc**: Add alchemyrpg.com as a recognized VTT site (with plans to add native support for Beyond20)



v2.7.0 (June 18th 2022)
===

* **Feature**: Add the ability to specify custom domains to load Beyond 20 on, opening the path for other VTT websites to natively add support for Beyond20.
* **Feature**: *Roll20*: Add support for auto-selecting monsters of the same name in the combat tracker when running an encounter with multiple instances of the same monster
* **Feature**: *Roll20*: Add option to show "Unknown Creature" (customizable) in the combat tracker for monsters not mapped to a token
* **Feature**: *Roll20*: Add an option to use the Beyond20 roll renderer without digital dice, allowing nicer and more customizable attack and damage outputs, with totals calculation
* **Feature**: Add support for displaying Feats to the VTT from the Feats page (by [@IsaacAbramowitz](https://github.com/IsaacAbramowitz))
* **Feature**: Specify the exact damage type for Genie's Wrath (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Artificer's Arcane Jolt on Infused weapons (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for extra damage on natural 20s for Vicious Weapons (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix parsing of monster attacks which deal constant damage with no dice formula
* **Bugfix**: Add Crimson Rite damage to Polarm Master Bonus Attacks (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix character name detection caused by last DDB character sheet update
* **Bugfix**: Fix issue displaying result of non-standard dice (d3) when rolling with Digital Dice enabled
* **Bugfix**: Fix display of total damages in versatile attacks that displayed total 1-handed and total 2-handed uselessly
* **Bugfix**: Fix setting changes not properly propagating to open items and equipment pages
* **Bugfix**: *Roll20*: Fix issue with the combat tracker when matching multiple enemies with the same name where each turn, the token associated could be different



v2.6.3 (April 12th 2022)
===

* **Bugfix**: Fix parsing of the initiative modifier after DDB character sheet update on April 12th (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix some missing data from rolls sent to the game log which caused issues with the DDB mobile app
* **Bugfix**: Remove decimal value of initiative rolls with tie breaker from rolls sent to the game log which caused issues with the DDB mobile app
* **Bugfix**: *FVTT*: Fix support for attaching rolls to the new ChatMessage API in Foundry VTT v10
* **Misc**: Update the Dread Ambusher option title and description

v2.6.2 (March 30th 2022)
===

* **Feature**: Add support for rolling the right hemodice for Blood Curse of the Eyeless (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: *Roll20*: Display the advantage/disadvantage indicator (greying out dropped dice) when rolling with digital dice (by [@Cube-o](https://github.com/Cube-o))
* **Bugfix**: Fix issue detecting a character sheet's ID due to a sheet change, causing character settings to not work properly
* **Bugfix**: *Roll20*: Fix HP syncing due to a Roll20 change to their API
* **Bugfix**: *FVTT*: Fix rolling Death saving throws when digital dice is disabled
* **Bugfix**: *Roll20*: Fix support for Diamond Soul (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix display corruption of the Adventure flowchart in the call of the Netherdeep (due to dice formula replacement in embedded style/script tags)
* **Bugfix**: Fix issue with looping notification about class features being parsed when two sheets are open, caused by the character sheet's ID not being detected properly
* **Bugfix**: Fix display of the 'class features detected' notification not displaying properly

v2.6.1 (February 21st 2022)
===

* **Feature**: Add the ability to hook into the Digital Dice buttons of monster stat blocks (Encounters) when available, instead of adding the Beyond20 icons to the statblock
* **Feature**: Add support for displaying the healing portion of Vampiric Touch
* **Feature**: Add an option to disable sending rolls to the D&D Beyond Game Log
* **Feature**: Add support for Monk: Diamond Soul class feature (adds proficiency to death saves at level 14) (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add the ability to roll critical damages on special attacks (like Sneak Attack) which has no "To Hit" value, when using Force Critical (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Command-Click as default additional hotkeys on Mac OS X, due to Control-Click being an accessibility hotkey on Macs
* **Bugfix**: Fix initiative value from the combat tracker not being parsed properly
* **Bugfix**: *Roll20*: Fix issue of missing combatants in the turn tracker when synchronizing with D&D Beyond's Combat tracker
* **Bugfix**: *Roll20*: Fix the turn tracker showing empty or old value when starting a combat with the tracker closed
* **Bugfix**: Fix some roll formulas in digital dice boxes being incorrect when switching between monsters in the Encounters page
* **Bugfix**: *Roll20*: Remove duplicate prompt for Toll the Dead damage from Roll20 (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: *FVTT*: Fix whispered rolls being overridden by Foundry VTT on roll type messages and showing as public rolls
* **Bugfix**: *FVTT*: Fix Life Transference and Vampiric Touch damages failing to roll due to flavor text
* **Bugfix**: *Roll20*: Fix Life Transference and Vampiric Touch showing an empty healing value
* **Bugfix**: Fix the extra damage/healing from College of Spirits: Spirital Focus not applying until level 6 (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Do not show total of one-handed and two-handed weapon attacks when there are no other damages to sum up (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Further fixes to the renaming of the two-handed/one-handed damage tyeps (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix the description text of the Celestial Radiant Soul option which was incorrectly describing the Wildfire spirit bond (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix adding non-numeric damages to the total calculation
* **Bugfix**: Do not use Great Weapon Fighting on Brutal Critical/Savage Attacks when using versatile weapons one-handed (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: *Roll20*: Add missing modifier to rolls when digital dice is enabled (by [@jjchambl](https://github.com/jjchambl))
* **Bugfix**: *Roll20*: Clean up the display of custom modifiers in attack rolls (by [@jjchambl](https://github.com/jjchambl))
* **Bugfix**: Fix for the quickrolls tooltip being shifted due to the D&D Beyond sale/offer banners at the top of the site (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix the options dialog being too wide and unusable on large monitors (by [@jjchambl](https://github.com/jjchambl))
* **Bugfix**: Fix Crimson Rite not applying on Predatory Strike attacks (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix Divine Smite support for Polearm Master attacks when used as an opportunity attack reaction (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Prevent non-roll action buttons in monster statblocks from showing a roll icon after the advantage/disadvantage hotkey is pressed
* **Misc**: Change the "Use Digital Dice" option to enabled by default, for new Beyond20 installs (by [@Aeristoka](https://github.com/Aeristoka))

v2.6.0 (January 4th 2022)
===

* **Feature**: *FVTT*: Add support for Foundry v9 (rolls, HP syncing, conditions syncing, initiative tracking, etc...)
* **Feature**: *FVTT*: Add support for (Experimental) Foundry native rolls for 0.8.9 and v9 in the FVTT module 1.4.0 (disabled option by default)
* **Feature**: *FVTT*: Add support for requesting permanent permissions for custom Foundry VTT domains
* **Feature**: Remove broad permissions from FireFox, and switching to a Chrome like system for activating on Foundry VTT tab
* **Feature**: Add an 'Advanced Options' button to separate the more common vs advanced settings in Beyond20 options
* **Feature**: Only open Beyond20 changelog when the user visits a D&D Beyond or VTT page, rather than on extension update
* **Feature**: Hide the custom modifiers in the per-character settings under an Advanced settings toggle
* **Feature**: Add support for sending whispers to the DDB game log 
* **Feature**: Add ability to display an item's image to the VTT from Magic Item pages
* **Feature**: Add character initiative to the D&D Beyond encounters when rolling for Initiative
* **Feature**: Add support for dice formula that use uppercase 'D' instead of 'd' for the dice
* **Feature**: Add support for roll tables which uses a 'Bardic Insp. Die' instead of a dice formula (Bard College of Spirits: Spirit Tales)
* **Feature**: Add support for Warlock: The Celestial: Radiant Soul (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Elemental Weapon damage selection (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Elemental Bane weapon damage selection (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add a query for Spirit Guardian's damage type (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Move all queries to the D&D Beyond site when building a roll request, instead of on the VTT side (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add an advanced option to configure how a hidden monster name/attack should appear (default to '???')
* **Feature**: Add support for a custom raw ability check modifier 
* **Feature**: Rename "One/Two Handed" weapon damages into a shorter "1/2-Hand" display (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add option to always show the type of damage for versatile weapon attacks (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: *FVTT*: Add support for chat damage buttons in the Foundry VTT module
* **Bugfix**: Apply per-character discord target to a character's Extras
* **Bugfix**: Fix issue with some monster actions not being recognized if they started with a space (Mind Flayer Lich Illithilich)
* **Bugfix**: Fix alertify library polluting the comments in DDB pages (tinymce iframe)
* **Bugfix**: Fix formula parsing which uses the unicode minus character (Homunculus Servant in artifier's source)
* **Bugfix**: Fix the Jack of All Trades character option not being visible in the per-character settings
* **Bugfix**: Fix aspect ratio of the character avatar images so they match DDB's display
* **Bugfix**: Trim all damage types, as a damage type might appear preceded with a space in some situations
* **Bugfix**: Fix detection of AoE shape for spells in character sheets (useful for Foundry native roll support)
* **Misc**: Remove support for Paladin's Legendary Strike, as it was not retained from UA (by [@Aeristoka](https://github.com/Aeristoka))
* **Misc**: Updated instructions for the Discord integration
* **Misc**: Remove Toucan sponsorship and fix Discord logo from support page

v2.5.0 (September 20th 2021)
===

* **Feature**: Add support for sending the detailed roll results to the D&D Beyond Game Log
* **Feature**: Add the ability to set custom modifier/damage formulas when setting up hotkeys
* **Feature**: Add option to set a target discord channel on a per-character basis
* **Feature**: Add Beyond20 button on read-aloud text boxes to send as chat message to the VTT
* **Feature**: Add support for applying custom modifiers and custom damages from hotkeys to Monster rolls too
* **Feature**: Query for the advantage/disadvantage on skill checks that have a magical conditional advantage/disadvantage badge
* **Feature**: Add buttons to display character's proficiencies to the VTT
* **Feature**: Add support for adding magical modifiers on death saves (from Luck Stone, or Cloak of Protection)
* **Feature**: Add item quantities when rolling/displaying an item
* **Feature**: Add button to display a character sheet's avatar to the VTT
* **Feature**: Add the ability to roll non standard dice formulas (1d2, 1d50, etc..) when using the digital dice
* **Feature**: Show the character's avatar next to each roll when using the html roll renderer
* **Feature**: Add support for Mark of Warding Dwarf - Warder's Intuition (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mark of Scribing Gnome - Gifted Scribe (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mark of Healing Halfling - Healing Touch (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mark of Hospitality Halfling - Ever Hospitable (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mark of Finding Half-Orc/Human - Hunter's Intuition (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mark of Handling Human - Wild Intuition (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mark of Making Human - Artisan's Intuition (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mark of Passage Human - Intuitive Motion (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mark of Sentinel Human - Sentinel's Intuition (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mark of Warding Dwarf (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add special handling for Spirit Shroud spell (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add special handling for Destructive Wave spell (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Update the CSS styling further for the roll renderer (by [@LorduFreeman](https://github.com/LorduFreeman))
* **Feature**: Send Beyond20 roll request information to the DOM as a custom event, which could allow other extensions to take advantage of that data
* **Feature**: Send roll requests and rendered rolls to other D&D Beyond players through the Game Log (does not appear but could be used by other extensions)
* **Bugfix**: Fix bug calculating the modifier in custom skills when querying for the ability to use (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Prevent the custom digital dice rolls from being sent to the game log, polluting it with hard to parse roll information
* **Bugfix**: Fix "Force Critical" option being ignored when rolling damages only on spells (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Clean up alertify classes from comments sections of items, monsters, spells, vehicles to prevent comments polluting the page
* **Bugfix**: Fix duplicate roll buttons appearing on vehicle statblocks
* **Bugfix**: Fix broken attacks for the Animate Objects spell
* **Bugfix**: Remove querying for advantage when rolling a custom formula rather than an attack/ability check
* **Bugfix**: Fix adding quick roll areas to the modifiers preview in the "Change Theme" panel
* **Bugfix**: Fix discord logo in the options menu not being visible anymore
* **Bugfix**: Fix issue rolling custom dice formula with the digital dice when the whisper type is set to "Ask every time"
* **Bugfix**: Fix the game log hijacking digital dice rolls in the encounters page
* **Bugfix**: *FVTT*: Fix Temp HP syncing by removing the HP Max override when Temp HP is set (by [@Aeristoka](https://github.com/Aeristoka))
* **Misc**: Add proficiency flag to saving throw requests sent by Beyond20
* **Misc**: Fix the "available in chrome store" image not loading on the website
* **Misc**: Remove Toucan sponsorhip from the website (nobody seemed particularly interested in their product 🤷‍♂️)

v2.4.6 (July 7th 2021)
===

* **Feature**: Change the roll output's styling to look much nicer and be more in line with FVTT's own CSS styling (by [@LorduFreeman](https://github.com/LorduFreeman))
* **Feature**: Add support for Bard: Spiritual Focus (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Wizard: Durable Magic (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Warlock: Grave Touched (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mask of Shadow Elf Cunning Intuition (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix HP syncing not working anymore from the character sheet page (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix display/detection of spell damage types that would affect special abilities (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Clean up bogus damage types from some items (Arrow of Slaying) (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix rolling spell damages from spells that don't have a To Hit value (saving throws or healing) when force critical is enabled
* **Bugfix**: Only compute critical damages on attacks which include a To Hit value, even if force critical is enabled
* **Bugfix**: Fix issue with editing homebrew subclass descriptions which include dice formulas in them
* **Bugfix**: Remove extraneous html content introduced by Beyond20 in the editors of homebrew subclasses
* **Misc**: *FVTT*: Change the FVTT module to appear compatible with 0.8.8 and fix the change from `systems` to `system` in the module's metadata


v2.4.5 (June 4th 2021)
===

* **Bugfix**: Fix a crash when showing a table in a character sheet's sidebar

v2.4.4 (June 4th 2021)
===

* **Feature**: *FVTT*: Apply condition status effects to custom named tokens linked to an actor with the correct name
* **Bugfix**: Fix support for rolling with digital dice with the new targetted rolls update from D&D Beyond
* **Bugfix**: Fix Wild Magic roll table not displaying the resulting effect
* **Bugfix**: Fix dice rolls in feature snippets disappearing after clicking on the sheet
* **Bugfix**: Fix dice rolls in feature snippets being merged into invalid formulas in certain situations
* **Bugfix**: Fix condition updates being sent twice in some situations
* **Misc**: Improved some performance in how pages are parsed

v2.4.3 (June 1st 2021)
===

* **Feature**: Add support for the roll tables in character sheets too
* **Bugfix**: Fix a crash that happened on the long rest dialog
* **Bugfix**: Fix settings not propagating to source and classes pages
* **Bugfix**: Fix the merging of two adjacent formulas within ddb tooltips not working in all use cases

v2.4.2 (June 1st 2021)
===

* **Feature**: Add the ability to roll from formulas in source book pages
* **Feature**: Add the ability to roll from formulas in classes pages
* **Feature**: Add the ability to parse roll tables and roll their results directly to the VTT
* **Feature**: *FVTT*: Add support for Foundry VTT 0.8.x new Dice API
* **Feature**: Add support for advantage/disadvantage badges on death saves (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add suport for Ranger: Natural Explorer (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Roll critical damage dice when using the "Force Critical" option and rolling damages only
* **Feature**: Add the ability to parse and roll formulas with multiple different dice in them (1d10+1d8 for example, instead of 1d10+mod)
* **Bugfix**: Fix roll dice in feature snippets that are split into two separate rolls due to tooltips (Deflect Missiles, Talons, Radiance of the Dawn, Hands of Healings, etc...)
* **Bugfix**: Fix dice duplication in the Foundry VTT 0.7.x with Dice So Nice module, when using dice pools
* **Bugfix**: Fix Brutal Critical for Perfect rolls Homebrew critical rule (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix Brutal Critical processing non weapon damage for the dice selection (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix the death save icon not appearing upon page reload
* **Bugfix**: Fix custom dice in action snippets disappearing after a side panel is opened
* **Bugfix**: Fix missing settings variable when rolling from an equipment/magic item page
* **Bugfix**: *Firefox*: Fix extension options scrollbar flickering on Firefox
* **Bugfix**: *Roll20*: Fix character name showing as "null" in Roll20 in some instances


v2.4.1 (April 25th 2021)
===
* **Feature**: Add support for Raging from a Wildshape creature (for Druid/Barbarian multiclassers)
* **Feature**: Add the ability to display NPC's traits in the VTT (non attack actions/features)
* **Feature**: Add support for using Utensils as tools (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Spirit Guardians (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Display the roll formula when doing a custom digital dice roll
* **Feature**: Add support for rolling Shadow Blade attacks as melee weapons when added as a custom action (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: *Roll20*: Fix OGL sheet template detection as Roll20 keeps changing it
* **Bugfix**: Fix and improve the handling of special spell and class features which was refactored in 2.4.0 (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix support for some monster attacks that use incorrect capitalization in the description (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Prevent Empowered Evocation damage from happening on non-Wizard spells (by [@cashoes](https://github.com/cashoes))
* **Bugfix**: Fix support for adding modifier to the superiority die of Parry and Rally Maneuvers (by [@tyler-macinnis](https://github.com/tyler-macinnis))
* **Bugfix**: Fix Sneak Attack being always rolled on Pshycic Blade regardless of setting (by [@atomicpeach](https://github.com/atomicpeach))
* **Bugfix**: Fix quick roll areas not registering clicks in some situations
* **Bugfix**: Fix hotkey settings tooltip not updating after modifying the hotkeys
* **Bugfix**: Correctly parse the 2d20kh1/2d20kl1 when rolling an attack with advantage/disadvantage in D&D Beyond's Digital Dice
* **Bugfix**: Fix misaligned Beyond20 icons in the monster statblocks of Encounters pages
* **Bugfix**: Fix spell icons duplicating when switching between similar monsters in the Encounters page
* **Misc**: Added release dates to the Changelog

v2.4.0 (March 30th 2021)
===

* **Feature**: Add support for special spells within an item's attack (Green-Flame Blade and Booming Blade for example)
* **Feature**: Add support for sticky hotkeys that don't need to stay pressed to temporarily enable an option (by [@Stoneguard001](https://github.com/Stoneguard001)])
* **Feature**: Add support for a quick preview of configured hotkeys and toggleable by mouse (by [@Stoneguard001](https://github.com/Stoneguard001)])
* **Feature**: Add support for "Force Critical Hit" hotkey
* **Feature**: Add support for Super-advantage and Super-disadvantage hotkeys by differentiating between left and right Ctrl/Shift hotkeys
* **Feature**: Add support for custom damage hotkeys
* **Feature**: Do not send custom digital dice rolls to the VTT if the option to use digital dice is disabled
* **Feature**: Parse and send Range and AoE information separately in the roll data
* **Feature**: Parse and show the AoE Range and shape for spells
* **Feature**: Allow using commas in custom damage formulas, without breaking the formula, when used inside parenthesis, brackets or curly braces (useful for Roll20 macros)
* **Feature**: Add ability to roll spells that only have a save DC (Bestow Curse for example)
* **Feature**: Add special handling of the Hunter's Mark spell due to multiple duplicate damages (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for the Symbiotic Entity special class feature (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Mark of Detection Deductive Intuition Half-Elf Variant Racial Feature (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Windwright's Intuition Half-Elf Variant Mark of the Storm Feature (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Charger Feat (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for UA's Fighting Initiate - Great Weapon Fighting (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Empowered Evocation (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Blade of Disaster critical hit limit (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Ranger's Favored Foe feature (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Jim's Magic Missile's unusual critical damage (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Arms of the Astral self, as being an unarmed strike for melee related special abilities (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add a character specific toggle option for the Ranger's Colossus Slayer damage die (by [@IvanGirderboot](https://github.com/IvanGirderboot))
* **Feature**: Add a character specific toggle option for Halfling Luck (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add a character specific toggle option for Genie's Wrath (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: *Astral*: Update the hp, max hp, and temp hp attributes in the character sheet. (by [@adriangaro](https://github.com/adriangaro))
* **Feature**: *Astral*: Update the resource bars to match the hp and temp hp (by [@adriangaro](https://github.com/adriangaro))
* **Feature**: *Astral*: Add an option to allow Beyond20 to configure token resource bars in Astral (by [@adriangaro](https://github.com/adriangaro))
* **Feature**: *FVTT*: Add basic support for doing native rolls in Foundry
* **Bugfix**: *Roll20*: Fix OGL sheet template detection after Roll20's change of design on March 28th 2021
* **Bugfix**: Remove support for Cleric's Disciple of Life Handling as that feature is now [supported directly](https://www.dndbeyond.com/changelog/960-cleric-life-domain-disciple-of-life-update) by D&D Beyond (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix class features and traits displaying the wrong description
* **Bugfix**: Fix game log interfering with digital dice results detection by Beyond20
* **Bugfix**: Fix critical hit/fail detection on discarded and rerolled dice (Halfling Luck for example) (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Remove the addition of Wisdom modifier to Skill checks when using Otherwordly Glamour (added natively by D&D Beyond) (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix single roll options not getting reset after a roll if more than one toggle is enabled (by [@IvanGirderboot](https://github.com/IvanGirderboot))
* **Bugfix**: Fix Unarmed Fighting not being recognized as a melee attack (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix versatile weapon hotkey not overriding the versatile option in some situations
* **Bugfix**: Use keyboard code for hotkeys instead of character code, which fixes some hotkeys failing to trigger if Shift was pressed
* **Bugfix**: Fix negative modifiers turning into positive modifiers when additional modifiers were added to them
* **Bugfix**: Do not display Beyond20 notification when no VTT is found when doing a custom digital dice roll
* **Bugfix**: Do not add a quick roll trigger on the skills heading
* **Bugfix**: Fix support for Ranger's Gathered Swarm which didn't apply to actions and spells (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix damage scaling for Gathered Swarm after it changed from UA to official content (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix detection of some tools and instructions such as Kits, Supplies, Sets and Wagons.
* **Bugfix**: Fix parsing of monster attacks that are not ranged or melee (Piercer for example) (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix parsing of monster statblock damages that were using the Minus unicode character (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix detection of proficiency when rolling tools with Beyond20 (apply reliable talent for example) (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: *Roll20*: Fix invalid formulas when using custom modifiers
* **Bugfix**: *FVTT*: Fix bug with converting DDB rolls into FVTT native rolls in some situations (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: *FVTT*: Use a different method of detecting FVTT tabs which doesn't conflict with title modifying modules
* **Bugfix**: *FVTT*: Fix compatibility with 0.8.0 for finding the world title
* **Bugfix**: *FVTT*: Fix handling of temp HP updates
* **Misc**: Re-order character specific settings to be sorted more naturally
* **Misc**: Build a CI pipeline with Github Actions and remove dist folder from source repository
* **Misc**: Refactored special melee, ranged, weapon and spell attacks into more generic and less error-prone functions (by [@KaKaRoTo](https://github.com/kakaroto) and [@Aeristoka](https://github.com/Aeristoka))
* **Misc**: Add sponsored section to the website and sponsor links for [The Forge](https://forge-vtt.com/?referral=beyond20) and [Toucan](https://jointoucan.com/partners/beyond20)

v2.3.0 (December 8th 2020)
===

* **Feature**: Add a hotkeys manager to allow setting custom hotkeys for controlling Beyond20's behavior🥳🎉
* **Feature**: Add the ability to enable/disable whisper via hotkey
* **Feature**: Add support for rolling with Super Advantage/Disadvantage (Elvin Accuracy) using a hotkey
* **Feature**: Add support for toggling one-handed/two-handed use of a weapon using hotkeys
* **Feature**: Add the ability to temporarily toggle any of the character specific settings via a hotkey
* **Feature**: Add the ability to add or subtract custom dice to rolls via hotkeys (Bless/Guidance/Bane/Bardic Inspiration/etc...)
* **Feature**: Add support for rolling weapons including special spell damages (greenflame blade, booming blade)
* **Feature**: Allow queuing up of rolls when the Digital Dice are enabled so all rolls are executed
* **Feature**: Add support for capturing and transferring digital dice rolled manually through D&D Beyond's interface
* **Feature**: Add support for parsing the item customization options (Hex Weapon, Pact Weapon)
* **Feature**: Display a class feature's choices (such as selected proficiency or the Monastic Tradition) when displaying a feature to the VTT
* **Feature**: Add option to hide from the player the results of a whispered roll that is sent to Discord (by [@rispig](https://github.com/rispig))
* **Feature**: Add a notification when the class features are parsed so the user gets visual feedback when it's done
* **Feature**: Wizard Bladesong: Support concentration constitution saves and adds the intelligence modifier (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Apply Great Weapon Master for the Polearm Master bonus action (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Paladin's Oath of Devotion Sacred Weapons (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Ranger Fey Wanderer Otherworldly Glamour (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Cleric's Blessed Strikes (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Sorcerer Trance of Order's Clockwork Soul (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Druid Circle of Spore's Symbiotic Entity (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Warlock Genie Patron's Genie's Wrath (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for the Eldritch Invocation: Lifedrinker (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Piercer feat (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Artificer's Battlesmith arcane Jolt (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: *Roll20*: Add option to display the full spell description on spell attacks (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: *Roll20*: Fix detection of the OGL sheet template after recent website design change
* **Bugfix**: Fix issue where the Beyond20 settings dialog was getting pasted into the chat area of a monster's page when "More Options" is clicked
* **Bugfix**: Fix parsing of a vehicle's action stations from the Extras tab of a character sheet
* **Bugfix**: Fix parsing of damages in monster actions when the average result isn't included in the statblock (by [@flangelier](https://github.com/flangelier))
* **Bugfix**: Fix Alchemist Artificer: Alchemical Savant that was getting applied to non dice rolls (such as Aid) (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Add support for some older browser by ignoring features (custom notes) that depend on newer browser updates
* **Bugfix**: Avoid having the discord name overflowing to the right of the window if the selected friendly name is too long
* **Bugfix**: Set a maximum width to the discord combobox and add ellipsis to the name to prevent other option names from being unavailable
* **Bugfix**: Fix support for Fighter's Giant Might, as the feature was renamed "Giant's Might" (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix Ranger Fey Wanderer's Dreadful Strikes to support the level scaling post UA (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix the Bard's Psychic Blade's support conflicting with the Rogue's Psychic Blade class feature 🤦 (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix parsing of a monster's skills, which were invalid in the encounter page due to a change in format
* **Bugfix**: Fix the hotkey to override the roll type being ignored if the "always ask" option is selected
* **Bugfix**: Fix the possibility of the roll icon reverting to 'normal' after pressing and releasing the shift/ctrl hotkey
* **Bugfix**: Only use the Sharpshooter/Great Weapon Master option if the character has the Feat
* **Bugfix**: Remove the dice icon on the "Display in VTT" button next to a monster's avatar and change the styling of the button
* **Bugfix**: Fix rolls breaking if digital dice are enabled and the damage is a fixed value with no dice
* **Bugfix**: Fix dice rolls not detecting the critical fail/success and coloring the result in some situation with the Beyond20 roll renderer
* **Bugfix**: Fix critical damages not being rolled with digital dice disabled and using Beyond20 roll renderer
* **Bugfix**: Display the full spell card information from a monster page when using the "hide monster name" whisper name
* **Bugfix**: Fix custom messages not working properly if the whisper or roll type setting is set to "always ask"
* **Bugfix**: Fix unreliable support of Colossus slayer feat. Does not query anymore and is handled like Sneak Attack (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: *Roll20*: Fix rolls not being sent with the correct character "speaking as"
* **Bugfix**: *Roll20*: Fix detection of some character names to speak rolls as by trimming leading and trailing spaces
* **Bugfix**: *Roll20*: Fix custom chat messages not displaying correctly when using the Beyond20 roll renderer
* **Bugfix**: *Astral*: Changed implementation of roll buttons (when using digital dice) to work after reloading the page. They should work consistently now. (by [@adriangaro](https://github.com/adriangaro))
* **Bugfix**: *Astral*: Fixed digital dice rolls / rendered rolls for Astral. Reverted to normal behaviour when no dice are rolled. (by [@adriangaro](https://github.com/adriangaro))
* **Bugfix**: *Astral*: Fixed Astral access token acquisition in some specific edge cases. (by [@adriangaro](https://github.com/adriangaro))
* **Bugfix**: *Astral*: Fixed some issues related to slow loading of chat widget in Astral. (by [@adriangaro](https://github.com/adriangaro))
* **Bugfix**: *Astral*: Changed rendered roll formulas in Astral using the syntax recommended by @Redmega. (by [@adriangaro](https://github.com/adriangaro))
* **Bugfix**: *Astral*: Fixed some errors related to speak as character functionality. (by [@adriangaro](https://github.com/adriangaro))
* **Misc**: Clarify the text for the "click the features and traits" alert on new character sheets (by [@Aeristoka](https://github.com/Aeristoka))
* **Misc**: Remove the mention from the "send custom notes" feature information that falsely stated being supported on Roll20 only
* **Misc**: Rename the "Fighter: Sharpshooter" option to "Feat: Sharpshooter" to be more accurate
* **Misc**: Rename the "Rage: You are raging" option to "Barbarian: Rage!" to be more in line with other options formatting
* **Misc**: Add an information banner in the extension popup on non D&D Beyond and VTT pages to decrease confusion on how to use the extension
* **Misc**: Updated to the website's FAQ


v2.2.1 (October 4th 2020)
===

* **Feature**: Make the quick roll tooltip stay longer after hover to more easily interact with it
* **Bugfix**: *Roll20*: Fix issue preventing rolls from appearing on Roll20 when the character sheet template isn't OGL
* **Bugfix**: Fix missing "Roll Damages" button when auto-roll-damages is disabled
* **Bugfix**: Fix issue preventing damage-only rolls from working if auto-roll-damages was disabled
* **Bugfix**: Fix a possible crash when rolling an attack that has no damage
* **Bugfix**: Fix the roll formula being incorrect when having both Reliable Talent/Silver Tongue class feature and Halfling Luck
* **Bugfix**: Do not bind the quick roll area to the versatile damage digital dice button as it can be confusing
* **Bugfix**: Move the quick roll tooltip to appear on the left/right for the to-hit and damage roll areas to avoid overlapping with D&D Beyond's tooltip for damage type
* **Bugfix**: Fix Elemental Adept class feature rolling an incorrect damage formula when the spell includes static modifiers
* **Bugfix**: *Roll20*: Fix the independent to-hit and damage rolls rolling the full attack on Roll20 with digital dice disabled
* **Bugfix**: *Roll20*: Fix possible race condition with chrome extensions that may prevent proper detection of OGL sheet template use in a campaign

v2.2 (October 3rd 2020)
===

* **Feature**: Add support for Astral Tabletop (by [@adriangaro](https://github.com/adriangaro))
* **Feature**: Add support for rolling instruments as tools (by [@John-Paul-R](https://github.com/John-Paul-R))
* **Feature**: Add ability to roll attack and damage separately from the quick-rolls area
* **Feature**: *Roll20*: Add ability to use the OGL sheet when rolling with Digital Dice enabled
* **Feature**: Improve the Digital Dice notification to show only the first full roll with modifiers
* **Feature**: Add an alert to the user to remind them to visit the Features & Traits page when the sheet is new or after a level up
* **Feature**: Add a setting for overriding the critical limit on attacks (for magical/homebrew items that grant that ability)
* **Feature**: Add "Roll Twice" as an option when querying the user for the roll type
* **Feature**: Set the "Normal Roll" as the first/default option when query the user for the roll type
* **Feature**: Show indicator of adv/disadv when rolling initiative as it rolls as a single formula
* **Feature**: Add support for displaying an Artificer's infusions
* **Feature**: Add support for displaying the background feature to VTT
* **Feature**: Add Beyond20 dice icons to roll from the action/feature snippets directly
* **Feature**: Move the user query for advantage/disadvantage roll to the D&D Beyond page
* **Feature**: Move the user query for custom skills to the D&D Beyond page
* **Feature**: Move the user query for rolling tools and instruments to the D&D Beyond page
* **Feature**: Add a "Use Tool" and "Use Instrument" button for tools and instrument items
* **Feature**: Save the last choice made by the user in the whisper/advantage query dialogs
* **Feature**: Add ability to send custom chat messages/macros to VTT when doing a roll (by [@John-Paul-R](https://github.com/John-Paul-R))
* **Feature**: Roll the Spell Attack as a full attack instead of a custom d20 modifier. Allows use of the advantage settings
* **Feature**: Add the ability to switch the D&D Beyond sidebar to the selected spell's level when clicking on a spell which is the same as the one already displayed, but at a different level
* **Feature**: Add support for Halfling Luck feature
* **Feature**: Add support for Fey Wanderer's Dreadful Strikes (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Barbarian's Indomitable Might (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for fighter's Remarkable Athlete (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Alchemist Artificer's Alchemical Savant (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Artificer's Armorer Power Armor attacks (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Oath of Conquest: Invincible Conqueror (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Wildfire Druid: Enhanced Bond (by [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for conditionally enabling the Divine Fury class feature
* **Feature**: *FVTT*: Add support for Foundry VTT 0.7.x
* **Feature**: *FVTT*: Call a hook with the roll request data to let modules handle intercept and handle the roll instead (to allow for native rolls)
* **Bugfix**: Fix rolling spells multiple times when using the cast button after changing the spell level
* **Bugfix**: Don't query for roll type when rolling initiative with "roll twice" set, and instead only add the first result to tracker
* **Bugfix**: Fix the Display Avatar option not sending the avatar to discord when rolling to Roll20/FVTT at the same time
* **Bugfix**: Fix detecting the character's level when they've reached level 20 on XP progression, as the XP bar gets filled instead of showing level 20
* **Bugfix**: When digital dice are enabled, move the quick roll area for abilities to the digital dice button
* **Bugfix**: Set the quick roll area to the correct section of the sheet when the sheet is configured to show the modifier in the primary abilities box
* **Bugfix**: Add quick roll to the initiative button in mobile layout
* **Bugfix**: Don't roll crit damage on conditional damage of a monster statblock that applies on a saving throw
* **Bugfix**: Fix detecting the Escape DC for attacks from monster stat blocks
* **Bugfix**: Fix rolls with invalid modifier for attacks in monster stat blocks that do not have a to-hit value
* **Bugfix**: Fix the missing comma separating saving throws in a monster stat block after Beyond20 adds its dice
* **Bugfix**: Fix parsing of skills with spaces ('Sleight of hand', 'Animal Handling') in a monster stat block
* **Bugfix**: Fix display of damages in Roll20 when using the roll renderer, for multiple damages of the same type
* **Bugfix**: Do not add a "Roll Damages" button if auto-roll-damages is disabled but the attack has no damages
* **Bugfix**: Add support for Paladin's Improved Divine Smite when used with Polearm Master Bonus Attack (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix Polearm Master Bonus Attack not applying for Tavern Brawler Strikes (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix Polearm Master Bonus Attack not applying Paladin's Improved Divine Smite (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix Polearm Master Bonus Attack not applying Great Weapon Fighting rerolls (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix Polearm Master Bonus Attack not applying for Tavern Brawler Strikes (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix parsing of character level when using XP-based progression (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix Discord logo overlapping over the settings description (by [@John-Paul-R](https://github.com/John-Paul-R))
* **Bugfix**: Fix popup content overlapping the header in the quick settings dialog (by [@John-Paul-R](https://github.com/John-Paul-R))
* **Bugfix**: Fix item description not properly replacing all html entities (by [@John-Paul-R](https://github.com/John-Paul-R))
* **Bugfix**: Fix quick roll notification being shifted down if a banner is shown on D&D Beyond site
* **Bugfix**: Fix monster parsing when an attack has no damage
* **Bugfix**: Use local storage for storing settings, which should fix settings not saving for some users
* **Bugfix**: Hide the character's name in conditions display if it appears twice when the player speaks as the character (by [@macmaxbh](https://github.com/macmaxbh))
* **Bugfix**: Fix "Force Critical" not working for characters with Improved Critical feature
* **Bugfix**: Apply Great Weapon Fighting to brutal damage dice
* **Bugfix**: *FVTT*: Fix updating token health for Simple Worldbuilding System
* **Bugfix**: *FVTT*: Only update tokens HP for tokens that the user owns
* **Bugfix**: *FVTT*: Fix detection of critical hits on 0.7.x
* **Bugfix**: *FVTT*: Force the dice details in the tooltips to be auto expanded
* **Bugfix**: Prevent custom dice from affecting the critical failure/critical success state of attack rolls
* **Bugfix**: Fix "Artificer Chaos Bolt" and Izzet Engineer background and spell sources not being detected correctly (by [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix handle of special features that depend on an ability being used, when doing a custom skill or tool roll
* **Bugfix**: Fix Advantage/Disadvantage badges on skills not being applied anymore (by [@Aeristoka](https://github.com/Aeristoka))
* **Misc**: Improve FAQ about using Beyond20 with Foundry VTT (by [@shadow7412](https://github.com/shadow7412))
* **Misc**: *FVTT*: Do not use Foundry VTT 0.7.x deprecated APIs based on the running version
* **Misc**: Remove testimonials from site's main page and add link to reviews instead
* **Misc**: Add banner/ad for [The Forge](https://forge-vtt.com) to the main site

v2.1.1 (July 11th 2020)
===
* **Feature**: Add synchronization of D&D Beyond's combat tracker with Roll20's Combat tracker (By [@shadow7412](https://github.com/shadow7412))
* **Feature**: Add support for the Wizard's Bladesong class feature (By [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Aarakocra Talons as Natural Weapons (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix incorrect detection of "To Hit" values (spells in action page and customized weapons) 
* **Bugfix**: Prevent initiative rolls from being sent twice  
* **Bugfix**: Fix HP not syncing immediately if applying damage/healing from the main page directly
* **Bugfix**: *Roll20*: Show the spell's name when rolling a spell without to-hit using the Beyond20 renderer
* **Bugfix**: *Roll20*: Fix "Display in VTT" for a monster's avatar when using the Beyond20 renderer 

v2.1 (July 8th 2020)
===
* **Feature**: Add Quick Roll Area to the Digital Dice buttons for "To Hit" and "Damages" in Actions and Spells tabs
* **Feature**: Add support for the Bard's Silver Tongue class feature (By [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Natural Weapons (Claws, Bites, Tails, Ram, Horns, Hooves, etc..) (By [@Aeristoka](https://github.com/Aeristoka)) 
* **Feature**: Add support for Dragon's Breath Spell attack (By [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Add support for Path of the Zealot's Divine Fury (By [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Use a slightly less biased random number generator (1 in a few trillion chances of having a biased result) (By [@shadow7412](https://github.com/shadow7412))
* **Feature**: *FVTT:* Save Roll information in ChatMessage (allows interoperability with Dice So Nice module) (By [@Aeristoka](https://github.com/Aeristoka))
* **Feature**: Make Quick Roll icon clickable and change the mouse pointer when hovering on it
* **Feature**: Change the Quick Roll tooltip's arrow to point to the quick roll area instead of the tooltip itself, to avoid confusion
* **Feature**: Make Quick Roll areas show a clickable mouse pointer
* **Feature**: Hide monster names when showing their avatars in whisper mode
* **Feature**: Query for whisper type on the D&D Beyond page instead of the VTT which allows the "Ask every time" option to work with Discord integration
* **Feature**: Add hint in the settings popup about the Shift/Ctrl/Alt hotkey for changing the roll type 
* **Feature**: Add support for monster that do multiple damages of a single type (Orc War Chief)
* **Bugfix**: Fix support for the new Character Sheet update of D&D Beyond's 7th of July update
* **Bugfix**: Fix adding the initiative to the initiative tracker when using the Digital Dice
* **Bugfix**: Fix Cast button not working when using the Quick Roll area to click on it
* **Bugfix**: Fix issue with rolling hit dice (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix issue with Polearm Master Bonus attack and Great Weapon Fighting (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix issue preventing Chaos Bolt from working properly (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix issue with Brutal Critical/Savage Attacks when using "Perfect Dice" critical homebrew rules (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix custom damage parsing when using ":" as separator without a space (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix roll type query not appearing when a skill check has an advantage/disadvantage badge (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix display issue with some sentences that were garbles after the python to javascript conversion
* **Bugfix**: Fix issue with separate roll damages breaking when character's name has a quotation mark in it
* **Bugfix**: Small fix to quick roll tooltip position so it is better centered
* **Bugfix**: Fix initiative value not updating when switching between statblocks in the Encounters page
* **Bugfix**: Fix parsing of some monster stat blocks that had non-breaking spaces in their actions' descriptions
* **Bugfix**: Fix issue of displaying results of zero when doing a monster's attack that has a to-hit value but no damages
* **Bugfix**: Fix issue with rolling actions that have "--" as their "To Hit" value (Fist of Unbroken Air)
* **Bugfix**: *Roll20*: Fix newly introduced bug where custom roll modifiers that uses queries may not change the roll to display as a critical hit when it's not
* **Bugfix**: *Roll20*: Fix bug where damages could not be rolled separately on a monster with "Hide Monster and Attack Name" whisper mode
* **Bugfix**: *Roll20*: Show critical success/failure colored results on rolls using the Beyond20 roll renderer
* **Bugfix**: *Roll20*: Change the Beyond20 renderer display so it doesn't say "To Hit" on non attack rolls
* **Bugfix**: *Roll20*: Add the "Roll Damages" button when using the Beyond20 renderer with the 'auto roll damages' option disables
* **Misc**: Improved and more standard build and packaging process (By [@moritonal ](https://github.com/moritonal))


v2.0 (June 2nd 2020)
===
* **Feature**: Add integration with the D&D Beyond Digital Dice
* **Feature**: Update the Beyond20 icon sets to make them more beautiful and usable at low resolutions. Icons provided by [Jerry Escandon](https://github.com/Jerryescandon)
* **Feature**: *Discord*: Add a channel manager for Discord secret keys to allow easily switching channel destinations](https://github.com/Brunhine))
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
* **Bugfix**: Fix handling of Great Weapon Fighting for the Polearm Master bonus action (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Roll Sneak Attack damages on Psychic Blades action (By [@Aeristoka](https://github.com/Aeristoka))
* **Bugfix**: Fix saving throws quick roll not working anymore (By [@kbuzsaki](https://github.com/kbuzsaki))
* **Bugfix**: Do not display duplicate custom dice icons in the class features list
* **Bugfix**: Fix the integrated dice roller not rolling 'd4' formulas (instead of '1d4') such as in the Bless spell
* **Bugfix**: Apply Great Weapon Fighting rerolls to a weapon's additional damages
* **Bugfix**: Fix Cleric's Life Transference damage being wrongly calculated
* **Bugfix**: Fix custom damage labels being ignored for spells and actions
* **Bugfix**: Fix class feature descriptions not being properly displayed
* **Bugfix**: Fix rolling tools from Equipment due to change in equipment type
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

v1.1 (April 9th 2020)
===
* **Feature**: Add support for the new D&D Beyond character sheet layout
* **Feature**: Save and cache spell modifiers/attack/save DC information from character sheets
* **Feature**: Add support for dice formulas using "+ your spell save DC" or "+ your Wizard spell attack", etc..
* **Feature**: Add ability to specify the damage type in custom damage formulas
* **Bugfix**: Always round initiative value to decimal when using the tie breaker option
* **Bugfix**: Don't send HP update information to VTT if HP syncing is disabled
* **Bugfix**: Remove trailing spaces from character names to avoid issues with HP syncing name match
* **Bugfix**: Fix damage total calculation breaking when enabling Rage
* **Bugfix**: Fix damage total calculation breaking when enabling Sharpshooter
* **Bugfix**: Fix statblock detection for character sheet creatures when using the integrated dice roller
* **Bugfix**: Fix issue with the "Send rolls to" being reset to an invalid value when changing settings
* **Bugfix**: *FVTT*: Fix detection of FVTT tab when using a route prefix
* **Misc**: Fix Donate button size being too big in the popout dialog in non-dnd/roll20/fvtt websites
* **Misc**: *Chrome*: Add permissions for forge-vtt.com as I prepare for using a new domain

v1.0 (March 16th 2020)
===
* **Feature**: Added [Discord integration](/discord) via the new Beyond20 Discord Bot!
* **Feature**: Add setting for adding a dexterity tie breaker to initiative rolls (Contributed by Jeremy '[@jaypoulz](https://github.com/jaypoulz)' Poulin)
* **Feature**: Track the monster stat blocks from the new encounter page and combat tracker
* **Feature**: Add support for parsing the avatar of the character/monster and preview image of attacks/items/spells (used in Discord integration)
* **Feature**: Improved dice formula parsing for D&D Beyond integrated dice roller
* **Feature**: Use "Display in VTT" button only for spells/items that do not generate attack or damage rolls
* **Feature**: Add support for parsing "+ your AC" or "+ your Armor Class" dice formulas in description text
* **Feature**: Allow manually selected super-advantage to remain active when rolling with features that force advantage (such as the Rogue's Assassinate)
* **Feature**: *Roll20*: Improve display of Temp HP when assigned to a token bar
* **Feature**: *FVTT*: Add support for HP sync with worlds using the Simple Worldbuilding System
* **Bugfix**: Fix Quick Roll feature not working properly for spells when character has available spell slots
* **Bugfix**: Fix rolling attack roll for weapons affected by magic items
* **Bugfix**: Reset roll type key modifiers (shift, alt, ctrl) when window is unfocused to prevent wrong state in cases of Ctrl-Tab for example
* **Bugfix**: Fix support for disadvantage key modifier with Ctrl/Cmd on Mac OS 
* **Bugfix**: Fix the use of the proper modifier in formulas that have "+ your proficiency bonus"
* **Bugfix**: Apply Hexblade's Curse critical hit on 19 for all attacks, not only weapon attacks
* **Bugfix**: Fix Monster skill checks not adding the modifier when rolled from the new Encounters page
* **Bugfix**: Fix rolling of weapons with no item properties, such as Maces
* **Bugfix**: Fix negative modifiers not being applied to damages when using integrated roller
* **Bugfix**: Consider Vehicle stat blocks as Monsters with regards to the whisper monster rolls setting
* **Bugfix**: Don't consider the "0 hit points by this damage" for the Demon Grinder Vehicle as a damage of type "hit points by this"
* **Bugfix**: *Roll20*: Fix syncing of temp HP with token bars
* **Bugfix**: *FVTT*: Fix updating initiative on combatants already in encounter
* **Bugfix**: *Firefox*: Fix condition tracking not working properly
* **Misc**: Various small miscellaneous fixes
* **Misc**: Add The Forge (https://forgevtt.com) as a whitelisted FVTT server for Chrome
* **Misc**: Add transparency to the roll type indicator to make it less conspicuous


v0.9 (February 13th 2020)
===

* **Feature**: Add indicator on roll buttons to identify the roll type (advantage, disadvantage, roll twice, etc...)
* **Feature**: Add synchronization of Temporary HP to tokens and character sheets in Roll20 and FVTT
* **Feature**: Add support for HP and Temp HP synchronization for character sheet creatures from the Extra section
* **Feature**: Add a "Display to VTT" button on Equipment and Magic Items pages of D&D Beyond
* **Feature**: Support rolling with Advantage when clicking with the Shift button pressed
* **Feature**: Support rolling with Disadvantage when clicking with the Ctrl button pressed
* **Feature**: Support rolling normally (with no advantage/disadvantage/double rolls) when clicking with the Alt button pressed
* **Feature**: *Firefox*: Add buttons to access Quick Settings menu from Firefox (added for Chrome in v0.7 but finally got it working for Firefox)
* **Feature**: Add option to force an auto-crit on all attacks (against paralyzed enemies for example)
* **Feature**: Add the ability to roll multiple separate custom damage dice, by separating them with a comma (for use with Green-flame Blade for example)
* **Feature**: Add support for spells that add Temp HP instead of healing (such as False Life)
* **Feature**: Add support for Polearm Master Feat, which considers the bonus action as melee
* **Feature**: Add support for Fighter's UA Rune Knight's Giant Might class feature
* **Feature**: Add support for Artificer's Arcane Firearm class feature
* **Feature**: Add support for Draconic Sorcerer's Elemental Affinity class feature
* **Feature**: Add support for rolling the Bardic Inspiration dice, and Blade Flourishes for the College of Swords
* **Feature**: Add support for Cleri's Divine Strike class feature
* **Feature**: Add support for Whispers Bard's Psychic Blades class feature
* **Feature**: Add Attack buttons to roll the to-hit with damage on the various object sizes in the Animate Objects spell description
* **Bugfix**: Fix custom/concentration/ritual Spells and custom weapons which to-hit value was not being parsed properly due to a DNDB website change
* **Bugfix**: Fix quick roll tooltip from being at the wrong position when the page was not scrolled to the top
* **Bugfix**: Fix character settings not being saved properly. Caused double output of conditions on Firefox
* **Bugfix**: Support parsing of monster statblocks from the new My Encounters popup window for monsters
* **Bugfix**: More lax statblock parsing, which fixes the actions from monster 'Orcus' not being parsed properly
* **Bugfix**: Reroll all the dice in a critical hit if a custom dice formula had additive dice formulas
* **Bugfix**: Fix "Display to VTT" button position for Spell pages
* **Bugfix**: *Roll20*: Use /me instead of /emas for condition mapping if user is not a GM as /emas is a GM-exclusive command
* **Bugfix**: *FVTT*: Fix HP syncing for actors when the scene doesn't have a token of the character sheet on it
* **Misc**: Make the Quick Rolls tooltip move with the mouse, as some people were confused by its position, not understanding it was a tooltip
* **Misc**: Make the D&D Beyond Dice roller animation less flashy and quicker to appear
* **Misc**: Added the 'sponsor' button on the github page, and registered for the Github Sponsors program


v0.8 (December 6th 2019)
===

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
* **Bugfix**: Fix Great Weapon Fighting dice reroll being mistakenly applied on some two-handed non-melee weapons
* **Bugfix**: Fix the spell level/school display missing spaces introduced in the recent code refactor of v0.7
* **Bugfix**: Fix character action list not being properly cached which may lead to loss of character options on mobile
* **Bugfix**: Fix parsing of stat block attacks for Clay Gladiator and Scout which had typos in the official D&D Beyond pages
* **Bugfix**: Fix Spell Attack roll which show displayed the modifier instead of rolling the 1d20
* **Bugfix**: *FVTT*: Fix dice roll formulas in descriptions not being clickable in FVTT 0.4.x
* **Bugfix**: *Dice Roller*: Fix display bug on rolls after opening the quick settings dialog
* **Bugfix**: Fix full settings window opening donate link inside the iframe instead of a new tab

v0.7 (November 19th 2019)
===

* **Feature**: Add a Dice Roller within D&D Beyond for players not using Roll20 or FVTT
* **Feature**: Add option for alternate critical damage calculations based on common homebrew rules
* **Feature**: Add an 'incognito' monster whisper mode where rolls are displayed but monster name and action names are hidden
* **Feature**: Add a 'Roll Initiative' button to monster/vehicle stat blocks (rolls dexterity but allows adding to tracker)
* **Feature**: Add a "Roll Twice" option when querying the user for advantage.
* **Feature**: *Chrome*: Add a Beyond 20 button to D&D Beyond and VTT pages for easy access to quick settings
* **Feature**: Open the 'More Options' link as dialogs within the page instead of opening the browser's extension page
* **Feature**: Add support for Bloodhunter's Crimson Rite feature
* **Feature**: Add support for Ranger's Dread Ambusher feature
* **Feature**: Add support for Paladin's Legendary Strike (UA) feature
* **Feature**: Add support for Warlock's Hexblade's Curse feature
* **Feature**: Add support for Rogue's Assassinate feature
* **Feature**: *FVTT & Dice Roller*: Standardize appearance of chat messages when using simple rolls
* **Feature**: *FVTT & Dice Roller*: When rolling with advantage/disadvantage, display both rolls instead of only the result
* **Bugfix**: *Roll20*: Fix Brutal Critical/Savage Attacks brutal damage not being rolled on some critical rolls
* **Bugfix**: *Roll20*: It seems Beyond 20 now works in Roll20's popped out chat window
* **Bugfix**: *FVTT*: Show the world's title instead of its name in the browser's tab title
* **Bugfix**: *FVTT*: Critical hits of 18 or 19 (due to Improved or Superior Critical features) now appear green as expected
* **Bugfix**: Make parser for monster actions in stat blocks less rigid so it can find action names in some homebrew monsters
* **Bugfix**: Fix item/feature or spell descriptions not being properly displayed when they contain lists
* **Misc**: Use non-intrusive notification when opening a character sheet and no VTT window is found
* **Misc**: Add monster specific options to a monster page's quick settings menu
* **Misc**: Fix typos of "Save Attacks" instead of "Savage Attacks"
* **Misc**: Using the new in-page quick settings dialog, setting a custom dice formula and dismissing the dialog will now accept the change
* **Misc**: Updated donate link to redirect to beyond20.here-for-more.info/rations instead of paypal.me/kakaroto
* **Misc**: *FVTT*: Major refactor of how message rendering is done internally to allow for the dice roller to work

v0.6 (September 20th 2019)
===

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

v0.5 (August 13th 2019)
===

- **Feature**: Roll the appropriate die when clicking on a Superiority Die or Maneuvers feature instead of displaying its description
- **Feature**: Query for skill and proficiency when rolling a tool from the equipment
- **Feature**: Improve support for casting Chaos Bolt spell.
- **Feature**: *FVTT*: Add custom support for Chromatic Orb and Chaos Bolt spells.
- **Bugfix**: Fix rolling from spell pages not working anymore
- **Bugfix**: Roll damages even without a "To-Hit" for Custom Actions
- **Bugfix**: *FVTT*: Clicking 'Roll Damages' when auto-roll damage is disabled will now re-roll the damage dice.
- **Misc**: Decrease Chrome extension permissions and require manual activation for FVTT installations (See [Release Notes](release_notes#v05) for more information)
- **Misc**: Replace all remaining occurrences of "Roll20" with "VTT"

v0.4 (July 3rd 2019)
===

- **Feature**: Add option to decide if character is using one-handed or two-handed versatile weapons
- **Feature**: *FVTT*: query for advantage and custom skills.
- **Feature**: *FVTT*: Replace dice in description text.
- **Feature**: *FVTT*: Add support for the auto-roll damage option
- **Feature**: *FVTT*: Nicer display output for rolls
- **Feature**: Add "Roll20 Template" option in the Roll20 popup menu
- **Bugfix**: Fix non-visible messages on Roll20 when using other templates even if template is set to 'Other templates'
- **Bugfix**: No need to roll critical damages for spells that have no 'to-hit'. Fixes 3d Dice rolls doubled on healing spells.
- **Bugfix**: Fix spell attack dice disappearing
- **Misc**: Remove the green/red on death saving throws above/below 10 as it was apparently confusing to players (might re-add as an option).

v0.3 (June 18th 2019)
===

- **Feature**: Support for sending the rolls to [Foundry Virtual TableTop](http://foundryvtt.com) (FVTT) as an alternative to Roll20
- **Feature**: The Whisper rolls Yes/No option has now become a Yes/No/Query where it can now prompt the user on every roll
- **Feature**: The Roll Advantage Yes/No Option has now become a Normal/Double/Query/Advantage/Disadvantage option
- **Feature**: Add support for Melee/Ranged Spell attack actions for monster stat blocks.
- **Feature**: Parse "+ your <class> level" or "+ your <ability> bonus" to the dice formula parsing algorithm.
- **Feature**: Support the new "My Encounters" website format since the recent D&D Beyond update.
- **Bugfix**: *Roll20*: Fix HP syncing when it didn't always update the HP in the character sheet itself.
- **Bugfix**: Make attack buttons in monster stat blocks styled correctly after D&D Beyond removed the CSS for it
- **Bugfix**: Fix action descriptions having extra spaces in a monster stat block
- **Bugfix**: Fix damage for actions (like Unarmed attacks) when a custom dice is set.
- **Bugfix**: More relaxed monster action parsing algorithm to work better with homebrewed monsters.

v0.2 (May 29th 2019)
===

- **Feature:** Add per character custom roll and damage dice formulas
- **Feature:** Add option to disable auto-roll damage and crit dice
- **Feature:** Add support for the Fighter's Improved Critical and Superior Critical features
- **Feature:** Add support for the Barbarian's Brutal Critical and Half-Orc's Savage Attacks features
- **Feature:** Add support for Barbarian Rage (damage and advantage on STR rolls)
- **Feature:** Add special support for Chromatic Orb spell to ask for the damage type to use
- **Feature:** Add support for rolling abilities on Vehicles
- **Bugfix:** Fix Jack of All Trades being broken in v0.1
- **Bugfix:** Fix clicking the Display button executing the roll too
- **Bugfix:** Fix dice replacement in monster pages if the feature/action name has a "+X" in it
- **Bugfix:** Fix encounter page not being handled if navigated to from the my-encounters page directly
- **Bugfix:** Disable options until settings are loaded to avoid changing an option then getting it overwritten
- **Misc:** Per user request, updated Donate link to one that allows paying with credit cards
- **Misc:** HP syncing is now a global setting instead of a per-character setting
- **Misc:** Clean up of quick settings window to make room for more per-character options


v0.1 (May 21st 2019)
===

- **Feature:** Full support for Monster stat blocks and character Creatures (roll for Abilities, Saves, Skills and Weapon attacks)
- **Feature:** Add support for rolling monsters from the My Encounters page
- **Feature:** Add support for rolling dice and display spell cards from Spell pages
- **Feature:** Add Class/Racial Features parsing and new options for using Sharpshooter and Great Weapon Master Feats
- **Feature:** Add option to choose what components to display during a spell attack
- **Misc:** Major improvement to the way rolls are displayed when clicked from descriptions in the Roll20 chat
- **Misc:** Only allow Disciple of Life option if the Cleric is of the Life domain
- **Misc:** Change the way Sneak attack bonus is sent so it also gets doubled if Crit

v0.0.9 (May 19th 2019)
===

- **Feature:** Add preliminary Monster and Creatures support (only dice formulas are clickable for now)
- **Bugfix:** Fix Firefox support which got completely broken in 0.0.8
- **Bugfix:** Correctly fix the HP syncing feature and add support for HP=0.
- **Bugfix:** Fix wrong damage value in with weapons that have multiple types of damages
- **Bugfix:** Fix critical damage rolls for multi-damage attacks

v0.0.8.1 (Firefox-only)
===

- **Bugfix:** Fix bug where HP management only works if VTT ES extension is installed

v0.0.8 (May 18th 2019)
===
- **Feature:** Add support for HP management (Requires VTT ES extension installed, for now)
- **Feature:** Add ability to select which Roll20 page to send the rolls to
- **Feature:** Add per-character settings to roll Sneak Attack, Disciple of Life, Jack of all Trades
- **Feature:** Add roll dice icon to spell attack modifier
- **Misc:** Brand new website!

v0.0.7 (May 15th 2019)
===

- **Feature:** Add support for Firefox
- **Feature:** Add a "Display in Roll20" button for weapons and attack spells
- **Feature:** Add support for custom skills
- **Bugfix:** Don't roll the second dice in 3D dice roller if not rolling with advantage
- **Bugfix:** Fix damage output with multiple additional damages in custom weapons
- **Bugfix:** Fix GreenFlame Blade damage output when level < 5

v0.0.6 (May 9th 2019)
===

- **Feature:** Add option to send initiative to the turn tracker
- **Feature:** Add support for Firefox and fix firefox specific issues
- **Bugfix:** Fix 1d20 added to spell description for +x modifiers
- **Misc:** Change the "First/Second Roll" for other templates into a better name

v0.0.5 (May 7th 2019)
===

- **Bugfix:** Fix issue with settings getting reset if we modify an option in the toolbar popup
- **Misc:** Change tag names for default template rolls to make them more readable

v0.0.4 (May 7th 2019)
===

- **Feature:** Add support for other roll20 character sheet templates
- **Bugfix:** Fix custom dice formulas getting messed up if we change spell level casting

v0.0.3 (May 6th 2019)
===

- **Feature:** Add option to disable substitution of dice formulas
- **Feature:** Add option for critical hit prefix
- **Bugfix**: Fix dice formula detection

v0.0.2 (May 6th 2019)
===

- **Feature:** Add a settings window and a popup menu to quickly change settings
- **Feature:** Add option to not always roll with advantage
- **Feature:** Inject into shared D&D Beyond character sheet, not just our own creations
- **Feature:** Switch to page actions (toolbar icon highlighted only on dndbeyond and roll20 pages)
- **Bugfix:** Fix double roll of equipment items when clicking on the beyond20 button in the top-right


v0.0.1 (May 5th 2019)
===
- Initial release with support for all types of roles
