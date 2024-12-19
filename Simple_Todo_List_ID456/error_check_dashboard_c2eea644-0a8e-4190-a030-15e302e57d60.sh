#!/bin/bash

# Update package lists
sudo apt update

# Install Node.js and npm
sudo apt install -y nodejs npm

# Install TypeScript globally
sudo npm install -g typescript

# Set the file path and name
FILE_PATH="/opt/15/error_check_dashboard_4e4340d9-2d1a-4f5d-9eff-d1e9bdc79488.ts"

# Check if the file exists
if [ ! -f "$FILE_PATH" ]; then
    echo "Error: File not found at $FILE_PATH"
    exit 1
fi

# Perform syntax check and find undeclared variables/functions
echo "Performing syntax check and looking for undeclared variables/functions..."
tsc --noEmit --strict "$FILE_PATH"

# Check the exit status of tsc
if [ $? -eq 0 ]; then
    echo "No syntax errors or undeclared variables/functions found."
else
    echo "Errors detected. Please review the messages above."
fi