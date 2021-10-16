module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
      experimentalDecorators: true,
    },
  },
  rules: {
    'quotes': ['error', 'single', 'avoid-escape'],
    'eol-last': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'key-spacing': ['error', {
      'afterColon': true,
    }],
    'semi': ['error', 'never'],
    'array-bracket-spacing': ['error', 'never'],
    'no-spaced-func': ['error'],
    'space-infix-ops': ['error', {
      'int32Hint': false,
    }],
    'object-curly-spacing': ['error', 'never'],
    'object-property-newline': ['error', {
      'allowAllPropertiesOnSameLine': false,
    }],
    'brace-style': ['error'],
    'indent': ['error', 2],
    'object-curly-newline': ['error', {
      'ObjectExpression': 'always',
      'ObjectPattern': {
        'multiline': true,
      },
    }],
    'no-return-await': ['off'],
  },
  overrides: [{
    files: ['*.ts'],
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    rules: {
      'object-property-newline': ['error', {
        'allowAllPropertiesOnSameLine': false,
      }],
      'semi': ['error', 'never'],
      'array-bracket-spacing': ['error', 'never'],
      'no-spaced-func': ['error'],
      'space-infix-ops': ['error', {
        'int32Hint': false,
      }],
      'object-curly-spacing': ['error', 'never'],
      'brace-style': ['error'],
      'indent': ['error', 2],
      'object-curly-newline': ['error', {
        'ObjectExpression': 'always',
        'ObjectPattern': {
          'multiline': true,
        },
      }],
      'comma-dangle': ['error', 'always-multiline'],
    },
  }, {
    files: ['*.vue'],
    parser: 'vue-eslint-parser',
    extends: [
      'plugin:vue/strongly-recommended',
    ],
    rules: {
      'vue/no-unused-vars': 'error',
      'vue/valid-v-for': 'error',
      'vue/require-v-for-key': 'error',
      'vue/no-multi-spaces': 'error',
      'vue/component-name-in-template-casing': ['error', 'PascalCase', {
        registeredComponentsOnly: false,
      }],
      'vue/this-in-template': 'error',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/attribute-hyphenation': ['error', 'never'],
      'vue/html-closing-bracket-spacing': ['error', {
        startTag: 'never',
        endTag: 'never',
        selfClosingTag: 'never',
      }],
      'vue/mustache-interpolation-spacing': ['error', 'never'],
      'vue/html-self-closing': ['error', {
        'html': {
          'void': 'always',
          'normal': 'always',
          'component': 'always',
        },
      }],
      'vue/html-indent': ['error', 2, {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
      }],
      'vue/max-attributes-per-line': ['error', {
        singleline: 3,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      }],
      'vue/custom-event-name-casing': ['off'],
    },
  }],
}
