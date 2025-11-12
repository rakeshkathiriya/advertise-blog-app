import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist/', 'node_modules/', 'public/', 'utils/types/**'],
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      js: pluginJs,
      react: pluginReact,
      'unused-imports': unusedImports,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'off',
      'no-console': ['error', { allow: ['error'] }],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'date-fns',
              message:
                "Please use '@/utils/dateUtils' instead of importing from 'date-fns' directly. This ensures consistent date handling across the application.",
            },
            {
              name: 'date-fns-tz',
              message:
                "Please use '@/utils/dateUtils' instead of importing from 'date-fns-tz' directly. This ensures consistent timezone handling.",
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "NewExpression[callee.name='Date']",
          message:
            "Avoid using 'new Date()' directly. Use dateUtils functions instead:\n• dateUtils.now() for current date\n• dateUtils.parse.fromISO() for parsing\n• dateUtils.format.iso() for formatting\nThis ensures consistent timezone handling.",
        },
      ],
    },
  },
  {
    files: ['utils/dateUtils.ts', 'utils/dateUtils.js'],
    rules: {
      'no-restricted-imports': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  ...tseslint.configs.recommended,
];
