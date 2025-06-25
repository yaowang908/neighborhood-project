import globals from "globals";
import js from "@eslint/js";
// import pluginImport from "eslint-plugin-import"; // We'll add this later if needed and check compatibility

export default [
  js.configs.recommended, // Start with ESLint's recommended rules
  {
    languageOptions: {
      ecmaVersion: 2015, // es6
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.jquery,
        // ...globals.jasmine, // Jasmine is for tests, might need a separate config block for test files
        // For now, let's assume src files don't use jasmine globals directly
        ko: "readonly", // Assuming knockout 'ko' is a global
        $: "readonly", // jQuery
        jQuery: "readonly", // jQuery
        H: "readonly" // HERE Maps global
      },
    },
    // plugins: { // Add import plugin later
    //   import: pluginImport,
    // },
    rules: {
      "no-trailing-spaces": "error",
      "indent": ["warn", 2],
      "unicode-bom": ["error", "never"],
      "no-warning-comments": "warn",
      "semi": "error",
      "no-extra-semi": "error",
      "no-new-wrappers": "error",
      "guard-for-in": "error",
      "no-multi-str": "error",
      "no-array-constructor": "error",
      "no-new-object": "error",
      "camelcase": "error",
      "brace-style": "error",
      "object-curly-spacing": ["error", "always"], // common practice, original was just "error"
      "array-bracket-spacing": ["error", "never"], // common practice, original was just "error"
      "quotes": ["error", "single"],
      "no-undef": "warn", // This is in recommended, but let's keep the severity

      // Rules from recommended that might conflict or are good to be aware of:
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // often useful
      "no-console": "off", // Original config didn't restrict console
    },
  },
  // Configuration for test files (if any are linted by this command)
  // {
  //   files: ["test/**/*.js", "spec/**/*.js"], // Adjust glob pattern as needed
  //   languageOptions: {
  //     globals: {
  //       ...globals.jasmine,
  //     }
  //   }
  // }
];
