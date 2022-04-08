'use strict';

const pm2 = require('pm2');
const pmx = require('pmx');

// Get the configuration from PM2
const config = pmx.initModule();

console.log('Loaded new module pm2-telegram');
console.log('Config:', config);

const messages = [];

let timer = null;

function timeProcessor() {
    //console.log(new Date(), config.module_name);
    console.log(messages);
    messages.length = 0;
}

function cbLogBus(data) {
    if (data.process.name !== config.module_name) {
        messages.push(data.data);
    }
}

// Start listening on the PM2 BUS
pm2.launchBus(function(err, bus) {

    bus.on('log:error', cbLogBus);

    timer = setInterval(timeProcessor, 10000);
});
