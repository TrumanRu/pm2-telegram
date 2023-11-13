const config_1 = {
  title: 'title-1',
  bot_token: '',
  chat_id: '',
  collate: true,
  text_format: 'Markdown',
  log: true,
  error: true,
  kill: true,
  exception: true,
  process_white: '',
  process_black: '',
};

const config_1_result = Object.assign(config_1, { processesWhitelist: [], processesBlacklist: [] });

const config_2 = Object.assign(config_1, { process_white: 'white-1,white-2', process_black: 'black-1,black-2,black-3' })

const config_2_result = Object.assign(
  config_1,
  { processesWhitelist: ['white-1', 'white-2'], processesBlacklist: ['black-1', 'black-2', 'black-3'] });


module.exports = {
  config_1,
  config_1_result,
  config_2,
  config_2_result
};
