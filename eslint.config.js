// import eslint from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist",
      "vite.config.d.ts",
      "vite.config.js",
    ],
  },
  {
    // "extends": [
    //   eslint.configs.recommended,
    //   ...tseslint.configs.recommended,
    // ],
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@typescript-eslint": tseslint.plugin,
      import: importPlugin,
      react,
      "@stylistic": stylistic,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],
      "react-hooks/exhaustive-deps": [
        "warn",
        {
          additionalHooks: "useUpdateEffect",
        },
      ],
      "react/display-name": "off",
      "react/no-unescaped-entities": "off",
      "react/no-unknown-property": [
        "warn",
        {
          ignore: [],
        },
      ],
      "react/jsx-no-useless-fragment": [
        "warn",
        {
          allowExpressions: true,
        },
      ],
      "react/jsx-fragments": "warn",
      "import/newline-after-import": "warn",
      "@stylistic/array-bracket-newline": ["warn", { multiline: true }],
      "@stylistic/array-bracket-spacing": ["warn", "never"],
      "@stylistic/array-element-newline": [
        "warn",
        {
          consistent: true,
          multiline: true,
        },
      ],
      "@stylistic/arrow-parens": ["warn", "always"],
      "@stylistic/arrow-spacing": [
        "warn",
        {
          before: true,
          after: true,
        },
      ],
      "@stylistic/block-spacing": ["warn", "always"],
      "@stylistic/brace-style": [
        "warn",
        "1tbs",
        {
          allowSingleLine: false,
        },
      ],
      "@stylistic/comma-dangle": [
        "warn",
        {
          arrays: "always-multiline",
          objects: "always-multiline",
          imports: "always-multiline",
          exports: "only-multiline",
          functions: "only-multiline",
          enums: "only-multiline",
          generics: "ignore",
          tuples: "only-multiline",
        },
      ],
      "@stylistic/comma-spacing": [
        "warn",
        {
          before: false,
          after: true,
        },
      ],
      "@stylistic/comma-style": ["warn", "last"],
      "@stylistic/computed-property-spacing": [
        "warn",
        "never",
        {
          enforceForClassMembers: true,
        },
      ],
      "@stylistic/curly-newline": [
        "warn",
        {
          consistent: true,
        },
      ],
      "@stylistic/dot-location": ["warn", "property"],
      "@stylistic/eol-last": ["warn", "always"],
      "@stylistic/function-call-argument-newline": ["warn", "consistent"],
      "@stylistic/function-call-spacing": ["warn", "never"],
      "@stylistic/function-paren-newline": ["warn", "multiline-arguments"],
      "@stylistic/generator-star-spacing": [
        "warn",
        {
          before: false,
          after: true,
          anonymous: "neither",
          method: "both",
        },
      ],
      "@stylistic/implicit-arrow-linebreak": ["off", "beside"],
      "@stylistic/indent": [
        "warn",
        2,
        {
          SwitchCase: 1,
          VariableDeclarator: "first",
        },
      ],
      "@stylistic/indent-binary-ops": ["warn", 2],
      "@stylistic/jsx-child-element-spacing": "warn",
      "@stylistic/jsx-closing-bracket-location": [
        "warn",
        {
          selfClosing: "line-aligned",
          nonEmpty: false,
        },
      ],
      "@stylistic/jsx-closing-tag-location": ["warn", "line-aligned"],
      "@stylistic/jsx-curly-brace-presence": [
        "warn",
        {
          props: "never",
          children: "never",
          propElementValues: "always",
        },
      ],
      "@stylistic/jsx-curly-newline": [
        "warn",
        {
          multiline: "consistent",
          singleline: "forbid",
        },
      ],
      "@stylistic/jsx-curly-spacing": [
        "warn",
        {
          when: "never",
          children: true,
          attribute: true,
          allowMultiline: true,
          spacing: {
            objectLiterals: "never",
          },
        },
      ],
      "@stylistic/jsx-equals-spacing": ["warn", "never"],
      "@stylistic/jsx-first-prop-new-line": ["warn", "multiline-multiprop"],
      "@stylistic/jsx-function-call-newline": ["warn", "multiline"],
      "@stylistic/jsx-indent": [
        "warn",
        2,
        {
          checkAttributes: true,
          indentLogicalExpressions: true,
        },
      ],
      "@stylistic/jsx-indent-props": [
        "warn",
        {
          indentMode: 2,
          ignoreTernaryOperator: true,
        },
      ],
      "@stylistic/jsx-max-props-per-line": [
        "warn",
        {
          when: "multiline",
          maximum: 1,
        },
      ],
      "@stylistic/jsx-newline": [
        "off",
        {
          prevent: false,
        },
      ],
      "@stylistic/jsx-one-expression-per-line": [
        "off",
        {
          allow: "single-line",
        },
      ],
      "@stylistic/jsx-pascal-case": [
        "warn",
        {
          allowAllCaps: false,
          allowNamespace: false,
          allowLeadingUnderscore: false,
          ignore: [],
        },
      ],
      "@stylistic/jsx-props-no-multi-spaces": "warn",
      "@stylistic/jsx-quotes": [
        "warn",
        "prefer-double",
      ],
      "@stylistic/jsx-self-closing-comp": [
        "warn",
        {
          component: true,
          html: true,
        },
      ],
      "@stylistic/jsx-sort-props": [
        "warn",
        {
          callbacksLast: true,
          shorthandFirst: false,
          shorthandLast: false,
          multiline: "ignore",
          ignoreCase: true,
          noSortAlphabetically: true,
          reservedFirst: true,
          locale: "auto",
        },
      ],
      "@stylistic/jsx-tag-spacing": [
        "warn",
        {
          closingSlash: "never",
          beforeSelfClosing: "always",
          afterOpening: "never",
          beforeClosing: "never",
        },
      ],
      "@stylistic/jsx-wrap-multilines": [
        "warn",
        {
          declaration: "parens-new-line",
          assignment: "parens-new-line",
          return: "parens-new-line",
          arrow: "ignore",
          condition: "ignore",
          logical: "ignore",
          prop: "ignore",
          propertyValue: "ignore",
        },
      ],
      "@stylistic/key-spacing": [
        "warn",
        {
          beforeColon: false,
          afterColon: true,
          mode: "strict",
        },
      ],
      "@stylistic/keyword-spacing": [
        "warn",
        {
          before: true,
          after: true,
        },
      ],
      "@stylistic/line-comment-position": [
        "off",
        {
          position: "above",
        },
      ],
      "@stylistic/linebreak-style": ["warn", "windows"],
      "@stylistic/lines-around-comment": [
        "off",
        {
          beforeBlockComment: true,
          afterBlockComment: false,
          beforeLineComment: true,
          afterLineComment: false,
          allowBlockStart: true,
          allowBlockEnd: true,
          allowObjectStart: true,
          allowObjectEnd: true,
          allowArrayStart: true,
          allowArrayEnd: true,
          allowClassStart: true,
          allowClassEnd: true,
          applyDefaultIgnorePatterns: true,
        },
      ],
      "@stylistic/lines-between-class-members": [
        "warn",
        {
          enforce: [
            {
              blankLine: "always", prev: "*", next: "method",
            },
            {
              blankLine: "always", prev: "method", next: "*",
            },
            {
              blankLine: "never", prev: "field", next: "field",
            },
          ],
        },
        {
          exceptAfterSingleLine: false,
        },
      ],
      "@stylistic/max-len": [
        "warn",
        {
          code: 200,
          tabWidth: 2,
          comments: 200,
          ignoreComments: false,
          ignoreTrailingComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignorePattern: "",
        },
      ],
      "@stylistic/max-statements-per-line": [
        "warn",
        {
          max: 2,
        },
      ],
      "@stylistic/member-delimiter-style": [
        "warn",
        {
          multiline: {
            delimiter: "semi",
            requireLast: true,
          },
          singleline: {
            delimiter: "semi",
            requireLast: true,
          },
        },
      ],
      "@stylistic/multiline-comment-style": ["off", "starred-block"],
      "@stylistic/multiline-ternary": ["warn", "always-multiline"],
      "@stylistic/new-parens": ["warn", "always"],
      "@stylistic/newline-per-chained-call": [
        "warn",
        {
          ignoreChainWithDepth: 2,
        },
      ],
      "@stylistic/no-confusing-arrow": [
        "warn",
        {
          allowParens: true,
          onlyOneSimpleParam: true,
        },
      ],
      "@stylistic/no-extra-parens": [
        "warn",
        "functions",
        // {
        //   conditionalAssign: false,
        //   returnAssign: false,
        //   nestedBinaryExpressions: false,
        //   ternaryOperandBinaryExpressions: false,
        //   ignoreJSX: "multi-line",
        //   enforceForArrowConditionals: false,
        //   enforceForSequenceExpressions: false,
        //   enforceForNewInMemberExpressions: false,
        //   enforceForFunctionPrototypeMethods: false,
        //   allowParensAfterCommentPattern: "@type",
        //   nestedConditionalExpressions: false,
        // },
      ],
      "@stylistic/no-extra-semi": "warn",
      "@stylistic/no-floating-decimal": "warn",
      "@stylistic/no-mixed-operators": ["warn"],
      "@stylistic/no-mixed-spaces-and-tabs": ["warn", "smart-tabs"],
      "@stylistic/no-multi-spaces": "warn",
      "@stylistic/no-multiple-empty-lines": [
        "warn",
        {
          max: 1,
          maxBOF: 0,
          maxEOF: 0,
        },
      ],
      "@stylistic/no-tabs": [
        "warn",
        {
          allowIndentationTabs: false,
        },
      ],
      "@stylistic/no-trailing-spaces": "warn",
      "@stylistic/no-whitespace-before-property": "warn",
      "@stylistic/nonblock-statement-body-position": ["warn", "beside"],
      "@stylistic/object-curly-newline": [
        "warn",
        {
          consistent: true,
        },
      ],
      "@stylistic/object-curly-spacing": [
        "warn",
        "always",
      ],
      "@stylistic/object-property-newline": [
        "warn",
        {
          allowAllPropertiesOnSameLine: true,
        },
      ],
      "@stylistic/one-var-declaration-per-line": ["warn", "initializations"],
      "@stylistic/operator-linebreak": [
        "warn",
        "before",
        {
          overrides: {
            "=": "after",
          },
        },
      ],
      "@stylistic/padded-blocks": ["warn", "never"],
      "@stylistic/padding-line-between-statements": [
        "warn",
        {
          blankLine: "always",
          prev: "*",
          next: [
            "return",
            "interface",
            "type",
          ],
        },
      ],
      "@stylistic/quote-props": [
        "warn",
        "as-needed",
        {
          keywords: false,
          unnecessary: true,
          numbers: false,
        },
      ],
      "@stylistic/quotes": [
        "warn",
        "double",
        {
          avoidEscape: true,
          allowTemplateLiterals: "never",
        },
      ],
      "@stylistic/rest-spread-spacing": ["warn", "never"],
      "@stylistic/semi": [
        "warn",
        "always",
      ],
      "@stylistic/semi-spacing": [
        "warn",
        {
          before: false,
          after: true,
        },
      ],
      "@stylistic/semi-style": ["warn", "last"],
      "@stylistic/space-before-blocks": "warn",
      "@stylistic/space-before-function-paren": [
        "warn",
        {
          anonymous: "always",
          named: "never",
          asyncArrow: "always",
        },
      ],
      "@stylistic/space-in-parens": [
        "warn",
        "never",
      ],
      "@stylistic/space-infix-ops": "warn",
      "@stylistic/space-unary-ops": [
        "warn",
        {
          words: true,
          nonwords: false,
        },
      ],
      "@stylistic/spaced-comment": ["warn", "always"],
      "@stylistic/switch-colon-spacing": [
        "warn",
        {
          after: true,
          before: false,
        },
      ],
      "@stylistic/template-curly-spacing": ["warn", "never"],
      "@stylistic/type-annotation-spacing": "warn",
      "@stylistic/type-generic-spacing": "warn",
      "@stylistic/type-named-tuple-spacing": "warn",
      "@stylistic/wrap-iife": [
        "error",
        "inside",
        {
          functionPrototypeMethods: true,
        },
      ],
      "@stylistic/wrap-regex": "off",
      "@stylistic/yield-star-spacing": ["warn", "after"],
    },
  },
);
