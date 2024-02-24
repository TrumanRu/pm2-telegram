'use strict';

class MessageQueue {
  /**
   * @param {Config} config
   */
  constructor(config) {
    this.values = [];
    this.whitelist = config.white_list_config;
    this.blacklist = config.black_list_config;
  }

  /**
   * @param {Message} message
   */
  push(message) {
    if (this.whitelist && this.whitelist.length > 0) {
      if (this.whitelist.indexOf(message.process) === -1) {
        return;
      }
    } else if (this.blacklist && this.blacklist.length > 0) {
      if (this.blacklist.indexOf(message.process) >= 0) {
        return;
      }
    }
    this.values.push(message);
  }

  /**
   * @returns {number}
   */
  get length() {
    return this.values.length;
  }

  /**
   * Get next message from queue
   * @returns {Message}
   */
  next() {
    return this.values.shift();
  }
}

module.exports = {
  MessageQueue,
};
