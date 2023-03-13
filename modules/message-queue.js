'use strict';

class MessageQueue {
  /**
   * @param {string[]} [whitelist]
   * @param {string[]} [blacklist]
   */
  constructor({
    whitelist,
    blacklist,
  } = {}) {
    this.values = [];
    this.whitelist = whitelist;
    this.blacklist = blacklist;
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
   * @returns {Message}
   */
  next() {
    return this.values.shift();
  }
}

module.exports = {
  MessageQueue,
};
