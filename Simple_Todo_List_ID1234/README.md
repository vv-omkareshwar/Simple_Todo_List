# Simple Todo List

This project is a simple, yet powerful Todo List application built with HTML, CSS, and JavaScript. It allows users to create, manage, and organize their tasks efficiently.

## Features

- Add main tasks and subtasks
- Mark tasks as complete or incomplete
- Delete individual tasks or all tasks at once
- Collapsible subtasks
- Responsive design for various screen sizes
- Local storage for data persistence

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (version 12.0 or higher)
- npm (usually comes with Node.js)

## Getting Started

Follow these steps to set up and run the project on your local machine:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/simple-todo-list.git
   cd simple-todo-list
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Project Structure

```
simple-todo-list/
├── public/
│   └── index.html
├── src/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js
│       └── todoService.js
├── tests/
│   └── app.test.js
├── package.json
└── README.md
```

## Usage

1. To add a new task, type in the input field at the top and press Enter or click the "Add" button.
2. To add a subtask, click on the "+" button next to a main task and enter the subtask details.
3. To mark a task as complete, click the checkbox next to the task.
4. To delete a task, click the trash icon next to the task.
5. To delete all tasks, click the "Delete All" button at the bottom of the list.

## Testing

To run the tests for this project:

```
npm test
```

## Built With

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5.3.0
- Font Awesome 6.4.0

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.