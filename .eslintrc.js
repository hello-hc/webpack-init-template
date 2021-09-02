module.exports = {
  // So parent files don't get applied
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true
  },
  extends: 'eslint:recommended',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  plugins: ['babel', 'react'],
  rules: {
    'no-console': ['warn', {'allow': ['info']}],
    'array-bracket-spacing': ['error', 'never'],
    'block-spacing': ['error', 'always'],
    'brace-style': 'error',
    // 因为React新的生命周期函数不符合这个规则，所以临时禁用
    // 'camelcase': ['error', {properties: 'always'}],
    'comma-spacing': ['error', {before: false, after: true}],
    'comma-style': ['error', 'last'],
    'computed-property-spacing': ['error', 'never'],
    'consistent-this': ['error', 'self'],
    'func-name-matching': 'error',
    'indent': ['error', 2, {SwitchCase: 1}],
    'jsx-quotes': ['error', 'prefer-double'],
    'max-params': ['error', {max: 4}],
    'new-cap': ['off', {capIsNew: true, newIsCap: true}], // Wishlist, one day

    // 'newline-after-var': ['error', 'always'],
    // 'newline-before-return': 'error',
    'padding-line-between-statements': [
      'error',
      {blankLine: 'always', prev: '*', next: 'return'},
      {blankLine: 'always', prev: ['const', 'let', 'var'], next: '*'},
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var']
      }
    ],

    'no-alert': 'error',
    'no-bitwise': 'error',
    'no-confusing-arrow': 'error',
    'no-continue': 'error',
    'no-duplicate-imports': 'error',
    'no-lonely-if': 'error',
    'no-multiple-empty-lines': 'error',
    'no-new-object': 'error',
    'no-tabs': 'error',
    'no-trailing-spaces': 'error',
    //conflate with private function defination,
    //confirmed with team to remove it.
    //'no-underscore-dangle': 'error',
    'no-unused-vars': 'error',
    'no-var': 'error',
    'object-property-newline': ["error", {"allowMultiplePropertiesPerLine": true}],
    'one-var': ['error', 'never'],
    'operator-linebreak': ['error', 'before'],
    'semi': ['error', 'always'],
    'wrap-regex': 'off',
    'no-prototype-builtins': 'off',
    'space-infix-ops': 'error',

    // 'babel/no-await-in-loop': 'error',
    'no-await-in-loop': 'error',

    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-indent-props': 'off',
    'react/jsx-indent': 'off',
    'babel/object-curly-spacing': ['error', 'never'],

    'babel/new-cap': 'off',
  }
};
