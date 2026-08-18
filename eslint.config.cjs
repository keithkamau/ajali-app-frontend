const js = require("@eslint/js");
const reactPlugin = require("eslint-plugin-react");

module.exports = [
  { ignores: ["dist/**", "node_modules/**"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { window: "readonly", document: "readonly", navigator: "readonly", localStorage: "readonly", FormData: "readonly", test: "readonly", expect: "readonly" },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react: reactPlugin },
    settings: { react: { version: "detect" } },
    rules: { "react/react-in-jsx-scope": "off", "react/prop-types": "off", "react/jsx-uses-vars": "error", "no-unused-vars": ["error", { varsIgnorePattern: "^React$" }] },
  },
];