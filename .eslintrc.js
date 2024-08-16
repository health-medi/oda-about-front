module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['plugin:nuxt/recommended', 'plugin:tailwindcss/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  ignorePatterns: ['.output/**/*', '.nuxt/**/*', 'node_modules/**/*'],
  rules: {
    'no-unused-expressions': 'off',
    'vue/no-v-html': 'off',
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
        trailingComma: 'all',
        printWidth: 120,
        endOfLine: 'auto',
      },
    ],
    'tailwindcss/no-custom-classname': [
      'warn',
      {
        whitelist: ['scrollbar[a-z0-9-]{0,}'],
      },
    ],
  },
};
