'use strict';

const QUE_PROCESS_INTERVAL = 10000;
const MAX_MESSAGE_LENGTH = 4096;
const BR_LENGTH = '\n'.length;

const pm2 = require('pm2');
const pmx = require('pmx');
const os = require('os');

const { Message } = require('./modules/message');
const { MessageQue } = require('./modules/message-queue');
const { sendToTelegram } = require('./modules/send-to-telegram');

console.log('Loading module pm2-telegram');

/**
 * Get configuration from PM2
 * @property {string} title - name of the server/process
 * @property {boolean} collate - collect multiple buffered messages into one message (with length less than Telegram max message length)
 * @property {boolean} log - notify on console.log() event
 * @property {boolean} error - notify on console.error() and console.warn() events
 * @property {boolean} kill - notify on PM2 process kill
 * @property {boolean} exception - notify on exception
 * @property {string} bot_token - Telegram bot token
 * @property {boolean} chat_id - Telegram chat id (use 'g' prefix gor group ig with leading '-' - 'g-1234567890')
 * @property {string} text_format - set 'Markdown' to format send messages
 * @property {string} module_name
 */
const config = pmx.initModule();


if (config.chat_id) {
  /** Process group chat id prepended by 'g-' */
  let checkGroup = config.chat_id.toString().match(/^g(-\d+)$/);
  if (checkGroup) {
    config.chat_id = checkGroup[1];
  } else if (typeof config.chat_id !== 'string') {
    config.chat_id = config.chat_id.toString();
  }
}

if (config.title) {
  config.title = config.title.toString();
} else {
  config.title = os.hostname();
}

const isMarkdown = config.text_format && config.text_format.toString().toLowerCase() === 'markdown';
const isCode = config.text_format && config.text_format.toString().toLowerCase() === 'code';

let BOLD_START = '['
let BOLD_END = ']';
let ITALIC_START = ''
let ITALIC_END = '';
let CODE_START = '[';
let CODE_END = ']';
let MESSAGE_START = '';
let MESSAGE_END = '';
let MESSAGE_FORMAT = undefined;

if (isMarkdown || isCode) {
  BOLD_START = '*';
  BOLD_END = '*';
  ITALIC_START = '_'
  ITALIC_END = '_';
  CODE_START = '`';
  CODE_END = '`';
  MESSAGE_FORMAT = 'Markdown';
}

if (isCode) {
  MESSAGE_START = '```\n';
  MESSAGE_END = '\n```';
}

console.log('Config:', config);

const titleHtml = `${BOLD_START}${config.title}${BOLD_END}`;
const titleLength = config.title.length + (isMarkdown ? 0 : BOLD_START.length + BOLD_END.length);

/**
 * @typedef PmLogMessage
 * @property {string} process.namespace
 * @property {string} process.name
 * @property {string} process.rev
 * @property {number} process.pm_id
 * @property {string} data
 * @property {number} at
 */

/**
 * @typedef QueLogMessage
 * @property {string} process
 * @property {string} event
 * @property {string} description
 * @property {number} timestamp
 */

/** @type {MessageQue} */
const messagesQue = new MessageQue();
let timer = null;

/**
 * Send messages from que
 * @param {boolean} [runAgain]
 */
