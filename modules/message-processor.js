const MAX_MESSAGE_LENGTH = 4096;
const BR_LENGTH = '\n'.length;

/**
 * @typedef MessageProcessorOptions
 *
 */
class MessageProcessor {
  /**
   * @param options
   * @param {ConfigTextFormat} options.config
   * @param {MessageQueue} options.queue
   * @param {TelegramSender} options.sender
   */
  constructor(options) {
    this.config = options.config;
    this.queue = options.queue;
    this.sender = options.sender;
    /** @type {string} */
    this._stack = '';
  }

  popStack() {
    const value = this._stack;
    this._stack = '';
    return value;
  }

  async pull() {
    return this.queue.next();
  }

  /**
   * @param {number} limit
   */
  next(limit) {
    let buffer = this.popStack();


  }
}

module.exports = {
  MessageTransformer: MessageProcessor,
}
