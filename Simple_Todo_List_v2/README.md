# Simple Todo List v2

## Overview
Simple Todo List v2 is a web-based application that allows users to create, manage, and organize their tasks efficiently. This project is built using HTML, CSS, and JavaScript, with Bootstrap for responsive design and jQuery for DOM manipulation.

## Features
- Create and manage main tasks
- Add subtasks to main tasks
- Toggle task completion status
- Delete individual tasks or subtasks
- Delete all tasks at once
- Responsive design for both desktop and mobile devices
- Local storage for data persistence

## Project Structure
```
.
├── README.md
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
   git clone https://github.com/yourusername/simple-todo-list-v2.git
   cd simple-todo-list-v2
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Open `public/index.html` in your web browser to run the application.

## Development
- The main application logic is in `src/js/app.js`
- Task data management is handled by `src/js/todoService.js`
- Styling is defined in `src/css/style.css`
- The main HTML structure is in `public/index.html`

## Testing
Run the tests using Jest:
```
npm test
```

## Dependencies
- Bootstrap v5.3.0
- jQuery v3.6.4
- Font Awesome v6.4.0 (for icons)

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Author
[Your Name] - [Your GitHub Profile]

## Acknowledgments
- Hat tip to anyone whose code was used
- Inspiration
- etc.