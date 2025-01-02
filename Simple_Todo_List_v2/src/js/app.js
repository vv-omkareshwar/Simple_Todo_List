#!/bin/bash

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null
then
    echo "Node.js and npm are required but not installed. Please install them and try again."
    exit 1
fi

# Check if ESLint is installed, if not install it
if ! command -v eslint &> /dev/null
then
    echo "ESLint is not installed. Installing ESLint..."
    npm install eslint --save-dev
    npm install eslint-plugin-import --save-dev
    npx eslint --init
fi

# Run ESLint on the JavaScript files
echo "Running ESLint on JavaScript files..."
npx eslint src/js/*.js tests/*.js

# Check ESLint exit code
if [ $? -eq 0 ]; then
    echo "ESLint check passed successfully."
    exit 0
else
    echo "ESLint check failed. Please fix the issues and try again."
    exit 1
fi