class QueueProcessor {
  /**
   * @param {Config} config
   * @param {MessageQueue} queue
   * @param {MessageComposer} composer
   */
  constructor(config, queue, composer) {
    this.queue = queue;
    this.timer = null;
    this.counter = 0;
    this.interval = config.send_interval;
  }

  start(interval) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (interval) {
      this.interval = interval;
    }
    this.timer = setTimeout(this.tick.bind(this), this.interval);
    console.log('TIMER:', this.timer);
  }

  tick() {
    console.log('ENTER');
    this.timer = null;
    this.counter++;
    console.log('tick');
    this.start();
  }

  /**
   * Finishing all tasks
   * Send all unsent messages from queue
   */
  shutdown() {
    console.log('\nFinishing tasks...');
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}

module.exports = {
  QueueProcessor,
};
