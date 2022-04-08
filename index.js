'use strict';

const pm2 = require('pm2');
const pmx = require('pmx');

// Get the configuration from PM2
const conf = pmx.initModule();

console.log('Loaded new module pm2-telegram');
