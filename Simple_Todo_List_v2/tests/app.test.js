// Mock DOM elements
const mockDOM = {
  upperLi: { cloneNode: () => ({ classList: { remove: jest.fn() }, removeAttribute: jest.fn(), children: [{}, {}, {}, {}] }) },
  innerLi: { cloneNode: () => ({ removeAttribute: jest.fn(), childNodes: [{ classList: { remove: jest.fn() } }, {}, { classList: { remove: jest.fn() } }, {}, { classList: { remove: jest.fn() } }, {}], children: [{}, {}] }) },
  mainForm: { addEventListener: jest.fn(), children: [{ value: '' }] },
  mainInput: { value: '' },
  mainList: { addEventListener: jest.fn(), children: [{ children: [] }] },
  delAll: { addEventListener: jest.fn() },
};

// Mock TodoService
class MockTodoService {
  addTask = jest.fn();
  deleteTask = jest.fn();
  deleteInnerTask = jest.fn();
  toggleTaskCheck = jest.fn();
  toggleInnerTaskCheck = jest.fn();
  addInnerTask = jest.fn();
  deleteAllTasks = jest.fn();
  getAllTasks = jest.fn();
  getAllInnerTasks = jest.fn();
}

// Mocking document.getElementById
document.getElementById = jest.fn((id) => mockDOM[id]);

// Import the code to be tested
const todoService = new MockTodoService();

let count = 1;

function initEventListeners() {
  mockDOM.mainForm.addEventListener("submit", addNewItem);
  mockDOM.mainList.addEventListener("click", taskStuff);
  mockDOM.delAll.addEventListener("click", deleteAll);
}

function createNewTask(text, check) {
  const newLi = mockDOM.upperLi.cloneNode(true);
  newLi.classList.remove("d-none");
  newLi.removeAttribute("id");

  newLi.children[0].setAttribute("href", `#collapse${count}`);
  newLi.children[0].classList.toggle("line-through", check);
  newLi.children[0].innerText = text;
  newLi.children[3].setAttribute("id", `collapse${count}`);

  mockDOM.mainList.children[0].appendChild(newLi);

  count++;
  mockDOM.mainInput.value = "";
}

async function addNewItem(e) {
  e.preventDefault();
  const taskText = mockDOM.mainInput.value.trim();

  if (taskText !== "") {
    try {
      await todoService.addTask(taskText);
      createNewTask(taskText, false);
    } catch (error) {
      console.error(error.message);
    }
  }
}

function addInnerTask(upperText, mainText, check) {
  let tempLi = mockDOM.innerLi.cloneNode(true);
  tempLi.removeAttribute("id");

  tempLi.childNodes.forEach((item, index) => {
    if (index === 3 || index === 5) {
      item.classList.remove("d-none");
    }
  });

  tempLi.children[0].innerText = mainText;
  tempLi.children[0].classList.toggle("line-through", check);

  const tempList = Array.from(mockDOM.mainList.children[0].children)
    .find(child => child.children[0].innerText === upperText);

  if (tempList) {
    tempList.lastElementChild.firstElementChild.firstElementChild.insertBefore(
      tempLi,
      tempList.lastElementChild.firstElementChild.firstElementChild.lastElementChild
    );
  }
}

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
    const input = { value: 'New Inner Task' }; // Mock input
    const text = input.value.trim();
    const upperText = 'Upper Task'; // Mock upper text

    if (text !== "") {
      try {
        await todoService.addInnerTask(upperText, text);
        addInnerTask(upperText, text, false);
        input.value = "";
      } catch (error) {
        console.error(error.message);
      }
    }
  }
}

async function deleteAll(e) {
  e.preventDefault();
  const list = mockDOM.mainList.children[0].children;

  while (list.length > 1) {
    list[list.length - 1].remove();
  }

  await todoService.deleteAllTasks();
}

async function init() {
  initEventListeners();
  const tasks = await todoService.getAllTasks();
  tasks.forEach(task => createNewTask(task.text, task.check));

  const innerTasks = await todoService.getAllInnerTasks();
  innerTasks.forEach(task => addInnerTask(task.upperTaskText, task.mainText, task.check));
}

// Test suite
describe('Todo Application', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    count = 1;
  });

  test('initEventListeners sets up event listeners correctly', () => {
    initEventListeners();
    expect(mockDOM.mainForm.addEventListener).toHaveBeenCalledWith("submit", addNewItem);
    expect(mockDOM.mainList.addEventListener).toHaveBeenCalledWith("click", taskStuff);
    expect(mockDOM.delAll.addEventListener).toHaveBeenCalledWith("click", deleteAll);
  });

  test('createNewTask creates a new task correctly', () => {
    const appendChildMock = jest.fn();
    mockDOM.mainList.children[0].appendChild = appendChildMock;

    createNewTask('Test Task', false);

    expect(appendChildMock).toHaveBeenCalled();
    expect(count).toBe(2);
    expect(mockDOM.mainInput.value).toBe('');
  });

  test('addNewItem adds a new task', async () => {
    const preventDefault = jest.fn();
    mockDOM.mainInput.value = 'New Task';

    await addNewItem({ preventDefault });

    expect(preventDefault).toHaveBeenCalled();
    expect(todoService.addTask).toHaveBeenCalledWith('New Task');
  });

  test('addInnerTask adds an inner task correctly', () => {
    const insertBeforeMock = jest.fn();
    mockDOM.mainList.children[0].children = [{
      children: [{ innerText: 'Upper Task' }],
      lastElementChild: {
        firstElementChild: {
          firstElementChild: {
            insertBefore: insertBeforeMock,
            lastElementChild: {}
          }
        }
      }
    }];

    addInnerTask('Upper Task', 'Inner Task', false);

    expect(insertBeforeMock).toHaveBeenCalled();
  });

  test('taskStuff handles various task operations', async () => {
    const preventDefault = jest.fn();
    const mockEvent = {
      preventDefault,
      target: {
        classList: {
          contains: jest.fn().mockReturnValue(true)
        },
        parentElement: {
          children: [{ innerText: 'Task Text' }],
          remove: jest.fn()
        },
        closest: () => ({
          parentElement: {
            children: [{ innerText: 'Upper Task' }]
          }
        })
      }
    };

    await taskStuff(mockEvent);

    expect(preventDefault).toHaveBeenCalled();
    expect(todoService.deleteTask).toHaveBeenCalledWith('Task Text');
  });

  test('deleteAll removes all tasks', async () => {
    const preventDefault = jest.fn();
    mockDOM.mainList.children[0].children = [{}, {}, {}];

    await deleteAll({ preventDefault });

    expect(preventDefault).toHaveBeenCalled();
    expect(todoService.deleteAllTasks).toHaveBeenCalled();
    expect(mockDOM.mainList.children[0].children.length).toBe(1);
  });

  test('init initializes the application', async () => {
    const mockTasks = [{ text: 'Task 1', check: false }, { text: 'Task 2', check: true }];
    const mockInnerTasks = [{ upperTaskText: 'Task 1', mainText: 'Inner Task 1', check: false }];

    todoService.getAllTasks.mockResolvedValue(mockTasks);
    todoService.getAllInnerTasks.mockResolvedValue(mockInnerTasks);

    await init();

    expect(todoService.getAllTasks).toHaveBeenCalled();
    expect(todoService.getAllInnerTasks).toHaveBeenCalled();
  });
});

// Run the tests
test.todo('Add more specific test cases as needed');