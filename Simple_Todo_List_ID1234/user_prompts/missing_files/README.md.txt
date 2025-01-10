
You are tasked with a code generation and conversion task. Below are the details and instructions to ensure the process aligns with the specified requirements:

### Details:

- **Target Language**: ['javascript'] (e.g., TypeScript)  
- **Technology Stack**: `['Markdown']` (e.g., React, TypeScript)  
- **Target File Path**: `Simple_Todo_List_ID1234/README.md`  
- **Code Type**: `documentation`

### Generated Directory Structure:
```

```

### File Summaries:
```
Summary for File (Simple_Todo_List_ID1234/src/css/style.css): This CSS file defines the styles for the Simple Todo List application. It sets the base font size, creates a gradient background for the body, and styles various elements such as cards, buttons, and list items. The file includes responsive design with media queries for different screen sizes. Key features include:

1. Gradient background using linear-gradient
2. Styling for cards, form controls, and buttons
3. Custom styles for list items and under-list items
4. Responsive design adjustments for smaller screens
5. Footer positioning and styling

The file uses CSS3 features like gradients, calc() function, and media queries to create a modern and responsive design for the todo list application.
Dependencies: {
  "dependencies": {},
  "Libraries": [],
  "Scripts": [],
  "Others": []
}
Summary for File (Simple_Todo_List_ID1234/src/js/todoService.js): This file defines a TodoService class that manages todo tasks and their inner tasks. It handles creating, adding, toggling, and deleting tasks, as well as managing local storage for persistence. The class includes methods for manipulating both main tasks and inner tasks, with functions to create HTML elements for rendering. Key features include task creation, checking/unchecking tasks, deleting tasks, and managing inner tasks. The service uses local storage to save and load tasks, ensuring data persistence across page reloads.
Dependencies: {
    "dependencies": {
        "none": "This file doesn't require any external dependencies."
    }
}
Summary for File (Simple_Todo_List_ID1234/public/index.html): This HTML file represents the structure of a To-Do List application. It includes meta tags for SEO, links to Bootstrap and Font Awesome for styling, and custom CSS. The main content is divided into two sections: a form to add new tasks and a list to display existing tasks. The list supports nested subtasks with collapsible sections. The file also includes scripts for app logic and Bootstrap functionality. Key features include responsive design, local storage integration, and dynamic task management.
Dependencies: {
  "dependencies": {
    "bootstrap": "^5.3.0",
    "font-awesome": "^6.4.0"
  }
}
Summary for File (Simple_Todo_List_ID1234/src/js/app.js): This file (app.js) implements the main functionality of a Todo List application using JavaScript. It imports the TodoService from 'todoService.js' for data management. The TodoApp class encapsulates all the application logic, including event listeners, task creation, deletion, and status toggling for both main and inner tasks. It uses DOM manipulation to update the UI and interacts with the TodoService for data persistence. The file includes methods for adding new tasks, handling task interactions (check, delete), and managing inner tasks. It also implements a feature to delete all tasks at once. The code follows modern JavaScript practices, using ES6+ features like classes and arrow functions.
Dependencies: {
    "dependencies": {
        "todoService.js": "^1.0.0"
    }
}
Summary for File (Simple_Todo_List_ID1234/Simple_Todo_List.json): This JSON file represents the structure of a Simple Todo List project. It defines the directory structure, file contents, and project metadata. The project includes an HTML file for the user interface, JavaScript files for application logic and services, CSS for styling, test files, a package.json for dependency management, and a README.md for project documentation. The file also specifies the Git repository URL and branch. The structure follows a typical web application layout with separate directories for public assets, source code, and tests.
Dependencies: {
  "dependencies": {
    "bootstrap": "^5.3.0",
    "@fortawesome/fontawesome-free": "^6.4.0"
  },
  "devDependencies": {
    "jest": "^29.5.0"
  }
}
```

---

### Role:
You are a **Senior Software Engineer** with 7+ years of experience. Your role is to generate missing files or convert existing ones into the **target language** while ensuring:
    1. Adherence to **organizational coding standards**.
    2. Compatibility with the provided **directory structure** and dependencies.
    3. Alignment with **technology stack best practices**.

---

### Instructions:

#### 1. Analyze the File or Generate Missing File Content:
    - **For empty or missing files**:
        - Use the provided **file summaries**, **directory structure**, and **technology stack** to infer the required logic and generate the file content.
        - Ensure the generated content aligns with the project's overall architecture and dependencies.
        - **For existing files with content**:
        - Examine the code in `Simple_Todo_List_ID1234/README.md` and its summary to understand its logic and structure.

#### 2. Ensure Directory Structure Alignment:
    - Align the generated or converted file with the above mentioned directory structure.
    - Update file paths, imports/exports, and dependencies as necessary to maintain logical consistency within the project.

#### 3. Swagger Documentation (if applicable):
    - **For backend API files**:
    - Integrate Swagger documentation, specifying endpoints, data contracts, and responses.

#### 4. Adhere to Coding Standards:
    - Follow the guidelines in `<Coding_Standards>` for the target language (e.g., TypeScript) to produce clean, maintainable, and standard-compliant code.

#### 5. Documentation Generation Rules :
    - If `code_type` is `documentation` ensure that you provide detailed on step on how to setup and start the project in files like `README.md`.
    
#### 6. Output Requirements:
    - Provide the generated file content using the following format:

```converted
<generated_code>
```

```dependencies
{
    "dependencies": [OPTIONAL],
    "Libraries": [OPTIONAL],
    "Scripts": [OPTIONAL],
    "Others": [OPTIONAL]
}
```

#### 6. Documentation:
    - Include inline comments to explain major logic decisions or assumptions.
    - List any new libraries, modules, or dependencies introduced during the file generation.

#### 7. Validation:
    - Ensure the generated code is:
    - Fully functional.
    - Aligned with best practices.
    - Compatible with the given technology stack and directory structure.

#### 8. Glossary & References:
- Refer to the provided Glossary for any unclear terms or specifications.

---

### Notes for Missing Files:

When generating missing files, ensure:
    1. **Use of Target Language**:
        - Implement in ['javascript']
    
    2. **Technology Stack Integration**:
        - Utilize libraries, patterns, and conventions from `['Markdown']`.
    
    3. **Functional Assumptions**:
        - Base the logic on file summaries, if available.
        - Use placeholders or standard patterns for undefined logic.
    
    4. **Testing and Validation**:
        - Ensure the generated code can integrate seamlessly into the existing codebase.

---

### Output Format:
1. **Converted or Generated Code**:
    - Present the code in a dedicated block using the following format:
    ```
    ```converted
    <converted_code>
    ```
    ```
2. **Dependencies**:
    - Include a structured list of dependencies, libraries, scripts, or other elements:
    ```
    ```dependencies
    {
        "dependencies": [OPTIONAL],
        "Libraries": [OPTIONAL],
        "Scripts": [OPTIONAL],
        "Others": [OPTIONAL]
    }
    ```
    ```
3. **Documentation**:
    - Provide inline comments where appropriate.
    - Document significant changes or assumptions clearly.
