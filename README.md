[![npm package](https://img.shields.io/npm/v/pm2-telegram?logo=npm&style=flat-square)](https://www.npmjs.com/package/pm2-telegram)

# pm2-telegram

**Telegram notifications for PM2 process manager.**

## Functions

* collect desired messages and send collected messages every 10 seconds
* allow messages scope selection (errors, logs, kill events and exceptions)
* truncate long messages (longer than 4096 character)
* combine short messages to avoid impact of Telegram messages frequency limitation (the resultant big message shorter than 4096 characters)
* set message title (for use one Telegram bot on many inctances)

###### Roadmap

* *(under development)* option to split long messages to many continuos messages (choose truncate or split)
* *(under development)* option to display real message's timestamp and set timestamp's format (HH:mm:ss.SSS)

## Setup

### Create bot

* create a telegram bot with Telegram's BotFather (look at [Telegram documentation](https://core.telegram.org/bots#creating-a-new-bot))
* get BOT_TOKEN from BotFather's answer

### Get chat id

* add the bot to a group if you want to send notifications to a group
* send message from group to the bot: `/test Hello bot!` (use any command-like message started by slash)
* open sent message at `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`

```javascript
{
    "ok": true,
    "result": [{
            "update_id": 123456789,
            "message": {
                "message_id": 1,
                "from": {
                    "id": 322223322,
                    "is_bot": false,
                    "first_name": "John",
                    "last_name": "Doe",
                    "username": "johndoe"
                },
                "chat": {
                    "id": -76543210, // <- this is chat_id!
                    "title": "My_Test_Group",
                    "type": "group",
                    "all_members_are_administrators": false
                },
                "date": 1649627436,
                "text": "/test Hello bot!",
                "entities": [{
                        "offset": 0,
                        "length": 5,
                        "type": "bot_command"
                    }
                ]
            }
    }]
}
```

* CHAT_ID is on `result.message.chat.id` property

> Notice: If you created group with only you and a bot but later you'll add second real user `chat.id` could be changed by Telegram. Check `chat.id` after add second real user!

### Start module

* install the module: `pm2 install pm2-telegram`
* set the bot token: `pm2 set pm2-telegram:bot_token <BOT_TOKEN>`
* set chat id: `pm2 set pm2-telegram:chat_id <CHAT_ID>`

> - for a group's chat id prepend it by `g-` to isolate minus sign, eg:
>   <br>group chat _CHAT_ID_ = `-76543210` -> `g-76543210`
>   <br>personal chat _CHAT_ID_ = `123456789` -> `123456789`

## Configure notifications

* to set any option use: `pm2 set pm2-telegram:<OPTION_NAME> <OPTION_VALUE>`

#### Notification options


| option name   | default | description                        |
| :------------ | :------ | :--------------------------------- |
| **error**     | true    | console.error() and console.warn() |
| **log**       | false   | console.log()                      |
| **kill**      | true    | kill PM2 process                   |
| **exception** | true    | exception in PM2 process           |

#### Module behavior options

| option name | default | description                                    |
| :-----------| :------ | :----------------------------------------------|
| **collate** | true    | combine short messages to one Telegram message |

#### Module description options

| option name | default      | description                                        |
| :---------- | :----------- | :------------------------------------------------- |
| **title**   | PM2-Telegram | messages title (could be used for set server name) |



---

###### Thanks for some ideas to:

* [pm2-telegram-notification](https://github.com/shubhroshekhar/pm2-telegram-notification)
* [pm2-telegram-notify](https://github.com/korolyov88/pm2-telegram-notify)
  

