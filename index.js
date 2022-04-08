'use strict';

const QUE_PROCESS_INTERVAL = 10000;

const pm2 = require('pm2');
const pmx = require('pmx');

// Get the configuration from PM2
const config = pmx.initModule();

console.log('Loaded new module pm2-telegram');
console.log('Config:', config);

const messages = [];

let timer = null;

function queProcessor() {
    //console.log(new Date(), config.module_name);
    if (messages.length > 0) {
        console.log(messages);
        messages.length = 0;
    }
    timer = setTimeout(queProcessor, QUE_PROCESS_INTERVAL);
}

function cbBusLogger(data) {
    if (data.process.name !== config.module_name) {
        messages.push(data.data);
        console.log(data);
    }
}

// Start listening on the PM2 BUS
pm2.launchBus(function(err, bus) {
    bus.on('log:err', cbBusLogger);
    timer = setTimeout(queProcessor, QUE_PROCESS_INTERVAL);
});
