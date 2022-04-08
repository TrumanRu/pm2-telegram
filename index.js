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
 * @param {string} type
 * @param {string} message.process.namespace
 * @param {string} message.process.name
 * @param {string} message.process.rev
 * @param {number} message.process.pm_id
 * @param {string} message.data
 * @param {timestamp} message.at
 */

/**
 * @type {PmLogMessage[]}
 */
const messages = [];

let timer = null;


/**
 *
 */
function queProcessor() {
  if (messages.length > 0) {
    messages.forEach(
      (msg) => {
        console.log(msg.type, msg.data);
      },
    );
    messages.length = 0;
  }
  timer = setTimeout(queProcessor, QUE_PROCESS_INTERVAL);
}

/**
 * @param {string} type
 * @param {PmLogMessage} message
 */
function cbBusLogger(type, message) {
  if (message.process.name !== config.module_name) {
    console.log(type, message);
    messages.push({
      type,
      message,
    });
  }
}

// Start listening on the PM2 BUS
pm2.launchBus(function (err, bus) {
  bus.on('log:err', (data) => cbBusLogger('error', data));
  timer = setTimeout(queProcessor, QUE_PROCESS_INTERVAL);
});
