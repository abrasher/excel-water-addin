/**
 * Documentation for eslint office
 * https://github.com/OfficeDev/Office-Addin-Scripts/tree/master/packages/eslint-plugin-office-addins
 */

module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  plugins: ["office-addins"],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    parser: require.resolve("@typescript-eslint/parser"),
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
    extraFileExtensions: [".vue"],
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/strict",
    "plugin:office-addins/recommended",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
    "no-unused-vars": "off",
    "no-undef": "off", // disable this as eslint can't see tsconfig types option
    "@typescript-eslint/consistent-type-definitions": ["error", "type"], // prefer types over interfaces
  },
}