async function queProcessor(runAgain = true) {
  try {
    if (!config.chat_id || !config.bot_token) {
      console.warn(`'bot_token' and 'chat_id' are required parameters for pm2-telegram module`);
      return; // queProcessor stopped
    }

    if (messagesQue.length > 0) {

      let collector = '';
      let collectorLength = 0;

      const initCollector = () => {
        collector = '';
        collectorLength = 0;
      }

      const dropCollector = async () => {
        if (collectorLength > 0) {
          await sendToTelegram(config.bot_token, config.chat_id, collector, MESSAGE_FORMAT);
          initCollector();
        }
      }

      initCollector();

      /** @type {Message} */
      let msg = undefined;
      do {
        msg = messagesQue.shift();
        if (!msg) break;
        const msgAddText = `\n${ITALIC_START}${msg.process}${ITALIC_END} - ${BOLD_START}${msg.event}${BOLD_END}${isCode ? '' : ' - '}`;
        const msgAddLength = BR_LENGTH + msg.process.length + 3 + msg.event.length + (isCode ? 0 : 3)
          + (isMarkdown || isCode ? 0 : ITALIC_START.length + ITALIC_END.length + BOLD_START.length + BOLD_END.length);
        let msgText = MESSAGE_START + (msg.description ? msg.description : 'no description') + MESSAGE_END;
        const msgLength = msgAddLength + msgText.length;
        msgText = msgAddText + msgText;

        // send collector if overflow is awaiting
        if (config.collate && collectorLength > 0 && titleLength + collectorLength + msgLength > MAX_MESSAGE_LENGTH) {
          await dropCollector();
        }
        // collector is empty, current message is not send

        if (titleLength + msgLength > MAX_MESSAGE_LENGTH) {
          // split message if too long
          let messageStart = titleHtml;
          let messageEnd = '...';
          let nextPos = 0;
          let counter = 0;
          do {
            counter++;
            let cutLength = MAX_MESSAGE_LENGTH - (counter === 1 ? titleLength : 0) - 3;
            if (msgText - nextPos + 1 < MAX_MESSAGE_LENGTH) {
              messageEnd = '';
            }
            const messageText = msgText.substring(nextPos, nextPos + cutLength);
            nextPos = nextPos + cutLength;
            await sendToTelegram(config.bot_token, config.chat_id, messageStart + messageText + messageEnd, MESSAGE_FORMAT);
            messageStart = '...';
          } while (nextPos >= msgLength);
        } else if (config.collate) {
          if (collectorLength === 0) {
            collector += titleHtml + msgText;
            collectorLength += titleLength + msgLength;
          } else {
            collector += msgText;
            collectorLength += msgLength;
          }
        } else {
          await sendToTelegram(config.bot_token, config.chat_id, titleHtml + msgText, MESSAGE_FORMAT);
        }
      } while (msg);
      await dropCollector();
    } // if (messagesQue.length > 0)
  } catch (e) {
    console.error(e);
  }
  if (runAgain) {
    timer = setTimeout(queProcessor, QUE_PROCESS_INTERVAL);
  }
}

/**
 * Add message to send buffer
 * @param {QueLogMessage} message
 */
function addMessageToQue(message) {
  if (!config.chat_id || !config.bot_token) {
    // do not collect messages if setup data is absent
    return;
  }
  if (message.process !== config.module_name) {
    messagesQue.push(new Message(message));
  }
}

/**
 * Start listening on the PM2 BUS
 */
pm2.launchBus(function (err, bus) {
  try {
    if (config.error) bus.on('log:err', /** @param {PmLogMessage} data */(data) => addMessageToQue({
      process: data.process.name,
      event: 'error',
      description: data.data,
      timestamp: data.at,
    }));
    if (config.log) bus.on('log:out', /** @param {PmLogMessage} data */(data) => addMessageToQue({
      process: data.process.name,
      event: 'log',
      description: data.data,
      timestamp: data.at,
    }));
    if (config.kill) bus.on('pm2:kill', /** @param {Object} data */(data) => {
      console.log('KILL', data);
      addMessageToQue({
        process: 'PM2',
        event: 'kill',
        description: data.msg,
        timestamp: Date.now(),
      })
    });
    if (config.exception) bus.on('process:exception', /** @param {Object} data */(data) => {
      addMessageToQue({
        process: data.process.name,
        event: 'exception',
        description: JSON.stringify(data.data),
        timestamp: data.at,
      })
    });
    timer = setTimeout(queProcessor, QUE_PROCESS_INTERVAL);
  } catch (e) {
    throw new e;
  }
});

/**
 * Catch this module kill event
 */
process.on('SIGINT', async function() {
  try {
    if (timer) {
      clearTimeout(timer);
    }
    console.log('Finishing tasks...');
    await queProcessor(false);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  process.exit(0);
})
