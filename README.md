[![npm package](https://img.shields.io/npm/v/pm2-telegram?logo=npm&style=flat-square)](https://www.npmjs.com/package/pm2-telegram)
# pm2-telegram
Telegram notifications for PM2 process manager

Thanks to:
* [pm2-telegram-notification](https://github.com/shubhroshekhar/pm2-telegram-notification)
* [pm2-telegram-notify](https://github.com/korolyov88/pm2-telegram-notify)

## Configuration

### Create bot
* create a telegram bot with Telegram's BotFather (look at [Telegram documentation](https://core.telegram.org/bots#creating-a-new-bot))
* get BOT_TOKEN from BotFather answer

### Get chat id
* add the bot to a group if you want to send notifications to a group
* send message from group to the bot: `/test Hello bot!` (use any command-like message started by slash)
* open sent message at `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`
```json
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
                    "id": -76543210, // this is chat_id!
                    "title": "My_Test_Group",
                    "type": "group",
                    "all_members_are_administrators": false
                },
                "date": 1649627436,
                "text": "/test Hello bot!",
                "entities": [{
                        "offset": 0,
                        "length": 6,
                        "type": "bot_command"
                    }
                ]
            }
    }]
}
```
> If you add another user(s) to the group this group's chat_id could be changed

### Start module
* install the module: `pm2 start pm2-telegram`
* set the bot token: `pm2 set pm2-telegram:bot_token <BOT_TOKEN>`
* set chat id: `pm2 set pm2-telegram:chat_id <CHAT_ID>`
  - if a group's chat id prepend it by `g-` to isolate minus sigh
   eg:
  
     group chat _CHAT_ID_ = `-76543210` -> `g-76543210`
  
     personal chat _CHAT_ID_ = `123456789` -> `123456789`

### Configure notifications
-= will be described =-
