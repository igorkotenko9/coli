// @ts-check
/* eslint-env node */
// @ts-expect-error нет типов для этого патча
require("@rushstack/eslint-patch/modern-module-resolution");

// TODO: настроить @typescript-eslint/naming-convention https://typescript-eslint.io/rules/naming-convention после починки бага
/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    node: true,
    browser: true,
  },
  root: true,
  plugins: [
    "import", // https://github.com/import-js/eslint-plugin-import
    "vue", // https://github.com/vuejs/eslint-plugin-vue
    "perfectionist", // https://github.com/azat-io/eslint-plugin-perfectionist
    "sonarjs", // https://github.com/SonarSource/eslint-plugin-sonarjs
    "unicorn", // https://github.com/sindresorhus/eslint-plugin-unicorn
  ],
  extends: [
    "eslint:recommended", // https://eslint.org/docs/rules
    "plugin:eslint-comments/recommended", // https://github.com/eslint/eslint-plugin-eslint-comments
    "plugin:vue/vue3-recommended", // https://github.com/vuejs/eslint-plugin-vue
    "@vue/eslint-config-typescript/recommended",
    "@vue/eslint-config-prettier/skip-formatting",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    // *****************
    // * uncategorized *
    // *****************
    "prefer-template": "warn", // Предпочтение использования шаблонных строк
    "adjacent-overload-signatures": "off", // Отключено в пользу @typescript-eslint/adjacent-overload-signatures
    "no-implicit-coercion": "error", // Запрещает неявное преобразование типов
    "no-var": "error", // Запрещает использование var

    // *****************************************************************
    // * unicorn https://github.com/sindresorhus/eslint-plugin-unicorn *
    // *****************************************************************
    "unicorn/prevent-abbreviations": [
      "error",
      {
        extendDefaultReplacements: false,
        replacements: {
          e: {
            event: true,
            error: true,
          },
          evt: {
            event: true,
          },
          err: {
            error: true,
          },
          btn: {
            button: true,
          },
          val: {
            value: true,
          },
        },
      },
    ], // Запрещает сокращения в именах переменных и свойств, чтобы улучшить читаемость кода
    "unicorn/better-regex": "error", // Улучшает регулярные выражения путем замены их на более короткие и оптимизированные версии
    "unicorn/catch-error-name": "error", // Требует использования конвенции именования для ошибок в блоках catch
    "unicorn/consistent-function-scoping": "error", // Заставляет размещать функции на уровне области видимости, где они используются, если это возможно
    "unicorn/error-message": "error", // Требует, чтобы конструкторы ошибок вызывались с сообщением об ошибке
    "unicorn/escape-case": "error", // Запрещает использование неэкранированных символов в строках и шаблонах
    "unicorn/new-for-builtins": "error", // Требует использования оператора new для создания экземпляров встроенных объектов, таких как Map и Set
    "unicorn/no-array-callback-reference": "error", // Запрещает передачу ссылок на методы массивов в качестве аргументов для методов высшего порядка
    "unicorn/no-array-for-each": "error", // Предпочтение использования for...of вместо Array#forEach для итерации по массивам
    "unicorn/no-array-method-this-argument": "error", // Запрещает использование аргумента this в методах массивов
    "unicorn/no-array-push-push": "error", // Запрещает несколько вызовов push вместо одного с несколькими аргументами
    "unicorn/no-array-reduce": "error", // Запрещает использование метода Array#reduce и Array#reduceRight
    "unicorn/no-await-expression-member": "error", // Запрещает ожидание непромисного члена выражения
    "unicorn/no-console-spaces": "error", // Запрещает начальные и конечные пробелы в вызовах console.log и других методах консоли
    "unicorn/no-document-cookie": "error", // Запрещает использование document.cookie напрямую из соображений безопасности
    "unicorn/no-for-loop": "error", // Предпочтение использования for...of или Array#methods вместо традиционных for-циклов
    "unicorn/no-hex-escape": "error", // Предпочтение использования unicode escape-последовательностей вместо hex-escape
    "unicorn/no-instanceof-array": "error", // Требует использования Array.isArray() вместо instanceof Array
    "unicorn/no-invalid-remove-event-listener": "error", // Запрещает удаление слушателей событий, которые могут быть неправильно указаны
    "unicorn/no-lonely-if": "error", // Запрещает использование 'if' как единственного оператора внутри блока 'else'
    "unicorn/no-negated-condition": "error", // Запрещает отрицательные условия в конструкциях if, тернарных операторах и других
    "unicorn/no-new-array": "error", // Запрещает использование конструктора new Array() из-за неоднозначного синтаксиса
    "unicorn/no-new-buffer": "error", // Запрещает использование устаревшего конструктора new Buffer()
    "unicorn/no-object-as-default-parameter": "error", // Запрещает использование объектов в качестве значений по умолчанию для параметров
    "unicorn/no-thenable": "error", // Запрещает объекты с then методом, которые не являются настоящими промисами
    "unicorn/no-this-assignment": "error", // Запрещает ненужное сохранение контекста this в переменные
    "unicorn/no-unnecessary-await": "error", // Запрещает использование await с выражениями, которые не являются промисами
    "unicorn/no-unreadable-array-destructuring": "error", // Запрещает сложные и нечитаемые формы деструктуризации массивов
    "unicorn/no-unreadable-iife": "error", // Запрещает непонятные и трудночитаемые немедленно вызываемые функции (IIFE)
    "unicorn/no-useless-fallback-in-spread": "error", // Запрещает ненужные значения по умолчанию в операторах spread
    "unicorn/no-useless-length-check": "error", // Запрещает ненужные проверки длины массива
    "unicorn/no-useless-spread": "error", // Запрещает ненужное использование оператора spread
    "unicorn/no-useless-switch-case": "error", // Запрещает case в switch, которые не делают ничего полезного
    "unicorn/no-useless-undefined": "error", // Запрещает ненужное использование undefined, например, в return
    "unicorn/no-zero-fractions": "error", // Запрещает дроби, которые начинаются с нуля
    "unicorn/number-literal-case": "error", // Требует использование строчных букв для записи числовых литералов в шестнадцатеричном формате
    "unicorn/numeric-separators-style": "error", // Требует использование разделителей цифр для улучшения читаемости числовых литералов
    "unicorn/prefer-add-event-listener": "error", // Предпочтение использования addEventListener над "on" методами
    "unicorn/prefer-array-find": "error", // Предпочтение использования метода find вместо циклов
    "unicorn/prefer-array-flat": "error", // Предпочтение использования метода flat для уплощения массивов
    "unicorn/prefer-array-flat-map": "error", // Предпочтение использования метода flatMap для уплощения и маппинга массивов
    "unicorn/prefer-array-index-of": "error", // Предпочтение использования метода indexOf для поиска в массивах
    "unicorn/prefer-array-some": "error", // Предпочтение использования метода some для проверки наличия элементов, соответствующих условию
    "unicorn/prefer-at": [
      "error",
      {
        checkAllIndexAccess: false, // Проверять не только отрицательные индексы
      },
    ], // Предпочтение использования метода at для доступа к элементам массива по индексу
    "unicorn/prefer-blob-reading-methods": "error", // Предпочтение использования новых API для чтения Blob
    "unicorn/prefer-date-now": "error", // Предпочтение использования Date.now() вместо создания нового объекта Date
    "unicorn/prefer-default-parameters": "error", // Предпочтение использования параметров по умолчанию в функциях
    "unicorn/prefer-dom-node-dataset": "error", // Предпочтение использования dataset для доступа к data-атрибутам
    "unicorn/prefer-dom-node-remove": "error", // Предпочтение использования метода remove для удаления DOM-узлов
    "unicorn/prefer-dom-node-text-content": "error", // Предпочтение использования textContent для доступа к тексту DOM-узлов
    "unicorn/prefer-event-target": "error", // Предпочтение использования EventTarget вместо иных способов слушать события
    "unicorn/prefer-export-from": "error", // Предпочтение использования export ... from для реэкспорта
    "unicorn/prefer-includes": "error", // Предпочтение использования includes вместо indexOf для проверки наличия элемента
    "unicorn/prefer-keyboard-event-key": "error", // Предпочтение использования key вместо keyCode в событиях клавиатуры
    "unicorn/prefer-logical-operator-over-ternary": "error", // Предпочтение использования логических операторов вместо тернарных
    "unicorn/prefer-math-trunc": "error", // Предпочтение использования Math.trunc вместо битовых операторов для округления
    "unicorn/prefer-modern-math-apis": "error", // Предпочтение использования современных API Math вместо устаревших
    "unicorn/prefer-native-coercion-functions": "error", // Предпочтение использования нативных функций приведения типов
    "unicorn/prefer-negative-index": "error", // Предпочтение использования отрицательных индексов для доступа к элементам с конца
    "unicorn/prefer-number-properties": "error", // Предпочтение использования свойств объекта Number вместо глобальных констант
    "unicorn/prefer-object-from-entries": "error", // Предпочтение использования Object.fromEntries для создания объектов из массивов пар ключ/значение
    "unicorn/prefer-optional-catch-binding": "error", // Предпочтение использования необязательного catch binding
    "unicorn/prefer-query-selector": "error", // Предпочтение использования querySelector вместо getElementsBy* методов
    "unicorn/prefer-reflect-apply": "error", // Предпочтение использования Reflect.apply вместо apply/call/bind методов
    "unicorn/prefer-regexp-test": "error", // Предпочтение использования RegExp.prototype.test вместо String.prototype.match
    "unicorn/prefer-set-has": "error", // Предпочтение использования метода has вместо indexOf для проверки наличия элемента в Set
    "unicorn/prefer-set-size": "error", // Предпочтение использования свойства size для получения количества элементов в Set
    "unicorn/prefer-string-replace-all": "error", // Предпочтение использования String.prototype.replaceAll вместо нескольких String.prototype.replace
    "unicorn/prefer-string-slice": "error", // Предпочтение использования String.prototype.slice вместо String.prototype.substr или String.prototype.substring
    "unicorn/prefer-string-starts-ends-with": "error", // Предпочтение использования методов String.prototype.startsWith и String.prototype.endsWith вместо сравнения подстрок
    "unicorn/prefer-string-trim-start-end": "error", // Предпочтение использования String.prototype.trimStart и String.prototype.trimEnd вместо String.prototype.trimLeft и String.prototype.trimRight
    "unicorn/prefer-switch": "error", // Предпочтение использования конструкции switch вместо множественных if-else
    "unicorn/prefer-ternary": "error", // Предпочтение использования тернарного оператора вместо простых условных выражений
    "unicorn/prefer-type-error": "error", // Предпочитает создание экземпляров TypeError вместо Error при сообщении об ошибках типов
    "unicorn/require-array-join-separator": "error", // Требует указания разделителя при использовании метода Array.prototype.join
    "unicorn/require-number-to-fixed-digits-argument": "error", // Требует указания количества цифр после десятичной точки при использовании метода Number.prototype.toFixed
    "unicorn/string-content": "error", // Позволяет настроить правила для содержимого строковых литералов
    "unicorn/switch-case-braces": "error", // Требует или запрещает фигурные скобки в case/default разделах switch
    "unicorn/template-indent": "error", // Устанавливает уровень отступа для строковых литералов с использованием шаблонных литералов
    "unicorn/text-encoding-identifier-case": "error", // Накладывает ограничения на регистр идентификаторов кодировки текста
    "unicorn/throw-new-error": "error", // Требует использования throw с созданием нового экземпляра ошибки

    // ****************************************************************
    // * sonarjs https://github.com/SonarSource/eslint-plugin-sonarjs *
    // ****************************************************************
    "sonarjs/cognitive-complexity": "error", // Ограничивает сложность кода, чтобы улучшить его читаемость и поддерживаемость
    "sonarjs/no-all-duplicated-branches": "error", // Запрещает использование одинакового кода во всех ветках условных конструкций
    "sonarjs/no-identical-conditions": "error", // Запрещает использование идентичных условий в условных конструкциях
    "sonarjs/no-identical-expressions": "error", // Запрещает использование идентичных выражений в одном логическом контексте
    "sonarjs/no-use-of-empty-return-value": "error", // Запрещает использование возвращаемых значений функций, если они всегда пусты (undefined)
    "sonarjs/non-existent-operator": "error", // Запрещает использование операторов, которых не существует в языке JavaScript
    "sonarjs/no-duplicated-branches": "error", // Запрещает дублирование кода в различных ветвях условных конструкций
    "sonarjs/no-gratuitous-expressions": "error", // Запрещает выражения, которые не влияют на результат выполнения программы
    "sonarjs/no-identical-functions": "error", // Запрещает создание идентичных функций
    "sonarjs/no-inverted-boolean-check": "error", // Запрещает инвертированные проверки булевых значений, которые усложняют понимание кода
    "sonarjs/no-nested-switch": "error", // Запрещает использование вложенных конструкций switch
    "sonarjs/no-nested-template-literals": "error", // Запрещает использование вложенных шаблонных литералов
    "sonarjs/no-redundant-boolean": "error", // Запрещает избыточные булевые контексты, например, использование `!!` или `Boolean(...)`
    "sonarjs/no-redundant-jump": "error", // Запрещает избыточные переходы, такие как return, break или continue в конце блока кода
    "sonarjs/no-same-line-conditional": "error", // Запрещает использование условных операторов на той же строке, что и другие инструкции
    "sonarjs/no-small-switch": "error", // Запрещает использование конструкции switch с малым количеством случаев (менее 3)
    "sonarjs/prefer-object-literal": "error", // Предпочтение использования литерала объекта для создания объектов
    "sonarjs/prefer-single-boolean-return": "error", // Предпочитает функции с единственным булевым возвращаемым значением

    // ************************************************************
    // * import https://github.com/import-js/eslint-plugin-import *
    // ************************************************************
    "import/consistent-type-specifier-style": ["warn", "prefer-inline"],

    // *********************************************************************
    // * typescript https://github.com/typescript-eslint/typescript-eslint *
    // *********************************************************************
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/adjacent-overload-signatures": "error",
    // ! Этот блок правил не включать. Вызывает проблемы с производительностью.
    // ? См https://github.com/vuejs/vue-eslint-parser/issues/65 https://github.com/vuejs/vue-eslint-parser/issues/104
    // "@typescript-eslint/indent": "off",
    // "@typescript-eslint/consistent-type-imports": [
    //   "warn",
    //   {
    //     prefer: "type-imports",
    //     disallowTypeAnnotations: true,
    //     fixStyle: "inline-type-imports",
    //   },
    // ],
    // "@typescript-eslint/consistent-type-exports": [
    //   "error",
    //   { fixMixedExportsWithInlineTypeSpecifier: true },
    // ],
    // "@typescript-eslint/prefer-includes": "warn",
    // "@typescript-eslint/no-unnecessary-boolean-literal-compare": "warn",
    // "@typescript-eslint/no-unnecessary-type-assertion": "warn",
    // "@typescript-eslint/prefer-optional-chain": "warn",
    // "@typescript-eslint/consistent-indexed-object-style": ["error", "record"],
    // ---------------------

    // ************************************************************************
    // * perfectionist https://github.com/azat-io/eslint-plugin-perfectionist *
    // ************************************************************************
    "perfectionist/sort-array-includes": [
      "warn",
      {
        order: "asc",
        type: "natural",
      },
    ],
    "perfectionist/sort-exports": [
      "warn",
      {
        order: "asc",
        type: "natural",
      },
    ],
    "perfectionist/sort-named-exports": [
      "warn",
      {
        order: "asc",
        type: "natural",
      },
    ],
    "perfectionist/sort-named-imports": [
      "warn",
      {
        order: "asc",
        type: "natural",
      },
    ],
    "perfectionist/sort-imports": [
      "warn",
      {
        "custom-groups": {
          type: {
            "internal-components": [
              "@components{/,}**",
              "@fields{/,}**",
              "@views{/,}**",
            ],
            "internal-utils": ["@hooks{/,}**", "@utils{/,}**", "@types{/,}**"],
            vue: ["vue{/,}**"],
          },
          value: {
            "internal-components": [
              "@components{/,}**",
              "@fields{/,}**",
              "@views{/,}**",
            ],
            "internal-utils": ["@hooks{/,}**", "@utils{/,}**", "@types{/,}**"],
            vue: ["vue{/,}**"],
          },
        },
        groups: [
          "builtin",
          "vue",
          ["external", "external-type"],
          ["index", "index-type"],
          ["internal-utils", "internal-type", "internal"],
          "internal-components",
          ["parent-type", "parent", "sibling", "sibling-type"],
          "style",
          "unknown",
        ],
        "internal-pattern": [
          "@/**",
          "@static*",
          "@services*",
          "@assets*",
          "@constants",
          "@style*",
        ],
        "newlines-between": "always",
        order: "asc",
        type: "natural",
      },
    ],
    "perfectionist/sort-interfaces": [
      "warn",
      {
        order: "asc",
        type: "natural",
      },
    ],
    "perfectionist/sort-object-types": [
      "warn",
      {
        order: "asc",
        type: "natural",
      },
    ],
    "perfectionist/sort-union-types": [
      "warn",
      {
        order: "asc",
        type: "natural",
      },
    ],
    "perfectionist/sort-vue-attributes": [
      "warn",
      {
        order: "asc",
        type: "natural",
        "custom-groups": {
          definition: "?(:)is",
          "list-rendering": "v-for*",
          conditionals: "v-{if,else-if,else,show,cloak}",
          "render-modifiers": "?(:){pre,once}",
          global: "?(:)id",
          unique: "?(:){key,ref}",
          slot: ["slot", "slot-scope"],
          "two-way-data-bindings": "v-model*",
          "other-directives": "v-*",
          "dynamic-classes": ":class",
          "static-classes": "class",
          styles: "?(:)style",
          "static-attributes": "+([a-z]?([-]+([a-z])))",
          "dynamic-attributes": ":+([a-z])?(-+([a-z]))",
          events: ["v-on", "@", "?(:)on"],
          content: "v-{text,html}",
        },
        groups: [
          "definition",
          "list-rendering",
          "conditionals",
          "render-modifiers",
          "global",
          "unique",
          "slot",
          "two-way-data-bindings",
          "other-directives",
          "static-classes",
          "dynamic-classes",
          "styles",
          "static-attributes",
          "dynamic-attributes",
          "events",
          "content",
        ],
      },
    ],

    // **************************************************
    // * vue https://github.com/vuejs/eslint-plugin-vue *
    // **************************************************
    "vue/block-lang": [
      "error",
      {
        script: {
          lang: "ts",
        },
        style: {
          lang: "scss",
        },
      },
    ],
    "vue/block-order": [
      "error",
      {
        order: ["template", "script", "style"],
      },
    ],
    "vue/component-api-style": [
      "error",
      ["script-setup"], // "script-setup", "composition", "composition-vue2", or "options"
    ], //Проверка на определенный регистр для имени компонента.
    "vue/component-definition-name-casing": ["error", "PascalCase"],
    "vue/component-name-in-template-casing": [
      "error",
      "PascalCase", //  по умолчанию требует написание имен тегов в "kebab-case"
      {
        ignores: [], // имена элементов, которые следует игнорировать. Устанавливает разрешающее имя элемента. Например, пользовательские элементы или компоненты Vue со специальным именем. Вы можете установить регулярное выражение, написав его как "/^name/".
        registeredComponentsOnly: false, // если true, проверяются только зарегистрированные компоненты, если false проверьте все. По умолчанию true.
      },
    ], //Проверка регистра для стиля именования компонентов в шаблоне.
    "vue/custom-event-name-casing": [
      "error",
      "kebab-case",
      {
        ignores: ["/^[a-z]+(?:-[a-z]+)*:[a-z]+(?:-[a-z]+)*$/u"],
      },
    ],
    "vue/v-on-event-hyphenation": [
      "warn",
      "always",
      {
        autofix: true,
      },
    ],
    "vue/define-emits-declaration": ["error", "type-literal"],
    "vue/define-macros-order": [
      "warn",
      {
        defineExposeLast: true,
      },
    ],
    "vue/define-props-declaration": ["error", "runtime"],
    "vue/html-button-has-type": [
      "error",
      {
        button: true,
        reset: true,
        submit: true,
      },
    ],
    "vue/html-self-closing": [
      "warn",
      {
        html: {
          component: "always", // ("always" по умолчанию) — стиль пользовательских компонентов Vue.js.
          normal: "always", // ("always" по умолчанию) — стиль известных элементов HTML за исключением пустых элементов.
          void: "any", // ("never" по умолчанию) — стиль хорошо известных пустых элементов HTML
        },
        math: "always", // ("always" по умолчанию) — стиль известных элементов MathML.
        svg: "always", // ("always" по умолчанию) — стиль известных элементов SVG.
      },
    ],
    "vue/match-component-file-name": [
      "error",
      {
        extensions: ["vue"], // массив расширений файлов для проверки. По умолчанию установлено значение ["jsx"].
        shouldMatchCase: true, // должно ли имя компонента также соответствовать регистру имени файла. По умолчанию установлено значение false.
      },
    ],
    "vue/match-component-import-name": "error",
    "vue/next-tick-style": ["error", "promise"],
    "vue/no-duplicate-attr-inheritance": "error",
    "vue/no-export-in-script-setup": "off",
    "vue/no-multiple-objects-in-class": "error",
    "vue/no-ref-object-destructure": "warn",
    "vue/no-setup-props-destructure": "off",
    "vue/no-static-inline-styles": "error",
    "vue/no-undef-components": [
      "error",
      {
        ignorePatterns: [],
      },
    ],
    "vue/no-unused-emit-declarations": "warn",
    "vue/no-useless-mustaches": [
      "error",
      {
        ignoreIncludesComment: false,
        ignoreStringEscape: true,
      },
    ],
    "vue/no-useless-v-bind": [
      "error",
      {
        ignoreIncludesComment: false,
        ignoreStringEscape: false,
      },
    ],
    "vue/no-v-html": "off",
    "vue/no-v-text": "error",
    "vue/order-in-components": [
      "error",
      {
        order: [
          "el",
          "name",
          "key",
          "parent",
          "functional",
          ["delimiters", "comments"],
          ["components", "directives", "filters"],
          "extends",
          "mixins",
          ["provide", "inject"],
          "ROUTER_GUARDS",
          "layout",
          "middleware",
          "validate",
          "scrollToTop",
          "transition",
          "loading",
          "inheritAttrs",
          "model",
          ["props", "propsData"],
          "emits",
          "setup",
          "asyncData",
          "data",
          "fetch",
          "head",
          "computed",
          "watch",
          "watchQuery",
          "methods",
          ["template", "render"],
          "renderError",
          "LIFECYCLE_HOOKS",
        ],
      },
    ], // Порядок свойств в компонентах.
    "vue/prefer-define-options": "warn",
    "vue/prefer-import-from-vue": "warn",
    "vue/prefer-prop-type-boolean-first": "warn",
    "vue/prefer-separate-static-class": "error",
    "vue/prefer-template": "warn",
    // "vue/prefer-true-attribute-shorthand": "warn", // Отключил по просьбе данила // TODO: обсудить
    "vue/require-default-prop": "off",
    "vue/require-macro-variable-name": "warn",
    "vue/require-typed-object-prop": "warn",
    "vue/v-for-delimiter-style": ["error", "in"],
    "vue/valid-define-options": "error",
    "vue/component-options-name-casing": ["warn", "PascalCase"],
    "vue/attributes-order": "off", // Отключено в пользу perfectionist/sort-vue-attributes
    "vue/enforce-style-attribute": ["error", { allow: ["scoped"] }],
  },
};
