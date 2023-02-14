'use strict';

class Message {
  /**
   * @param {{process: string, event: string, description: string, [timestamp]: number}} message
   */
  constructor(message) {
    this.process = message.process;
    this.event = message.event;
    this.description = message.description;
    this.timestamp = message.timestamp || new Date().getTime();
  }
}

module.exports = {
  Message,
};
