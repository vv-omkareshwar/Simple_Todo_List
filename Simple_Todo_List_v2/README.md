# Simple Todo List v2

A feature-rich, responsive todo list application built with vanilla JavaScript, HTML, and CSS.

## Features

- Create, read, update, and delete tasks
- Add subtasks to main tasks
- Mark tasks as complete/incomplete
- Delete all tasks at once
- Responsive design for mobile and desktop
- Local storage persistence

## Directory Structure

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

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/simple-todo-list-v2.git
   cd simple-todo-list-v2
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Open `public/index.html` in your browser to run the application.

## Development

- The main application logic is in `src/js/app.js`
- Todo service functionality is in `src/js/todoService.js`
- Styles are defined in `src/css/style.css`
- The HTML structure is in `public/index.html`

## Testing

Run the tests using Jest:

```
npm test
```

## Dependencies

- Bootstrap v5.3.0 (CSS framework)
- Font Awesome v6.4.0 (Icons)
- jQuery v3.6.4 (JavaScript library)

## Dev Dependencies

- Jest v29.5.0 (Testing framework)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc.