'use strict';

const pmx = require('pmx');

/**
 * Get configuration from PM2
 * @property {string} title - name of the server/process
 * @property {boolean} collate - collect multiple buffered messages into one message (with length less than Telegram max message length)
 * @property {boolean} log - notify on console.log() event
 * @property {boolean} error - notify on console.error() and console.warn() events
 * @property {boolean} kill - notify on PM2 process kill
 * @property {boolean} exception - notify on exception
 * @property {string} bot_token - Telegram bot token
 * @property {boolean} chat_id - Telegram chat id (use 'g' prefix gor group ig with leading '-' - 'g-1234567890')
 * @property {string} text_format - set 'Markdown' to format send messages
 * @property {string} module_name
 * @property {string} whitelist - list of services to only include in log forwarding
 */
class Config {
  constructor() {
    this.init();
  }

  init() {
    Object.assign(this, pmx.initModule());
  }
}

module.exports = {
  Config,
};
