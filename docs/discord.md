# Discord Integration

Since version 1.0, you can add Beyond 20 integration with Discord, where all yours rolls are sent to a discord channel of your choice.

The process is easy and involves three simple steps :

## 1 - Invite the Beyond20 Discord Bot

To enable this feature, you must first invite the Beyond20 bot into your Discord server by clicking [here](https://beyond20.kicks-ass.org/invite).

Once the Beyond 20 bot is in your server, you can send commands to it, try `!beyond20 info` to get more information.

## 2 - Get your Discord Secret Key

In order for the Beyond20 extension to know where to send rolls, and to prevent unauthorized people from spamming you or your server channels, you will need to give it a `secret key`.

As owner of a server, you can send the command `!beyond20 secret` in any channel where the bot has joined, and it will reply with a secret key that allows you to send rolls to that channel. You may share that key with your players so they can also send rolls to that channel.

If you are not a server owner, you can send the command `secret` in a Direct Message to the bot and the secret key you will receive will allow it to send rolls to you directly in private. As a DM, you could share it with your party members to get rolls sent to you as whispers.

## 3 - Set the Discord Secret Key in Beyond 20

The Beyond 20 browser extension now needs to know where to send the rolls. Click the Beyond 20 options menu (the icon in the browser's address bar), then `More Options`, then scroll down towards the end of the list of options for the Discord Secret Key field, just below the Discord logo and paste the key there.

Save your settings, and you're good to go!

# Important notes

Make sure you didn't disallow link previews and embeds as the Discord bot uses embed messages to display its rolls.

Due to the nature of how Roll 20 creates its messages, you can only send your rolls to either Roll 20 or to Discord, not both at the same time.
If you use Roll 20 as your VTT and want to send rolls to Discord, click the Beyond20 options icon *within the Roll 20 tab*, and select "Send rolls to : D&D Beyond Dice Roller & Discord".

Also, the whisper setting will always be ignored when sending rolls to Discord, so you cannot have the rolls whispered to the Dungeon Master only, as messages sent to Discord will be visible to all who are in the channel. Your Dungeon Master however may create a channel in their server specific for whispers to which no players have permission to read messages and you can configure Beyond 20 to send rolls to that channel.

There is currently no easy way to switch from one channel to another, other than saving and pasting the secret key in the settings any time you wish to change channels. Eventually, I plan on making this easier.

# Secret key

For the moment, the 'secret key' cannot be revoked, so it's important not to get it leaked or you risk getting your channel spammed by someone. In that case, you can change the channel's permissions to prevent the bot from accessing it, and generate a new secret key for a different channel.

I will eventually improve things where the secret keys can be listed and revoked and new ones generated. I will also add more commands to the bot, which would allow you to customize its behavior for example.
