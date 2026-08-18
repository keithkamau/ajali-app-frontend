module.exports = {
  env: { browser: true, es2022: true, jest: true },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } },
  settings: { react: { version: "detect" } },
  rules: { "react/react-in-jsx-scope": "off", "react/prop-types": "off" },
};