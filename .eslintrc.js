module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:import/typescript',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'vue/html-self-closing': [
      2,
      {
        html: {
          void: 'always'
        }
      }
    ],
    'react/jsx-key': 2,
    'react/jsx-no-duplicate-props': 2,
    'react/jsx-sort-props': [
      2,
      {
        shorthandFirst: true,
        callbacksLast: true,
        ignoreCase: true
      }
    ],
    'react/self-closing-comp': [
      2,
      {
        component: true,
        html: true
      }
    ],
    'react/jsx-no-undef': 2,
    '@typescript-eslint/no-unused-vars': 2,
    '@typescript-eslint/array-type': 2,
    '@typescript-eslint/ban-types': 2,
    '@typescript-eslint/no-empty-interface': 2,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/naming-convention': [
      2,
      { selector: 'variableLike', format: ['camelCase', 'PascalCase'] },
      {
        selector: 'parameter',
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow'
      },
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow'
      },
      {
        selector: ['interface', 'typeLike', 'class'],
        format: ['PascalCase']
      },
      { selector: 'enum', format: ['PascalCase'] },
      { selector: 'enumMember', format: ['UPPER_CASE'] }
    ],
    'no-console': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue']
      }
    }
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: require.resolve('@typescript-eslint/parser'),
    extraFileExtensions: ['.vue'],
    ecmaFeatures: {
      jsx: true
    }
  },
  globals: {
    JSX: true
  },
  overrides: [
    {
      files: ['shims-vue.d.ts'],
      rules: {
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off'
      }
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // The core 'no-unused-vars' rules (in the eslint:recommeded ruleset)
        // does not work with type definitions
        'no-unused-vars': 'off'
      }
    }
  ]
}
