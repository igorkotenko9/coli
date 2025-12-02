// @ts-check
/* eslint-env node */
import propertyGroups from "./stylelint-order-preset.js";

/** @type {import('stylelint').Config} */
export default {
  cache: true,
  allowEmptyInput: true,
  plugins: ["stylelint-order", "stylelint-scss"],
  overrides: [
    {
      files: ["*.scss", "**/*.scss"],
      customSyntax: "postcss-scss",
    },
    {
      files: ["*.vue", "**/*.vue", "*.html", "**/*.html"],
      customSyntax: "postcss-html",
    },
  ],
  extends: ["stylelint-config-standard-scss"],
  rules: {
    "media-query-no-invalid": null,
    "media-feature-range-notation": null,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["deep", "global", "slotted"],
      },
    ],
    "selector-pseudo-element-no-unknown": [
      true,
      {
        ignorePseudoElements: ["v-deep", "v-global", "v-slotted"],
      },
    ],
    "scss/at-import-partial-extension": null,
    "function-no-unknown": null,
    "scss/at-import-no-partial-leading-underscore": null, // Устаревшее, поэтому отключил
    "declaration-property-value-no-unknown": [
      true,
      {
        severity: "warning",
        ignoreProperties: {
          "/.+/": "/v-bind+/",
        },
      },
    ],
    "function-url-quotes": "always",
    "declaration-block-no-duplicate-custom-properties": true,
    "declaration-empty-line-before": null,
    "no-empty-source": null,
    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": true,
    "selector-max-type": [
      0,
      {
        ignore: ["custom-elements"],
      },
    ],
    "selector-max-class": 3,
    "selector-max-compound-selectors": 1,
    "alpha-value-notation": "number",
    "shorthand-property-no-redundant-values": true,
    "selector-pseudo-class-disallowed-list": ["root"],
    "selector-class-pattern": [
      "^[a-z]([-]?[a-z0-9]+)*(__[a-z0-9]([-]?[a-z0-9]+)*)?(--[a-z0-9]([-|_]?[a-z0-9]+)*)?$",
      {
        /** This option will resolve nested selectors with & interpolation. - https://stylelint.io/user-guide/rules/selector-class-pattern/#resolvenestedselectors-true--false-default-false */
        resolveNestedSelectors: true,
      },
    ],
    "number-max-precision": 2,
    "declaration-no-important": true,
    "block-no-empty": [
      true,
      {
        severity: "warning",
      },
    ],
    "property-disallowed-list": [
      "flex",
      "font",
      "background",
      "grid",
      "grid-template",
      "font-variant",
      "font-emphasize",
      "text-emphasis",
      "text-decoration",
      "border-image",
    ],
    "declaration-block-no-redundant-longhand-properties": [
      true,
      {
        ignoreShorthands: [
          "flex",
          "font",
          "background",
          "grid",
          "grid-template",
          "font-variant",
          "font-emphasize",
          "text-emphasis",
          "text-decoration",
          "border-image",
        ],
      },
    ],
    "length-zero-no-unit": [
      true,
      {
        ignore: ["custom-properties"],
      },
    ],
    "order/order": ["custom-properties", "declarations"],
    "order/properties-order": propertyGroups.map((group) => ({
      ...group,
      emptyLineBefore: "always",
      noEmptyLineBetween: true,
    })),
    "value-keyword-case": [
      "lower",
      {
        ignoreFunctions: ["v-bind"],
      },
    ],
    // Устраняет конфликт stylelint scss и prettier
    "at-rule-empty-line-before": null,
    "scss/at-else-closing-brace-newline-after": null,
    "scss/at-else-closing-brace-space-after": null,
    "scss/at-else-empty-line-before": null,
    "scss/at-else-if-parentheses-space-before": null,
    "scss/at-function-parentheses-space-before": null,
    "scss/at-if-closing-brace-newline-after": null,
    "scss/at-if-closing-brace-space-after": null,
    "scss/at-mixin-parentheses-space-before": null,
    "scss/dollar-variable-colon-newline-after": null,
    "scss/dollar-variable-colon-space-after": null,
    "scss/dollar-variable-colon-space-before": null,
    "scss/operator-no-newline-after": null,
    "scss/operator-no-newline-before": null,
    "scss/operator-no-unspaced": null,
  },
};
