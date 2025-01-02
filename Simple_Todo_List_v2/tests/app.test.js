// Mock TodoService
class TodoService {
  constructor() {
    this.tasks = [];
    this.innerTasks = [];
  }

  async addTask(text) {
    if (this.tasks.some(task => task.text === text)) {
      throw new Error("Task Already Added");
    }
    const newTask = { text, check: false };
    this.tasks.push(newTask);
    return newTask;
  }

  async addInnerTask(upperText, text) {
    if (this.innerTasks.some(task => task.upperTaskText === upperText && task.mainText === text)) {
      throw new Error("Inner Task Already Added");
    }
    const newInnerTask = { upperTaskText: upperText, mainText: text, check: false };
    this.innerTasks.push(newInnerTask);
    return newInnerTask;
  }

  async deleteTask(text) {
    this.tasks = this.tasks.filter(task => task.text !== text);
    this.innerTasks = this.innerTasks.filter(task => task.upperTaskText !== text);
  }

  async deleteInnerTask(upperText, innerText) {
    this.innerTasks = this.innerTasks.filter(
      task => !(task.upperTaskText === upperText && task.mainText === innerText)
    );
  }

  async toggleTaskCheck(text, isChecked) {
    const task = this.tasks.find(task => task.text === text);
    if (task) {
      task.check = isChecked;
    }
  }

  async toggleInnerTaskCheck(upperText, innerText, isChecked) {
    const task = this.innerTasks.find(
      task => task.upperTaskText === upperText && task.mainText === innerText
    );
    if (task) {
      task.check = isChecked;
    }
  }

  async deleteAllTasks() {
    this.tasks = [];
    this.innerTasks = [];
  }

  async getAllTasks() {
    return this.tasks;
  }

  async getAllInnerTasks() {
    return this.innerTasks;
  }
}

// Mock DOM elements
const mockDOM = {
  getElementById: (id) => ({
    children: [{ appendChild: jest.fn() }],
    classList: {
      remove: jest.fn(),
      toggle: jest.fn(),
      contains: jest.fn()
    },
    setAttribute: jest.fn(),
    removeAttribute: jest.fn(),
    cloneNode: jest.fn(() => mockDOM.getElementById()),
    childNodes: [
      { classList: { remove: jest.fn() } },
      { classList: { remove: jest.fn() } },
      { classList: { remove: jest.fn() } },
      { classList: { remove: jest.fn() } },
      { classList: { remove: jest.fn() } },
      { classList: { remove: jest.fn() } }
    ],
    closest: jest.fn(() => ({ previousElementSibling: { innerText: 'Upper Task' } })),
    querySelector: jest.fn(() => ({ value: 'Inner Task' })),
    addEventListener: jest.fn(),
    remove: jest.fn()
  })
};

// Mock global objects
global.document = mockDOM;
global.alert = jest.fn();

// Implementation code
const todoService = new TodoService();

let count = 1;
const upperLi = document.getElementById("upperLi");
const innerLi = document.getElementById("innerLi");
const mainForm = document.getElementById("addingForm");
const mainInput = { value: '' };
const mainList = document.getElementById("mainList");
const delAll = document.getElementById("delAll");

function initEventListeners() {
  mainForm.addEventListener("submit", addNewItem);
  mainList.addEventListener("click", taskStuff);
  delAll.addEventListener("click", deleteAll);
}

