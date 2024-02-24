const pm2 = require('pm2');
const { Config } = require('./modules/config');
const { MessageQueue } = require('./modules/message-queue');
const { Message } = require('./modules/message');
const { QueueProcessor } = require("./modules/queue-processor");
const pmx = require('pmx');
const { MessageComposer } = require('./modules/message-composer');

/** @type Config */
const config = new Config(/** @type PackageConfig */ pmx.initModule());
const queue = new MessageQueue(config);
const composer = new MessageComposer();
const queueProcessor = new QueueProcessor(config, queue);

/**
 * Start listening on the PM2 BUS
 */
pm2.launchBus(function (err, bus) {
  try {
    console.log('Starting the Bus...')
    if (config.error) bus.on('log:err', /** @param {PmLogMessage} data */(data) => queue.push({
      process: data.process.name,
      event: 'error',
      description: data.data,
      timestamp: data.at,
    }));
    if (config.log) bus.on('log:out', /** @param {PmLogMessage} data */(data) =>
      queue.push(new Message ({
        process: data.process.name,
        event: 'log',
        description: data.data,
        timestamp: data.at,
      }))
    );
    if (config.kill) bus.on('pm2:kill', /** @param {Object} data */(data) => {
      console.log('KILL', data);
      queue.push(new Message({
        process: 'PM2',
        event: 'kill',
        description: data.msg,
        timestamp: Date.now(),
      }))
    });
    if (config.exception) bus.on('process:exception', /** @param {Object} data */(data) => {
      queue.push(new Message({
        process: data.process.name,
        event: 'exception',
        description: JSON.stringify(data.data),
        timestamp: data.at,
      }))
    });
    queueProcessor.start(1000);
    console.log('PM2 Telegram Logger started')
  } catch (e) {
    if (e instanceof Error) {
      throw new e;
    }
    throw new Error(e.toString());
  }
});

/**
 * Catch this module kill event
 */
process.on('SIGINT', async () => {
  try {
    await queueProcessor.shutdown(false);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  process.exit(0);
})
