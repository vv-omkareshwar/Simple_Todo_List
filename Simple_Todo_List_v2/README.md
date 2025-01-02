# Simple Todo List v2

A simple, responsive todo list application built with vanilla JavaScript, HTML, and CSS. This application allows users to create, manage, and organize tasks with nested subtasks.

## Features

- Add and remove main tasks
- Add and remove subtasks (inner tasks) for each main task
- Toggle completion status for both main tasks and subtasks
- Responsive design for various screen sizes
- Local storage persistence for tasks

## Project Structure

```
.
├── README.md
├── Simple_Todo_List.json
├── package.json
├── src
│   ├── css
│   │   └── style.css
│   └── js
│       ├── app.js
│       └── todoService.js
└── tests
    ├── app.test.js
    └── todoService.test.js
```

## Dependencies

- Bootstrap v5.3.0
- Font Awesome v6.4.0
- jQuery v3.6.4

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/Simple_Todo_List_v2.git
   cd Simple_Todo_List_v2
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Open `index.html` in your browser to run the application.

## Usage

- To add a main task, type in the main input field and press Enter or click the "Add" button.
- To add a subtask, click on the "+" button next to a main task, enter the subtask text, and press Enter.
- To mark a task as complete, click the checkbox next to the task.
- To remove a task, click the "x" button next to the task.
- To remove all tasks, click the "Delete All" button at the bottom of the list.

## Development

The project uses vanilla JavaScript with ES6+ features. The main components are:

- `app.js`: Main application logic and DOM manipulation
- `todoService.js`: Service for managing todo items and local storage operations
- `style.css`: Custom styles for the application

To make changes:

1. Modify the relevant files in the `src` directory.
2. Test your changes by opening `index.html` in a browser.
3. Run tests using:
   ```
   npm test
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).