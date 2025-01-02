#!/bin/bash

# Update package list
sudo apt-get update -y

# Install Python if not already installed
sudo apt-get install -y python3

# Set the file name and path
FILE_NAME="error_check_window_impl_18eb2693-9e7d-42eb-85e3-32d0bc6de748.py"
FILE_PATH=${FILE_PATH:-"."}  # Use current directory if FILE_PATH is not set

FULL_PATH="$FILE_PATH/$FILE_NAME"

# Check if the file exists
if [ ! -f "$FULL_PATH" ]; then
    echo "Error: File not found at $FULL_PATH"
    exit 1
fi

# Perform syntax check
echo "Performing syntax check on $FULL_PATH"
python3 -m py_compile "$FULL_PATH"

if [ $? -eq 0 ]; then
    echo "Syntax check passed successfully."
else
    echo "Syntax check failed. Please review the errors above."
    exit 1
fi

# Check for undeclared variables and functions
echo "Checking for undeclared variables and functions..."
python3 << END
import ast
import symtable

def check_undeclared(filename):
    with open(filename, 'r') as file:
        code = file.read()
    
    tree = ast.parse(code)
    st = symtable.symtable(code, filename, 'exec')
    
    undeclared = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Load):
            name = node.id
            if name not in st.lookup(name).get_namespaces():
                undeclared.add(name)
    
    if undeclared:
        print("Potentially undeclared variables or functions:")
        for name in sorted(undeclared):
            print(f"  - {name}")
    else:
        print("No potentially undeclared variables or functions found.")

check_undeclared('$FULL_PATH')
END

echo "Syntax and declaration check completed."