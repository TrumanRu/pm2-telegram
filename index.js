'use strict';

const QUE_PROCESS_INTERVAL = 10000;
const MAX_MESSAGE_LENGTH = 4096;
const BR_LENGTH = '\n'.length;

const pm2 = require('pm2');
const pmx = require('pmx');

const sendToTelegram = require('./modules/sendToTelegram');

console.log('Loading module pm2-telegram');

/**
 * Get the configuration from PM2
 * @property {string} title - name of the server/process
 * @property {boolean} collate - collect multiple buffered messages into one message (with length less than Telegram max message length)
 * @property {boolean} log - notify on console.log() event
 * @property {boolean} error - notify on console.error() and console.warn() events
 * @property {boolean} kill - notify on PM2 process kill
 * @property {boolean} exception - notify on exception
 * @property {string} bot_token - Telegram bot token
 * @property {boolean} chat_id - Telegram chat id (use 'g' prefix gor group ig with leading '-' - 'g-1234567890')
 * @property {string} module_name
 */
const config = pmx.initModule();


if (config.chat_id) {
  /**
   * Process group chat id prefixed by 'g-'
   */
  let checkGroup = config.chat_id.toString().match(/^g(-\d+)$/);
  if (checkGroup) {
    config.chat_id = checkGroup[1];
  } else if (typeof config.chat_id !== 'string') {
    config.chat_id = config.chat_id.toString();
  }
}

console.log('Config:', config);

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

/** @type {QueLogMessage[]} */
const messagesQue = [];
let timer = null;

/**
 * Send messages from que
 * @param {boolean} [runAgain]
 */
async function queProcessor(runAgain = true) {
  try {
    if (!config.chat_id || !config.bot_token) {
      console.warn(`'bot_token' and 'chat_id' are required parameters for pm2-telegram`);
      return;
    }

    if (messagesQue.length > 0) {
      const titleStr = config.title ? config.title.toString() : 'PM-Telegram';
      const titleHtml = `<b>${titleStr}</b>`;
      const titleLength = titleStr.length;

      let collector = '';
      let collectorLength = 0;

      const initCollector = () => {
        collector = '';
        collectorLength = 0;
      }

      const dropCollector = async () => {
        if (collectorLength > 0) {
          await sendToTelegram(config.bot_token, config.chat_id, collector);
          initCollector();
        }
      }

      initCollector();

      /** @type {QueLogMessage} */
      let msg = undefined;
      do {
        msg = messagesQue.shift();
        if (!msg) break;
        const msgAddText = `\n<u>${msg.process}</u> - <b>${msg.event}</b> - `;
        const msgAddLength = BR_LENGTH + msg.process.length + msg.event.length + 6;
        const msgText = msgAddText + (msg.description
          ? msg.description
            .replace('&', '&amp;')
            .replace('<', '&lt;')
            .replace('>', '&gt;')
          : 'no description');
        const msgLength = msgAddLength + msgText.length;

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
            await sendToTelegram(config.bot_token, config.chat_id, messageStart + messageText + messageEnd);
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
          await sendToTelegram(config.bot_token, config.chat_id, titleHtml + msgText);
        }

        //console.log(new Date(msg.timestamp).toLocaleTimeString(), msg.process, msg.event, msg.description);
      } while (msg);
      await dropCollector();
    }
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
    // do not collect without setup data
    return;
  }
  if (message.process !== config.module_name) {
    messagesQue.push(message);
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
    queProcessor(false)
      .catch((e) => console.error(e));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  process.exit(0);
})
