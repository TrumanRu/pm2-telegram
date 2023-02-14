/**
 *
 * @typedef TextFormat
 * @type {{CODE_END: string, BOLD_END: string, ITALIC_END: string, ITALIC_START: string, CODE_START: string, BOLD_START: string, MESSAGE_START: string, MESSAGE_END: string}}
 */

/**
 * @type {TextFormat}
 */
const plainFormat = {
  BOLD_START: '[',
  BOLD_END: ']',
  ITALIC_START: '',
  ITALIC_END: '',
  CODE_START: '[',
  CODE_END: ']',
  MESSAGE_START: '',
  MESSAGE_END: '',
};

/**
 * @type {TextFormat}
 */
const markdownFormat = {
  BOLD_START: '*',
  BOLD_END: '*',
  ITALIC_START: '_',
  ITALIC_END: '_',
  CODE_START: '`',
  CODE_END: '`',
  MESSAGE_START: '',
  MESSAGE_END: '',
}

/**
 * @type {TextFormat}
 * @property {string} formatName
 */
class ConfigTextFormat {
  /**
   * @param {string} formatName
   */
  constructor(formatName) {
    this.formatName = formatName.toString().toLowerCase();

    switch (this.formatName) {
      case 'markdown':
      case 'code':
        this.init(markdownFormat);
        break;
      default:
        this.formatName = 'plain';
        this.init(plainFormat);
    }
  }

  /**
   * @param {TextFormat} formatConfig
   */
  init(formatConfig) {
    Object.assign(this, formatConfig);
  }
}

module.exports = {
  ConfigTextFormat,
};
