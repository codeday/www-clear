module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
  },
  extends: '@codeday',
  settings: {
    'import/resolver': {
      exports: {
        require: false,
        browser: false,
        conditions: [],
        unsafe: false,
      },
    },
  },
};
