'use strict';

const QUE_PROCESS_INTERVAL = 10000;

const pm2 = require('pm2');
const pmx = require('pmx');

// Get the configuration from PM2
const config = pmx.initModule();

console.log('Loaded new module pm2-telegram');
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
 *
 */
function queProcessor() {
  if (messages.length > 0) {
    messages.forEach(
      /** @param {QueLogMessage} msg */
      (msg) => {
        console.log(new Date(msg.timestamp), msg.process, msg.event, msg.description);
      },
    );
    messages.length = 0;
  }
  console.log('CONFIG', config);
  timer = setTimeout(queProcessor, QUE_PROCESS_INTERVAL);
}

/**
 * @param {QueLogMessage} message
 */
function addMessage(message) {
  if (message.process !== config.module_name) {
    console.log('ADD', message);
    messages.push(message);
  }
}

// Start listening on the PM2 BUS
pm2.launchBus(function (err, bus) {
  try {
    bus.on('log:err', /** @param {PmLogMessage} data */(data) => addMessage({
      process: data.process.name,
      event: 'error',
      description: data.data,
      timestamp: data.at,
    }));
    bus.on('log:out', /** @param {PmLogMessage} data */(data) => addMessage({
      process: data.process.name,
      event: 'log',
      description: data.data,
      timestamp: data.at,
    }));
    bus.on('pm2:kill', /** @param {Object} data */(data) => {
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
    throw new err;
  }
});
