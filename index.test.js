const { QueueProcessor } = require('./modules/queue-processor');

const queueProcessor = new QueueProcessor();

queueProcessor.start(1000);