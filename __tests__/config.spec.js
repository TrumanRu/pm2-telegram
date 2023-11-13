const { Config } = require('../modules/config');
const { config_1, config_1_result, config_2, config_2_result } = require('./fixtures/config.fixture');

describe('Check configuration loading', () => {

  it('Check config values was set', () => {
    const config = new Config(config_1);

    expect(config).toEqual(config_1_result);
  });

  it(`Check config values for processes' whitelist and blacklist was set`, () => {
    const config = new Config(config_2);

    expect(config).toEqual(config_2_result);
  });

});
