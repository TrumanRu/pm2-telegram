module.exports = {
  env: {
    es2017: true,
    node: true,
    commonjs: true,
    jest: true,
  },
  plugins: ['@stylistic/js'],
  extends: 'eslint:recommended',
  overrides: [],
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    babelOptions: {
      babelrc: false,
      configFile: false,
    },
  },
  rules: {
    'no-inner-declarations': 0,
    '@stylistic/js/quotes': ['error', 'single', {
      allowTemplateLiterals: true,
    }],
    '@stylistic/js/arrow-parens': ['error', 'always'],
    '@stylistic/js/object-curly-spacing': ['error', 'always'],
    'max-len': [
      'error',
      {
        code: 120,
        comments: 200,
      },
    ],
  },
};
