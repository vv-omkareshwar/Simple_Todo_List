// Mock implementations
const mockTodoService = {
  addTask: jest.fn(),
  deleteTask: jest.fn(),
  deleteInnerTask: jest.fn(),
  toggleTaskCheck: jest.fn(),
  toggleInnerTaskCheck: jest.fn(),
  addInnerTask: jest.fn(),
  deleteAllTasks: jest.fn(),
  getAllTasks: jest.fn(),
  getAllInnerTasks: jest.fn(),
};

// Mock DOM elements
document.body.innerHTML = `
  <ul id="mainList">
    <li id="upperLi" class="d-none">
      <a href="#"></a>
      <button class="check"></button>
      <button class="delete-item"></button>
      <div class="collapse"></div>
    </li>
  </ul>
  <li id="innerLi">
    <span></span>
    <button class="inner-check"></button>
    <button class="delete-inner-item"></button>
  </li>
  <form id="addingForm">
    <input type="text" />
  </form>
  <button id="delAll"></button>
`;

// Import the code to be tested
const code = `
// Initialize TodoService
const todoService = mockTodoService;

// DOM Elements
const upperLi = document.getElementById("upperLi");
const innerLi = document.getElementById("innerLi");
const mainForm = document.getElementById("addingForm");
const mainInput = mainForm.children[0];
const mainList = document.getElementById("mainList");
const delAll = document.getElementById("delAll");

let count = 1; // for identical collapse id

// Event Listeners
function initEventListeners() {
    mainForm.addEventListener("submit", addNewItem);
    mainList.addEventListener("click", taskStuff);
    delAll.addEventListener("click", deleteAll);
}

// Create new task
function createNewTask(text, check) {
    const newLi = upperLi.cloneNode(true);
    newLi.classList.remove("d-none");
    newLi.removeAttribute("id");

    newLi.children[0].setAttribute("href", \`#collapse\${count}\`);
    newLi.children[0].classList.toggle("line-through", check);
    newLi.children[0].innerText = text;
    newLi.children[3].setAttribute("id", \`collapse\${count}\`);

    mainList.children[0].appendChild(newLi);

    count++;
    mainInput.value = "";
}

// Add New Task
async function addNewItem(e) {
    e.preventDefault();
    const taskText = mainInput.value.trim();

    if (taskText !== "") {
        try {
            await todoService.addTask(taskText);
            createNewTask(taskText, false);
        } catch (error) {
            alert(error.message);
        }
    }
}

// Add Inner Task
function addInnerTask(upperText, mainText, check) {
    let tempLi = innerLi.cloneNode(true);
    tempLi.removeAttribute("id");

    tempLi.childNodes.forEach((item, index) => {
        if (index === 3 || index === 5) {
            item.classList.remove("d-none");
        }
    });

    tempLi.children[0].innerText = mainText;
    tempLi.children[0].classList.toggle("line-through", check);

    const tempList = Array.from(mainList.children[0].children)
        .find(child => child.children[0].innerText === upperText);

    if (tempList) {
        tempList.lastElementChild.firstElementChild.firstElementChild.insertBefore(
            tempLi,
            tempList.lastElementChild.firstElementChild.firstElementChild.lastElementChild
        );
    }
}

// Task operations
async function taskStuff(e) {
    e.preventDefault();
    const target = e.target;

    if (target.classList.contains("delete-item")) {
        const text = target.parentElement.children[0].innerText;
        await todoService.deleteTask(text);
        target.parentElement.remove();
    } else if (target.classList.contains("delete-inner-item")) {
        const upperText = target.closest('.collapse').parentElement.children[0].innerText;
        const innerText = target.parentElement.children[0].innerText;
        await todoService.deleteInnerTask(upperText, innerText);
        target.parentElement.remove();
    } else if (target.classList.contains("check")) {
        const text = target.parentElement.children[0].innerText;
        const isChecked = target.parentElement.children[0].classList.toggle("line-through");
        await todoService.toggleTaskCheck(text, isChecked);
    } else if (target.classList.contains("inner-check")) {
        const upperText = target.closest('.collapse').parentElement.children[0].innerText;
        const innerText = target.parentElement.children[0].innerText;
        const isChecked = target.parentElement.children[0].classList.toggle("line-through");
        await todoService.toggleInnerTaskCheck(upperText, innerText, isChecked);
    } else if (target.classList.contains("btn-add-inner-task") || target.classList.contains("i-add-inner-task")) {
        const inputElement = target.closest('.input-group').querySelector('input');
        const text = inputElement.value.trim();
        const upperText = target.closest('.collapse').parentElement.children[0].innerText;

        if (text !== "") {
            try {
                await todoService.addInnerTask(upperText, text);
                addInnerTask(upperText, text, false);
                inputElement.value = "";
            } catch (error) {
                alert(error.message);
            }
        }
    }
}

// Delete all tasks
async function deleteAll(e) {
    e.preventDefault();
    const list = mainList.children[0].children;

    while (list.length > 1) {
        list[list.length - 1].remove();
    }

    await todoService.deleteAllTasks();
}

// Initialize the application
async function init() {
    initEventListeners();
    const tasks = await todoService.getAllTasks();
    tasks.forEach(task => createNewTask(task.text, task.check));

    const innerTasks = await todoService.getAllInnerTasks();
    innerTasks.forEach(task => addInnerTask(task.upperTaskText, task.mainText, task.check));
}

// Start the application
init();
`;

