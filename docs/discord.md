# Discord Integration

Since version 1.0, you can add Beyond 20 integration with Discord, where all yours rolls are sent to a discord channel of your choice.

The process is easy and involves three simple steps :

## 1 - Invite the Beyond20 Discord Bot

To enable this feature, you must first invite the Beyond20 bot into your Discord server by clicking [here](https://beyond20.kicks-ass.org/invite).

Once the Beyond 20 bot is in your server, you can send commands to it, try `!beyond20 info` to get more information.

## 2 - Get your Discord Secret Key

In order for the Beyond20 extension to know where to send rolls, and to prevent unauthorized people from spamming you or your server channels, you will need to give it a `secret key`.

As owner of a server, you can send the command `!beyond20 secret` in any channel where the bot has joined, and it will reply with a secret key that allows you to **send rolls to that specific channel**. You may share that key with your players so they can also send rolls to that channel.

You can also mention a specific channel or user for the rolls to be sent to, as well as a separate channel or user for whispers to be sent to it by adding arguments to that command. For example, to send to the `#beyond20-rolls` channel, you could do `!beyond20 secret #beyond20-rolls` and to send whispers to a `#whisper-rolls` channel, you would do `!beyond20 secret #beyond20-rolls whisper #whisper-rolls`. You can also use `!beyond20 secret #party-channel whisper @DMUser` for example.

If you are not a server owner, you can send the command `secret` in a Direct Message to the bot and the secret key you will receive will allow it to send rolls to you directly in private. As a DM, you could share it with your party members to get rolls sent to you as whispers.

## 3 - Set the Discord Secret Key in Beyond 20

The Beyond 20 browser extension now needs to know where to send the rolls. Click the Beyond 20 options menu (the icon in the browser's address bar), then `More Options`, then scroll down towards the end of the list of options for the Discord Secret Key field, just below the Discord logo and paste the key there.

Save your settings, and you're good to go!

# Important notes

Make sure you didn't disallow link previews as the Discord bot uses embed messages to display its rolls. In your discord's `User Settings`, under the `Text & Images`, make sure you enable the option under `Link Preview`

Due to the nature of how Roll 20 creates its messages, you can only send your rolls to either Roll 20 or to Discord, not both at the same time.
If you use Roll 20 as your VTT and want to send rolls to Discord, click the Beyond20 options icon *within the Roll 20 tab*, and select "Send rolls to : D&D Beyond Dice Roller & Discord".

# Whispers and extra options
If you do not specify a whisper channel, then the whisper setting will always be ignored when sending rolls to Discord. You can however specify a whisper channel using the command `!beyond20 secret #public-channel whisper #whisper-channel`.
You can also have the rolls whispered to the Dungeon Master directly by mentioning their name instead, such as `!beyond20 secret #rolls whisper @UsernameOfDM`. 

After the whisper setting, you can add extra options to the bot. The only currently supported option is `nospoilers` which will disable the Beyond20 bot from adding spoiler tags around the dice formulas. For example : `!beyond20 secret #public-channel whisper #whisper-channel nospoilers`.

# Secret key

The 'secret key' cannot be revoked, so it's important not to get it leaked or you risk getting your channel spammed by someone. In that case, you can change the channel's permissions to prevent the bot from accessing it, and generate a new secret key for a different channel.

In the case of sending rolls as Direct Messages, you cannot destroy that channel, so the only way would be to block the bot, which can have negative effects, so it is recommended to always use channels in your server for where the bot would send its messages, and create new channels just for the Beyond20 bot so you could destroy them if the need ever arises.
