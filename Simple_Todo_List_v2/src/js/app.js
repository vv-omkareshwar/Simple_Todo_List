#!/usr/bin/env node

const { ESLint } = require("eslint");
const path = require("path");

async function lintFiles() {
  const eslint = new ESLint({
    useEslintrc: false,
    overrideConfig: {
      env: {
        browser: true,
        es2021: true,
        node: true
      },
      extends: [
        "eslint:recommended"
      ],
      parserOptions: {
        ecmaVersion: 12,
        sourceType: "module"
      },
      rules: {
        // Add any specific rules you want to enforce
      }
    }
  });

  const results = await eslint.lintFiles(["src/**/*.js"]);

  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  console.log(resultText);

  // Return a non-zero exit code if there are any errors
  process.exit(results.some(result => result.errorCount > 0) ? 1 : 0);
}

lintFiles().catch((error) => {
  console.error("Error running ESLint:", error);
  process.exit(1);
});