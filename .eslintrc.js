module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  plugins: ["office-addins"],
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:office-addins/recommended",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
    "no-unused-vars": "off",
  },
}
