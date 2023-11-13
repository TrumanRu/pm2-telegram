const whitelist = ['white-A', 'white-B'];
const blacklist = ['black-A', 'black-B', 'black-C'];

const whitelisted = [
  {
    process: 'white-A',
    event: 'white-1',
    description: 'description-white-1',
  },
  {
    process: 'white-B',
    event: 'white-2',
    description: 'description-white-2',
  },
  {
    process: 'white-B',
    event: 'white-3',
    description: 'description-white-3',
  },
  {
    process: 'white-A',
    event: 'white-4',
    description: 'description-white-4',
  },
];

const blacklisted = [
  {
    process: 'black-A',
    event: 'black-1',
    description: 'description-back-1',
  },
  {
    process: 'black-B',
    event: 'black-2',
    description: 'description-black-2',
  },
  {
    process: 'black-C',
    event: 'black-3',
    description: 'description-black-3',
  }
];

module.exports = {
  whitelist,
  blacklist,
  whitelisted,
  blacklisted,
};
