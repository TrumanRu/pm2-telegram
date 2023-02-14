'use strict';

/**
 * Get configuration from PM2
 * @typedef PackageConfig
 * @property {string} title - name of the server/process
 * @property {boolean} collate - collect multiple buffered messages into one message (with length less than Telegram max message length)
 * @property {boolean} log - notify on console.log() event
 * @property {boolean} error - notify on console.error() and console.warn() events
 * @property {boolean} kill - notify on PM2 process kill
 * @property {boolean} exception - notify on exception
 * @property {string} bot_token - Telegram bot token
 * @property {string} chat_id - Telegram chat id (use 'g' prefix gor group ig with leading '-' - 'g-1234567890')
 * @property {string} text_format - set 'Markdown' to format send messages
 * @property {string} process_white - list of processes to only include in log forwarding
 * @property {string} process_black - list of processes to exclude from logging (ignoring if whitelist is not empty)
 */
class Config {
  /**
   * @param {PackageConfig} packageConfig
   */
  constructor(packageConfig) {
    this.init(packageConfig);
  }

  /**
   * @param {PackageConfig} configObject
   */
  init(configObject) {
    Object.assign(this, configObject);
    this.processesWhitelist = this.process_white ? this.process_white.split(',') : [];
    this.processesBlacklist = this.process_black ? this.process_black.split(',') : [];
  }
}

module.exports = {
  Config,
};
