import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import _import from 'eslint-plugin-import'
import jest from 'eslint-plugin-jest'
import perfectionist from 'eslint-plugin-perfectionist'
import yenz from 'eslint-plugin-yenz'


const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  stylistic.configs.recommended,
  ...fixupConfigRules(compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jest/recommended',
  )), {
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      'perfectionist': perfectionist,
      'import': fixupPluginRules(_import),
      'jest': fixupPluginRules(jest),
      'yenz': fixupPluginRules(yenz),
      '@stylistic': stylistic
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json'
      },
    },

    rules: {
      'no-extra-boolean-cast': 0,
      'perfectionist/sort-jsx-props': 'off',
      'perfectionist/sort-switch-case': 'off',
      '@stylistic/comma-dangle': 'off',
      '@stylistic/indent': 'off',
      '@stylistic/no-multiple-empty-lines': 'off',
      '@stylistic/no-trailing-spaces': ['error'],
      '@typescript-eslint/explicit-function-return-type': ['error', {
        allowExpressions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: true
      }],
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'error',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', {
        varsIgnorePattern: '^_+',
        argsIgnorePattern: '^_+'
      }],
      '@typescript-eslint/prefer-find': 'warn',
      '@typescript-eslint/unbound-method': 'off',
      'brace-style': ['error', 'stroustrup'],
      'dot-notation': 'error',
      'import/newline-after-import': ['error', {
        count: 2
      }],
      'import/no-named-as-default': 'off',
      'import/order': [
        'error',
        {
          'groups': [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index'
          ],
          'pathGroups': [
            {
              pattern: '@/**',
              group: 'internal'
            }
          ],
          'pathGroupsExcludedImportTypes': [
            'builtin'
          ],
          'newlines-between': 'always',
          'alphabetize': {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ],
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'no-case-declarations': 'off',
      'no-console': ['error'],
      'no-magic-numbers': ['error', {
        ignoreArrayIndexes: true,
        ignore: [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      }],
      'no-use-before-define': 'off',
      'padding-line-between-statements': ['error', {
        blankLine: 'always',
        prev: 'function',
        next: '*'
      }, {
        blankLine: 'always',
        prev: '*',
        next: 'function'
      }],
      'perfectionist/sort-classes': 'off',
      'perfectionist/sort-enums': 'off',
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-interfaces': 'off',
      'perfectionist/sort-modules': 'off',
      'perfectionist/sort-named-exports': 'off',
      'perfectionist/sort-named-imports': 'off',
      'perfectionist/sort-object-types': 'off',
      'perfectionist/sort-objects': 'off',
      'perfectionist/sort-union-types': 'off',
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'yenz/no-loops': 'error',
      'yenz/type-ordering': 'error'
    }
  }, ...fixupConfigRules(compat.extends('plugin:jest/style')).map(config => ({
    ...config,
    files: ['tests/**']
  })), {
    files: ['tests/**'],
    rules: {
      'jest/prefer-called-with': 'warn',
      'jest/prefer-equality-matcher': 'error',
      'jest/prefer-spy-on': 'error',
      'no-magic-numbers': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off'
    },
  },
  {
    ignores: ['demo/**'],
  }]
