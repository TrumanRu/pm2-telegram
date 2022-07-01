'use strict';

class MessageQue {
  constructor() {
    this.values = [];
  }

  /**
   *
   * @param {Message} message
   */
  push(message) {
    this.values.push(message);
  }

  get length() {
    this.values.length;
  }

  shift() {
    return this.values.shift();
  }
}

module.exports = {
  MessageQue,
};
