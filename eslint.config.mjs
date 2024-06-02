import jsPlugin from '@eslint/js';
import prettierPlugin from 'eslint-config-prettier';
import globals from 'globals';
import tsPlugin from 'typescript-eslint';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['src/**/*.{ts,tsx}', 'scripts/**/*.ts'],
    ignores: ['build/**', 'node_modules/**'],
    languageOptions: {
      globals: [globals.browser, globals.jest],
    },
  },
  ...tsPlugin.configs.recommended,
  jsPlugin.configs.recommended,
  // prettierと競合するlintを無効にする
  prettierPlugin,
  // コンフィグファイルはlintから除外
  { ignores: ['*.config.{js,mjs,ts}'] },
];