// Execute the code
eval(code);

// Test suite
describe('Todo App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = `
      <ul id="mainList">
        <li id="upperLi" class="d-none">
          <a href="#"></a>
          <button class="check"></button>
          <button class="delete-item"></button>
          <div class="collapse"></div>
        </li>
      </ul>
      <li id="innerLi">
        <span></span>
        <button class="inner-check"></button>
        <button class="delete-inner-item"></button>
      </li>
      <form id="addingForm">
        <input type="text" />
      </form>
      <button id="delAll"></button>
    `;
    eval(code);
  });

  test('addNewItem adds a new task', async () => {
    mainInput.value = 'New Task';
    await addNewItem({ preventDefault: jest.fn() });
    expect(mockTodoService.addTask).toHaveBeenCalledWith('New Task');
    expect(mainList.children[0].children.length).toBe(2);
  });

  test('deleteAll removes all tasks', async () => {
    createNewTask('Task 1', false);
    createNewTask('Task 2', false);
    await deleteAll({ preventDefault: jest.fn() });
    expect(mockTodoService.deleteAllTasks).toHaveBeenCalled();
    expect(mainList.children[0].children.length).toBe(1);
  });

  test('taskStuff handles various task operations', async () => {
    createNewTask('Main Task', false);
    addInnerTask('Main Task', 'Inner Task', false);

    const deleteItemEvent = { preventDefault: jest.fn(), target: document.querySelector('.delete-item') };
    await taskStuff(deleteItemEvent);
    expect(mockTodoService.deleteTask).toHaveBeenCalledWith('Main Task');

    const checkEvent = { preventDefault: jest.fn(), target: document.querySelector('.check') };
    await taskStuff(checkEvent);
    expect(mockTodoService.toggleTaskCheck).toHaveBeenCalled();

    const addInnerTaskEvent = {
      preventDefault: jest.fn(),
      target: { classList: { contains: () => true }, closest: () => ({ parentElement: { children: [{ innerText: 'Main Task' }] }, querySelector: () => ({ value: 'New Inner Task' }) }) }
    };
    await taskStuff(addInnerTaskEvent);
    expect(mockTodoService.addInnerTask).toHaveBeenCalledWith('Main Task', 'New Inner Task');
  });

  test('init initializes the application', async () => {
    mockTodoService.getAllTasks.mockResolvedValue([{ text: 'Task 1', check: false }, { text: 'Task 2', check: true }]);
    mockTodoService.getAllInnerTasks.mockResolvedValue([{ upperTaskText: 'Task 1', mainText: 'Inner Task', check: false }]);

    await init();

    expect(mainList.children[0].children.length).toBe(3);
    expect(document.querySelectorAll('.line-through').length).toBe(1);
    expect(document.querySelectorAll('#mainList li:not(.d-none)').length).toBe(2);
  });
});

// Run the tests
jest.run();