/**
 *
 * @typedef TextFormat
 * @type {{CODE_END: string, BOLD_END: string, ITALIC_END: string, ITALIC_START: string, CODE_START: string,
 *         BOLD_START: string, MESSAGE_START: string, MESSAGE_END: string}}
 */

/**
 * @type {TextFormat}
 */
const PlainFormat = {
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
const MarkdownFormat = {
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

    /** @type TextFormat */
    let format;

    switch (this.formatName) {
      case 'markdown':
      case 'code':
        format = MarkdownFormat;
        break;
      default:
        this.formatName = 'plain';
        format = PlainFormat;
    }
    Object.assign(this, format);
  }
}

module.exports = {
  ConfigTextFormat,
};
