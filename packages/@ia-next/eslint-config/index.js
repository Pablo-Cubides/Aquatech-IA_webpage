module.exports = {
  extends: ["next/core-web-vitals", "@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    // Relaxed rules for development
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "react-hooks/exhaustive-deps": "warn",

    // Enforce consistent code style
    "prefer-const": "error",
    "no-var": "error",

    // Next.js specific
    "@next/next/no-html-link-for-pages": "error",
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
};