function createNewTask(text, check) {
  const newLi = upperLi.cloneNode(true);
  newLi.classList.remove("d-none");
  newLi.removeAttribute("id");
  newLi.children[0].setAttribute("href", `#collapse${count}`);
  newLi.children[0].classList.toggle("line-through", check);
  newLi.children[0].innerText = text;
  newLi.children[3].setAttribute("id", `collapse${count}`);
  mainList.children[0].appendChild(newLi);
  count++;
  mainInput.value = "";
}

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
  let tempList = Array.from(mainList.children[0].children).find(
    (child) => child.children[0].innerText === upperText
  );
  if (tempList) {
    const innerTaskList = tempList.lastElementChild.firstElementChild.firstElementChild;
    innerTaskList.insertBefore(tempLi, innerTaskList.lastElementChild);
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
    const upperText = target.closest('.collapse').previousElementSibling.innerText;
    const innerText = target.parentElement.children[0].innerText;
    await todoService.deleteInnerTask(upperText, innerText);
    target.parentElement.remove();
  } else if (target.classList.contains("check")) {
    const text = target.parentElement.children[0].innerText;
    const isChecked = target.parentElement.children[0].classList.toggle("line-through");
    await todoService.toggleTaskCheck(text, isChecked);
  } else if (target.classList.contains("inner-check")) {
    const upperText = target.closest('.collapse').previousElementSibling.innerText;
    const innerText = target.parentElement.children[0].innerText;
    const isChecked = target.parentElement.children[0].classList.toggle("line-through");
    await todoService.toggleInnerTaskCheck(upperText, innerText, isChecked);
  } else if (target.classList.contains("btn-add-inner-task") || target.classList.contains("i-add-inner-task")) {
    const inputElement = target.closest('.input-group').querySelector('input');
    const text = inputElement.value.trim();
    const upperText = target.closest('.collapse').previousElementSibling.innerText;
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

async function deleteAll(e) {
  e.preventDefault();
  const list = mainList.children[0];
  while (list.children.length > 1) {
    list.removeChild(list.lastChild);
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
describe('Todo App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    todoService.deleteAllTasks();
    count = 1;
  });

  test('addNewItem adds a new task', async () => {
    mainInput.value = 'New Task';
    await addNewItem({ preventDefault: jest.fn() });
    const tasks = await todoService.getAllTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].text).toBe('New Task');
  });

  test('addNewItem does not add duplicate task', async () => {
    mainInput.value = 'New Task';
    await addNewItem({ preventDefault: jest.fn() });
    await addNewItem({ preventDefault: jest.fn() });
    const tasks = await todoService.getAllTasks();
    expect(tasks).toHaveLength(1);
    expect(alert).toHaveBeenCalledWith('Task Already Added');
  });

  test('deleteAll removes all tasks', async () => {
    await todoService.addTask('Task 1');
    await todoService.addTask('Task 2');
    await deleteAll({ preventDefault: jest.fn() });
    const tasks = await todoService.getAllTasks();
    expect(tasks).toHaveLength(0);
  });

  test('taskStuff handles various task operations', async () => {
    await todoService.addTask('Main Task');
    await todoService.addInnerTask('Main Task', 'Inner Task');

    const mockEvent = {
      preventDefault: jest.fn(),
      target: {
        classList: {
          contains: jest.fn(),
          toggle: jest.fn(() => true)
        },
        parentElement: {
          children: [{ innerText: 'Main Task' }],
          remove: jest.fn()
        },
        closest: jest.fn(() => ({ previousElementSibling: { innerText: 'Main Task' } }))
      }
    };

    // Test delete main task
    mockEvent.target.classList.contains.mockReturnValueOnce(true);
    await taskStuff(mockEvent);
    expect(await todoService.getAllTasks()).toHaveLength(0);

    // Test delete inner task
    await todoService.addTask('Main Task');
    await todoService.addInnerTask('Main Task', 'Inner Task');
    mockEvent.target.classList.contains
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    await taskStuff(mockEvent);
    expect(await todoService.getAllInnerTasks()).toHaveLength(0);

    // Test toggle main task check
    await todoService.addTask('Main Task');
    mockEvent.target.classList.contains
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    await taskStuff(mockEvent);
    expect((await todoService.getAllTasks())[0].check).toBe(true);

    // Test toggle inner task check
    await todoService.addInnerTask('Main Task', 'Inner Task');
    mockEvent.target.classList.contains
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    mockEvent.target.parentElement.children[0].innerText = 'Inner Task';
    await taskStuff(mockEvent);
    expect((await todoService.getAllInnerTasks())[0].check).toBe(true);

    // Test add inner task
    mockEvent.target.classList.contains
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    await taskStuff(mockEvent);
    expect(await todoService.getAllInnerTasks()).toHaveLength(2);
  });

  test('init loads all tasks', async () => {
    await todoService.addTask('Main Task 1');
    await todoService.addTask('Main Task 2');
    await todoService.addInnerTask('Main Task 1', 'Inner Task 1');
    await todoService.addInnerTask('Main Task 2', 'Inner Task 2');
    await init();
    expect(mainList.children[0].appendChild).toHaveBeenCalledTimes(2);
    expect(upperLi.cloneNode).toHaveBeenCalledTimes(2);
    expect(innerLi.cloneNode).toHaveBeenCalledTimes(2);
  });
});

// Run the tests
describe('Todo App', () => {
  // ... (previous test cases remain the same)
});