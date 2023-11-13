module.exports = {
  env: {
    es2017: true,
    node: true,
    commonjs: true,
    jest: true,
  },
  extends: 'eslint:recommended',
  overrides: [],
  parserOptions: {
    ecmaVersion: 8,
  },
  rules: {
    'no-inner-declarations': 0,
    'max-len': [
      'error',
      {
        code: 120,
        comments: 200,
      },
    ],
  },
};
