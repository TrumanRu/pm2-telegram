'use strict';

const DEFAULT_SEND_INTERVAL = 10;

const { ConfigTextFormat } = require('./config-text-format');

/**
 * PM2 config section in package.json
 * @typedef PackageConfig
 * @type Class
 * @property {string} title - name of the server/process
 * @property {boolean} collate - collect multiple buffered messages into one message (with length less than Telegram max message length)
 * @property {boolean} log - notify on console.log() event
 * @property {boolean} error - notify on console.error() and console.warn() events
 * @property {boolean} kill - notify on PM2 process kill
 * @property {boolean} exception - notify on exception
 * @property {string} bot_token - Telegram bot token
 * @property {string} chat_id - Telegram chat id (use 'g' prefix gor group ig with leading '-' - 'g-1234567890')
 * @property {string} text_format - set 'Markdown' to format send messages
 * @property {string} process_whitelist - list of processes to only include in log forwarding
 * @property {string} process_blacklist - list of processes to exclude from logging (ignoring if whitelist is not empty)
 * @property {number} send_interval - send interval in seconds
 */

/**
 * @param {string} list
 * @returns {string[]}
 */
function getProcessList(list) {
  return list.split(',').reduce(/** @param {string[]} acc */ (acc, value) => {
    const tmpValue = value.trim()
    if (tmpValue.length > 0) {
      acc.push(tmpValue);
    }
    return acc;
  }, [])
}

/**
 * @type {PackageConfig}
 */
class Config {
  /**
   * @param {PackageConfig} packageConfig
   */
  constructor(packageConfig) {
    this.init(packageConfig);
  }

  /**
   * @param {PackageConfig} packageConfig
   */
  init(packageConfig) {
    Object.assign(this, packageConfig);
    const { process_whitelist, process_blacklist, text_format, send_interval } = packageConfig;

    this.send_interval = Math.floor(send_interval);
    this.send_interval = (Number.isNaN(this.send_interval) || this.send_interval <= 0)
      ? this.send_interval = DEFAULT_SEND_INTERVAL * 1000
      : this.send_interval * 1000;
    this.white_list_config = process_whitelist ? getProcessList(process_whitelist) : [];
    this.black_list_config = process_blacklist ? getProcessList(process_blacklist) : [];

    this.text_format_config = new ConfigTextFormat(text_format);
  }
}

module.exports = {
  Config,
}