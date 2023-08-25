/** @type {import('eslint').Linter.Config} */
module.exports = {
  overrides: [
    {
      files: ['*.graphql'],
      parser: '@graphql-eslint/eslint-plugin',
      plugins: ['@graphql-eslint'],
      extends: ['plugin:@graphql-eslint/operations-recommended'],
      rules: {
        '@graphql-eslint/unique-fragment-name': 'error',
        '@graphql-eslint/unique-operation-name': 'error',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      processor: '@graphql-eslint/graphql',
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
      rules: {
        '@typescript-eslint/no-unnecessary-condition': 'error',
      },
    },
  ],
  plugins: ['@typescript-eslint'],
  extends: ['@codeday', 'plugin:@next/next/recommended'],

  root: true,
  rules: {
    'no-undef': 'off',
    'import/named': 'off',
    'react/require-default-props': 'off',
    'no-secrets/no-secrets': ['error', { ignoreContent: 'Clear' }],
    'no-underscore-dangle': ['error', { allow: ['__typename', '_type'] }],
  },
};
