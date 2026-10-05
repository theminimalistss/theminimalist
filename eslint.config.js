import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores([
    'dist',
    'coverage',
    'node_modules',
    'artifacts',
    'test-results',
    'playwright-report',
  ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    files: ['src/ui/**/*.{ts,tsx}', 'src/App.tsx'],
    rules: {
      'no-restricted-imports': ['error', { patterns: ['@/repositories/*', '@/services/*'] }],
      'no-restricted-globals': [
        'error',
        { name: 'fetch', message: 'Use a repository through a service and hook.' },
      ],
    },
  },
]);
