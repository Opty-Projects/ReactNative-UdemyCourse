module.exports = {
  env: {
    browser: true,
    es2021: true,
    'react-native/react-native': true
  },
  extends: [
    'plugin:react/recommended',
    'airbnb'
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react',
    'react-native',
    'react-hooks'
  ],
  rules: {
    'comma-dangle': 'off',
    'no-use-before-define': 'off',
    'react/jsx-filename-extension': 'off',
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'error',
    'react-native/no-inline-styles': 'error',
    'react-native/no-color-literals': 'error',
    'react-native/no-raw-text': 'error',
    'react-native/no-single-element-style-arrays': 'error'
  }
};
