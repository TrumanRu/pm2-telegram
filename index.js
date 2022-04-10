'use strict';

const QUE_PROCESS_INTERVAL = 10000;
const MAX_MESSAGE_LENGTH = 4096;

const pm2 = require('pm2');
const pmx = require('pmx');

// Get the configuration from PM2
const config = pmx.initModule();

console.log('Loading module pm2-telegram');
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

/**
 * @type {QueLogMessage[]}
 */
const messages = [];

let timer = null;

/**
 * @param {string} [notice]
 */
function queProcessor(notice = undefined) {
  if (messages.length > 0) {
    if (notice) console.log(notice);
    messages.forEach(
      /** @param {QueLogMessage} msg */
      (msg) => {
        console.log(new Date(msg.timestamp), msg.process, msg.event, msg.description);

      },
    );
    messages.length = 0;
  }
  timer = setTimeout(queProcessor, QUE_PROCESS_INTERVAL);
}

/**
 * @param {QueLogMessage} message
 */
function addMessage(message) {
  if (message.process !== config.module_name) {
    messages.push(message);
  }
}

// Start listening on the PM2 BUS
pm2.launchBus(function (err, bus) {
  try {
    if (config.error) bus.on('log:err', /** @param {PmLogMessage} data */(data) => addMessage({
      process: data.process.name,
      event: 'error',
      description: data.data,
      timestamp: data.at,
    }));
    if (config.log) bus.on('log:out', /** @param {PmLogMessage} data */(data) => addMessage({
      process: data.process.name,
      event: 'log',
      description: data.data,
      timestamp: data.at,
    }));
    if (config.kill) bus.on('pm2:kill', /** @param {Object} data */(data) => {
      console.log(data);
      addMessage({
        process: 'PM2',
        event: 'kill',
        description: data.msg,
        timestamp: Date.now(),
      })
    });


    timer = setTimeout(queProcessor, QUE_PROCESS_INTERVAL);
  } catch (e) {
    throw new e;
  }
});

process.on('SIGINT', function() {
  try {
    if (timer) {
      clearTimeout(timer);
    }
    queProcessor('Finish tasks...');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  process.exit(0);
})
