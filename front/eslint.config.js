import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import boundaries from 'eslint-plugin-boundaries'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

/** @type {import('eslint-plugin-simple-import-sort').Options} */
const importSortGroups = [
  ['^\\u0000'],
  ['^node:'],
  ['^@?\\w'],
  ['^@/'],
  ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
  ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
  ['^.+\\.s?css$'],
]

/** app — composition root, внутренние импорты разрешены; остальные слои — только public API */
const fsdPublicApiPatterns = [
  {
    group: [
      '@/pages/*/**',
      '@/widgets/*/**',
      '@/features/*/**',
      '@/entities/*/**',
    ],
    message: 'Импортируйте слайсы только через public API: @/<layer>/<slice>',
  },
]

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      'simple-import-sort': simpleImportSort,
      boundaries,
    },
    settings: {
      'boundaries/include': ['src/**/*'],
      'boundaries/dependency-nodes': ['import'],
      'boundaries/elements': [
        { type: 'shared', pattern: 'src/shared', mode: 'folder' },
        {
          type: 'entities',
          pattern: 'src/entities/*',
          mode: 'folder',
          capture: ['entity'],
        },
        {
          type: 'features',
          pattern: 'src/features/*',
          mode: 'folder',
          capture: ['feature'],
        },
        { type: 'widgets', pattern: 'src/widgets', mode: 'folder' },
        {
          type: 'pages',
          pattern: 'src/pages/*',
          mode: 'folder',
          capture: ['page'],
        },
        { type: 'app', pattern: 'src/app', mode: 'folder' },
      ],
    },
    rules: {
      'simple-import-sort/imports': ['error', { groups: importSortGroups }],
      'simple-import-sort/exports': 'error',
      'no-restricted-imports': ['error', { patterns: fsdPublicApiPatterns }],
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: { type: 'shared' },
              allow: [{ to: { type: 'shared' } }],
            },
            {
              from: {
                type: 'entities',
                captured: { entity: '{{ from.captured.entity }}' },
              },
              allow: [
                { to: { type: 'shared' } },
                {
                  to: {
                    type: 'entities',
                    captured: { entity: '{{ from.captured.entity }}' },
                  },
                },
              ],
            },
            {
              from: {
                type: 'features',
                captured: { feature: '{{ from.captured.feature }}' },
              },
              allow: [
                { to: { type: 'entities' } },
                { to: { type: 'shared' } },
                {
                  to: {
                    type: 'features',
                    captured: { feature: '{{ from.captured.feature }}' },
                  },
                },
              ],
            },
            {
              from: { type: 'widgets' },
              allow: [
                { to: { type: 'features' } },
                { to: { type: 'entities' } },
                { to: { type: 'shared' } },
                { to: { type: 'widgets' } },
              ],
            },
            {
              from: {
                type: 'pages',
                captured: { page: '{{ from.captured.page }}' },
              },
              allow: [
                { to: { type: 'widgets' } },
                { to: { type: 'features' } },
                { to: { type: 'entities' } },
                { to: { type: 'shared' } },
                {
                  to: {
                    type: 'pages',
                    captured: { page: '{{ from.captured.page }}' },
                  },
                },
              ],
            },
            {
              from: { type: 'app' },
              allow: [
                { to: { type: 'pages' } },
                { to: { type: 'widgets' } },
                { to: { type: 'features' } },
                { to: { type: 'entities' } },
                { to: { type: 'shared' } },
                { to: { type: 'app' } },
              ],
            },
          ],
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
    },
    languageOptions: {
      globals: globals.browser,
    },
  },
  eslintConfigPrettier,
])
