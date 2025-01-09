# Simple Todo List Application

This project is a simple Todo List application that allows users to create, manage, and organize tasks with nested subtasks.

## Features

- Add main tasks and subtasks
- Mark tasks as complete
- Delete tasks
- Expand/collapse task details
- Responsive design
- Local storage persistence

## Prerequisites

Before you begin, ensure you have the following installed:
- A modern web browser
- A local web server (optional, for development)

## Getting Started

1. Clone the repository or download the project files:
   ```
   git clone https://github.com/yourusername/simple-todo-list.git
   cd simple-todo-list
   ```

2. Open the `public/index.html` file in your web browser.

   If you're using a local web server, start it in the project root directory and navigate to the appropriate URL (usually `http://localhost:8080` or similar).

## Project Structure

```
simple-todo-list/
│
├── public/
│   └── index.html
│
└── src/
    ├── css/
    │   └── styles.css
    └── js/
        └── app.js
```

- `public/index.html`: The main HTML file that structures the application.
- `src/css/styles.css`: Contains all the styles for the application.
- `src/js/app.js`: The main JavaScript file that handles the application logic.

## Usage

1. To add a new task, type the task description in the input field at the top of the page and click the "Add Task" button or press Enter.

2. To add a subtask to an existing task:
   - Click the "+" button next to the main task.
   - Enter the subtask description in the new input field.
   - Click "Add Subtask" or press Enter.

3. To mark a task as complete, click the checkbox next to the task.

4. To delete a task, click the trash can icon next to the task.

5. To expand or collapse a task's details (including subtasks), click the task's title.

## Development

If you want to modify the application:

1. Edit the HTML structure in `public/index.html`.
2. Modify the styles in `src/css/styles.css`.
3. Update the application logic in `src/js/app.js`.

After making changes, refresh the page in your web browser to see the updates.

## Dependencies

This project uses the following external libraries:

- Bootstrap 5.3.0
- Font Awesome 6.4.0
- jQuery 3.6.4
- Popper.js 2.11.7

All dependencies are loaded via CDN in the `index.html` file, so no additional installation is required.

## Browser Compatibility

This application is designed to work in modern web browsers. It has been tested in:

- Google Chrome (latest version)
- Mozilla Firefox (latest version)
- Microsoft Edge (latest version)
- Safari (latest version)

## Contributing

Contributions to improve the application are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

If you have any questions or suggestions, please open an issue in the GitHub repository.

Happy task managing!