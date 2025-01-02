# Simple Todo List v2

A feature-rich todo list application built with JavaScript, HTML, and CSS. This application allows users to create, manage, and organize tasks with nested subtasks.

## Features

- Create and manage main tasks
- Add nested subtasks to main tasks
- Toggle task completion status
- Delete individual tasks or clear all tasks
- Responsive design for various screen sizes
- Local storage for data persistence

## Project Structure

```
.
├── README.md
├── Simple_Todo_List.json
├── package.json
├── public
│   └── index.html
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

3. Open `public/index.html` in your web browser to run the application.

## Development

- The main application logic is in `src/js/app.js`
- Todo list functionality is managed by `src/js/todoService.js`
- Styling is defined in `src/css/style.css`
- The HTML structure is in `public/index.html`

## Testing

Run the tests using Jest:

```
npm test
```

## Dependencies

- Bootstrap v5.3.0
- Font Awesome v6.4.0
- jQuery v3.6.4

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.