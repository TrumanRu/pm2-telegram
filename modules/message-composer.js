const MAX_MESSAGE_LENGTH = 4096;
const BR_LENGTH = '\n'.length;

/**
 * @param {ModuleConfig} config
 */
class MessageComposer {
  /**
   * @param {Config} config
   */
  constructor(config) {
    this.config = config;
    /** @type {string} */
    this._stack = '';
  }

  popStack() {
    const value = this._stack;
    this._stack = '';
    return value;
  }

  /**
   * @param {number} limit
   */
  next(limit) {
    let buffer = this.popStack();
  }
}

module.exports = {
  MessageComposer,
}
