

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
  plugins: ['stylelint-prettier'],
  rules: {
    'at-rule-no-unknown': [true, { ignoreAtRules: [/tailwind/, /include/, /mixin/] }],
    'block-closing-brace-empty-line-before': ['never'],
    'block-opening-brace-space-before': 'always',
    'color-hex-case': 'lower',
    'color-hex-length': 'long',
    'declaration-empty-line-before': ['never', { ignore: ['after-declaration'] }],
    'length-zero-no-unit': true,
    'max-empty-lines': 1,
    'no-empty-source': null,
    'no-eol-whitespace': true,
    'no-missing-end-of-source-newline': true,
    'number-max-precision': 3,
    'number-no-trailing-zeros': true,
    'prettier/prettier': true,
    'rule-empty-line-before': ['always', { except: ['after-single-line-comment', 'first-nested'] }],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['ng-deep'],
      },
    ],
    'selector-type-no-unknown': [true, { ignore: ['custom-elements', 'default-namespace'] }],
    'selector-class-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      { message: 'Class name must be kebab-case style' },
    ],
  },
};
