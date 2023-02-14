import pm2 from 'pm2';
import { Config } from './modules/config';
import { MessageQueue } from './modules/message-queue'
import { Message } from './modules/message';

const config = new Config();
const queue = new MessageQueue();

let timer = null;

/**
 * Start listening on the PM2 BUS
 */
pm2.launchBus(function (err, bus) {
  try {
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
