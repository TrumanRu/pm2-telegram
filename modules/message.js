'use strict';

class Message {
  /**
   * @param {{process: string, event: string, description: string, [timestamp]: number}} message
   */
  constructor(message) {
    const { process, event, description, timestamp } = message;
    this.process = process;
    this.event = event;
    this.description = description;
    this.timestamp = timestamp || new Date().getTime();
  }
}

module.exports = {
  Message,
};
