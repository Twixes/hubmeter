module.exports = {
  env: {
    browser: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'promise', 'simple-import-sort'],
  extends: ['react-app', 'plugin:@typescript-eslint/recommended', 'plugin:promise/recommended'],
  ignorePatterns: ['bin', 'dist', 'node_modules'],
  rules: {
    'space-before-function-paren': [
      'error',
      {
        named: 'never'
      }
    ],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'jsx-quotes': ['error', 'prefer-double'],
    'react/jsx-closing-tag-location': 'off',
    'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
    'react/jsx-tag-spacing': [
      'error',
      {
        closingSlash: 'never',
        beforeSelfClosing: 'never',
        afterOpening: 'never',
        beforeClosing: 'never'
      }
    ]
  }
}
