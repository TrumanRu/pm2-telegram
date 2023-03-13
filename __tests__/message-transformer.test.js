const { MessageTransformer } = require('../modules/message-processor');
// const { WriteableStreamMock } = require('./fixtures/writeable-stream.mock');

const transformer = new MessageTransformer({ objectMode: true });

// const mockWritable = new WriteableStreamMock({ objectMode: true });

transformer.on('data', (chunk) => {
  console.log('DATA:', chunk);
});

transformer.on('end', () => {
  console.log('EOS');
});

let counter = 1;

transformer.write(`Message ${counter++}`);

setInterval(() => {
  console.log('next...')
  transformer.write(`Message ${counter++}`);
}, 2000)