module.exports = {
    env: {
        es2017: true,
        node: true,
        commonjs: true,
        jest: true,
    },
    extends: "eslint:recommended",
    overrides: [],
    parserOptions: {
        ecmaVersion: 8,
    },
    rules: {
        "no-inner-declarations": 0,
    }
}
