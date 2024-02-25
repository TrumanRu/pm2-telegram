const { MessageComposer } = require('../modules/message-composer');

const processor = new MessageComposer();

processor.on('data', (chunk) => {
  console.log('DATA:', chunk);
});

processor.on('end', () => {
  console.log('EOS');
});

let counter = 1;

processor.write(`Message ${counter++}`);

setInterval(() => {
  console.log('next...')
  processor.write(`Message ${counter++}`);
}, 2000)