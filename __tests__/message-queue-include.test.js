const { MessageQueue } = require('../modules/message-queue');
const { Message } = require('../modules/message');
const { whitelist, blacklist, whitelisted, blacklisted } = require('./fixtures/message-queue-include.fixtures');

describe('Verify MessageQue functionality', () => {

  it('Check add message without black- and white- lists', () => {
    const queue = new MessageQueue();

    queue.push(new Message({
      process: 'process',
      event: 'event',
      description: 'description',
    }));

    expect(queue.length).toEqual(1);
    expect(Object.keys(queue.shift())).toEqual(['process', 'event', 'description', 'timestamp']);
  });

  it('Check add multiple messages without black- and white- lists', () => {
    const queue = new MessageQueue();

    queue.push(new Message({
      process: 'process-1',
      event: 'event-1',
      description: 'description-1',
    }));

    queue.push(new Message({
      process: 'process-2',
      event: 'event-2',
      description: 'description-2',
    }));

    queue.push(new Message({
      process: 'process-3',
      event: 'event-3',
      description: 'description-3',
    }));

    expect(queue.length).toEqual(3);
  });

  it('Check add multiple messages and remove some messages without black- and white- lists', () => {
    const queue = new MessageQueue();

    queue.push(new Message({
      process: 'process-1',
      event: 'event-1',
      description: 'description-1',
    }));

    queue.push(new Message({
      process: 'process-2',
      event: 'event-2',
      description: 'description-2',
    }));

    queue.push(new Message({
      process: 'process-3',
      event: 'event-3',
      description: 'description-3',
    }));

    expect(queue.shift().description).toEqual('description-1');
    expect(queue.shift().description).toEqual('description-2');
    expect(queue.shift().description).toEqual('description-3');
    expect(queue.shift()).toEqual(undefined);
  });

  it('Check whitelisted messages', () => {
    const queue = new MessageQueue({ whitelist });

    queue.push(new Message(blacklisted[0]));

    queue.push(new Message(whitelisted[0]));
    queue.push(new Message(whitelisted[1]));

    queue.push(new Message(blacklisted[1]));

    queue.push(new Message(whitelisted[2]));

    queue.push(new Message(blacklisted[2]));

    queue.push(new Message(whitelisted[3]));

    expect(queue.length).toEqual(4);
    expect(queue.shift().event).toEqual('white-1');
    expect(queue.shift().event).toEqual('white-2');
    expect(queue.shift().event).toEqual('white-3');
    expect(queue.shift().event).toEqual('white-4');
  });

  it('Check whitelisted messages', () => {
    const queue = new MessageQueue({ whitelist });

    queue.push(new Message(blacklisted[0]));

    queue.push(new Message(whitelisted[0]));
    queue.push(new Message(whitelisted[1]));

    queue.push(new Message(blacklisted[1]));

    queue.push(new Message(whitelisted[2]));

    queue.push(new Message(blacklisted[2]));

    queue.push(new Message(whitelisted[3]));

    expect(queue.length).toEqual(4);
    expect(queue.shift().event).toEqual('white-1');
    expect(queue.shift().event).toEqual('white-2');
    expect(queue.shift().event).toEqual('white-3');
    expect(queue.shift().event).toEqual('white-4');
  });

  it('Check whitelisted messages', () => {
    const queue = new MessageQueue({ blacklist });

    queue.push(new Message(blacklisted[0]));

    queue.push(new Message(whitelisted[0]));
    queue.push(new Message(whitelisted[1]));

    queue.push(new Message(blacklisted[1]));

    queue.push(new Message(whitelisted[2]));

    queue.push(new Message(blacklisted[2]));

    queue.push(new Message(whitelisted[3]));

    expect(queue.length).toEqual(4);
    expect(queue.shift().event).toEqual('white-1');
    expect(queue.shift().event).toEqual('white-2');
    expect(queue.shift().event).toEqual('white-3');
    expect(queue.shift().event).toEqual('white-4');
  });

  it('Check whitelisted messages', () => {
    const queue = new MessageQueue({ whitelist, blacklist });

    queue.push(new Message(blacklisted[0]));

    queue.push(new Message(whitelisted[0]));
    queue.push(new Message(whitelisted[1]));

    queue.push(new Message(blacklisted[1]));

    queue.push(new Message(whitelisted[2]));

    queue.push(new Message(blacklisted[2]));

    queue.push(new Message(whitelisted[3]));

    expect(queue.length).toEqual(4);
    expect(queue.shift().event).toEqual('white-1');
    expect(queue.shift().event).toEqual('white-2');
    expect(queue.shift().event).toEqual('white-3');
    expect(queue.shift().event).toEqual('white-4');
  });
});
