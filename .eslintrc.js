module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended"], // use recommended rules and prettier
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-console": "off", // allows console.log statements
    semi: ["error", "always"], // require semi-colons
    quotes: ["error", "double"], // enforce double quotes for strings
  },
};
