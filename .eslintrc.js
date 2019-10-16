module.exports = {
  extends: [
    'react-app',
    'airbnb',
  ],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'import/no-cycle': 'off',
    'import/no-unresolved': 'off',
    'no-underscore-dangle': 'off',
    'no-multi-spaces': [
      'error',
      {
        'ignoreEOLComments': true,
      },
    ],
    'no-plusplus': 'off',
    'no-use-before-define': [
      'error',
      {
        'functions': false
      },
    ],
    'one-var': 'off',
    'quote-props': [
      'error',
      'as-needed',
      {
        'numbers': true,
      },
    ],
    'react/destructuring-assignment': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/no-array-index-key': 'off',
    'react/prop-types': 'off',
    'semi': [
      'error',
    ],
  },
};
