module.exports = {
  extends: ["eslint-config-alloy", "plugin:vue/recommended"],
  rules: {
    indent: ["error", 2],
    radix: ["error", "as-needed"],
    "vue/max-attributes-per-line": ["error", {
      singleline: 3,
      multiline: {
        max: 1,
        allowFirstLine: false
      }
    }],
    "vue/html-closing-bracket-newline": ["error", {
      singleline: "never",
      multiline: "always"
    }],
    "vue/attribute-hyphenation": ["error", "never"]
  }
};
