// Mock DOM elements
const mockDocument = {
  getElementById: (id) => ({
    addEventListener: jest.fn(),
    appendChild: jest.fn(),
    children: [],
    classList: {
      remove: jest.fn(),
      add: jest.fn(),
      toggle: jest.fn(),
    },
    setAttribute: jest.fn(),
    cloneNode: () => ({
      classList: { remove: jest.fn() },
      children: [
        { setAttribute: jest.fn(), classList: { remove: jest.fn() }, innerText: '' },
        {},
        {},
        { setAttribute: jest.fn() },
      ],
    }),
  }),
  addEventListener: jest.fn(),
};

global.document = mockDocument;
global.alert = jest.fn();

// Mock TodoService
class TodoService {
  constructor() {
    this.tasks = [];
    this.innerTasks = [];
  }

  addTask(text) {
    this.tasks.push({ text, check: false });
  }

  removeTask(text) {
    this.tasks = this.tasks.filter(task => task.text !== text);
  }

  taskExists(text) {
    return this.tasks.some(task => task.text === text);
  }

  updateTaskCheck(text, isChecked) {
    const task = this.tasks.find(task => task.text === text);
    if (task) {
      task.check = isChecked;
    }
  }

  addInnerTask(upperText, text) {
    this.innerTasks.push({ upperTaskText: upperText, mainText: text, check: false });
  }

  removeInnerTask(upperText, innerText) {
    this.innerTasks = this.innerTasks.filter(
      task => !(task.upperTaskText === upperText && task.mainText === innerText)
    );
  }

  innerTaskExists(upperText, text) {
    return this.innerTasks.some(
      task => task.upperTaskText === upperText && task.mainText === text
    );
  }

  updateInnerTaskCheck(upperText, innerText, isChecked) {
    const task = this.innerTasks.find(
      task => task.upperTaskText === upperText && task.mainText === innerText
    );
    if (task) {
      task.check = isChecked;
    }
  }

  removeInnerTasksByUpperTask(upperText) {
    this.innerTasks = this.innerTasks.filter(task => task.upperTaskText !== upperText);
  }

  clearAllTasks() {
    this.tasks = [];
    this.innerTasks = [];
  }

  getAllTasks() {
    return this.tasks;
  }

  getAllInnerTasks() {
    return this.innerTasks;
  }
}

// TodoApp implementation
class TodoApp {
  constructor() {
    this.todoService = new TodoService();
    this.count = 1;
    this.upperLi = document.getElementById("upperLi");
    this.innerLi = document.getElementById("innerLi");
    this.mainForm = document.getElementById("addingForm");
    this.mainInput = { value: '' };
    this.mainList = document.getElementById("mainList");
    this.delAll = document.getElementById("delAll");

    this.init();
  }

  init() {
    this.eventListeners();
    this.loadTasks();
  }

  eventListeners() {
    this.mainForm.addEventListener("submit", this.addNewItem.bind(this));
    this.mainList.addEventListener("click", this.taskStuffs.bind(this));
    this.delAll.addEventListener("click", this.deleteAll.bind(this));
  }

  createNewTask(text, check) {
    const newLi = this.upperLi.cloneNode(true);
    newLi.classList.remove("d-none");
    newLi.setAttribute("id", "");
    newLi.children[0].setAttribute("href", `#collapse${this.count}`);
    newLi.children[0].classList.remove("line-through");
    newLi.children[0].innerText = text;
    
    if (check) {
      newLi.children[0].classList.add("line-through");
    }
    
    newLi.children[3].setAttribute("id", `collapse${this.count}`);
    this.mainList.children[0].appendChild(newLi);
    this.count++;
    this.mainInput.value = "";
  }

  addNewItem(e) {
    e.preventDefault();
    const taskText = this.mainInput.value.trim();
    if (taskText !== "") {
      if (!this.todoService.taskExists(taskText)) {
        this.createNewTask(taskText);
        this.todoService.addTask(taskText);
      } else {
        alert("Task Already Added");
      }
    }
  }

  addInnerTask(upperText, mainText, check) {
    let tempLi = this.innerLi.cloneNode(true);
    tempLi.setAttribute("id", "");
    tempLi.childNodes.forEach((item, index) => {
      if (index === 3 || index === 5) {
        item.classList.remove("d-none");
      }
    });
    tempLi.children[0].innerText = mainText;
    
    if (check) {
      tempLi.children[0].classList.add("line-through");
    }

    let tempList = Array.from(this.mainList.children[0].children)
      .find(child => child.children[0].innerText === upperText);

    if (tempList) {
      tempList.lastElementChild.firstElementChild.firstElementChild.insertBefore(
        tempLi,
        tempList.lastElementChild.firstElementChild.firstElementChild.lastElementChild
      );
    }
  }

  taskStuffs(e) {
    e.preventDefault();
    const target = e.target;

    if (target.classList.contains("delete-item")) {
      this.deleteTask(target);
    } else if (target.classList.contains("delete-inner-item")) {
      this.deleteInnerTask(target);
    } else if (target.classList.contains("check")) {
      this.toggleTaskCheck(target);
    } else if (target.classList.contains("inner-check")) {
      this.toggleInnerTaskCheck(target);
    } else if (target.classList.contains("btn-add-inner-task") || target.classList.contains("i-add-inner-task")) {
      this.addNewInnerTask(target);
    }
  }

  deleteTask(target) {
    const text = target.parentElement.children[0].innerText;
    this.todoService.removeTask(text);
    this.todoService.removeInnerTasksByUpperTask(text);
    target.parentElement.remove();
  }

  deleteInnerTask(target) {
    const upperText = target.closest('.collapse').parentElement.children[0].innerText;
    const innerText = target.parentElement.children[0].innerText;
    this.todoService.removeInnerTask(upperText, innerText);
    target.parentElement.remove();
  }

  toggleTaskCheck(target) {
    const taskText = target.parentElement.children[0].innerText;
    const isChecked = target.parentElement.children[0].classList.toggle("line-through");
    this.todoService.updateTaskCheck(taskText, isChecked);
  }

  toggleInnerTaskCheck(target) {
    const upperText = target.closest('.collapse').parentElement.children[0].innerText;
    const innerText = target.parentElement.children[0].innerText;
    const isChecked = target.parentElement.children[0].classList.toggle("line-through");
    this.todoService.updateInnerTaskCheck(upperText, innerText, isChecked);
  }

  addNewInnerTask(target) {
    const inputElement = target.classList.contains("btn-add-inner-task") 
      ? target.parentElement.childNodes[1] 
      : target.parentElement.parentElement.childNodes[1];
    
    const text = inputElement.value.trim();
    if (text !== "") {
      const upperText = target.closest('.collapse').parentElement.children[0].innerText;
      if (!this.todoService.innerTaskExists(upperText, text)) {
        this.addInnerTask(upperText, text, false);
        this.todoService.addInnerTask(upperText, text);
        inputElement.value = "";
      } else {
        alert("Task Already Added");
      }
    }
  }

  deleteAll(e) {
    e.preventDefault();
    const list = this.mainList.children[0].children;
    while (list.length > 1) {
      list[list.length - 1].remove();
    }
    this.todoService.clearAllTasks();
  }

  loadTasks() {
    const allTasks = this.todoService.getAllTasks();
    allTasks.forEach(task => {
      if (task.text !== "") {
        this.createNewTask(task.text, task.check);
      }
    });

    const innerTasks = this.todoService.getAllInnerTasks();
    innerTasks.forEach(task => {
      if (task.mainText !== "") {
        this.addInnerTask(task.upperTaskText, task.mainText, task.check);
      }
    });
  }
}

// Test suite
describe('TodoApp', () => {
  let todoApp;

  beforeEach(() => {
    jest.clearAllMocks();
    todoApp = new TodoApp();
  });

  test('constructor initializes correctly', () => {
    expect(todoApp.todoService).toBeInstanceOf(TodoService);
    expect(todoApp.count).toBe(1);
    expect(todoApp.upperLi).toBeDefined();
    expect(todoApp.innerLi).toBeDefined();
    expect(todoApp.mainForm).toBeDefined();
    expect(todoApp.mainInput).toBeDefined();
    expect(todoApp.mainList).toBeDefined();
    expect(todoApp.delAll).toBeDefined();
  });

  test('init method calls eventListeners and loadTasks', () => {
    const eventListenersSpy = jest.spyOn(todoApp, 'eventListeners');
    const loadTasksSpy = jest.spyOn(todoApp, 'loadTasks');
    
    todoApp.init();
    
    expect(eventListenersSpy).toHaveBeenCalled();
    expect(loadTasksSpy).toHaveBeenCalled();
  });

  test('eventListeners method adds event listeners', () => {
    todoApp.eventListeners();
    
    expect(todoApp.mainForm.addEventListener).toHaveBeenCalledWith("submit", expect.any(Function));
    expect(todoApp.mainList.addEventListener).toHaveBeenCalledWith("click", expect.any(Function));
    expect(todoApp.delAll.addEventListener).toHaveBeenCalledWith("click", expect.any(Function));
  });

  test('createNewTask method creates a new task', () => {
    todoApp.createNewTask('Test Task', false);
    
    expect(todoApp.upperLi.cloneNode).toHaveBeenCalled();
    expect(todoApp.mainList.children[0].appendChild).toHaveBeenCalled();
    expect(todoApp.count).toBe(2);
    expect(todoApp.mainInput.value).toBe('');
  });

  test('addNewItem method adds a new task', () => {
    const mockEvent = { preventDefault: jest.fn() };
    todoApp.mainInput.value = 'New Task';
    
    todoApp.addNewItem(mockEvent);
    
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(todoApp.todoService.addTask).toHaveBeenCalledWith('New Task');
  });

  // Add more tests for other methods...

  test('deleteAll method clears all tasks', () => {
    const mockEvent = { preventDefault: jest.fn() };
    todoApp.mainList.children[0].children = [
      {},
      { remove: jest.fn() },
      { remove: jest.fn() },
    ];
    
    todoApp.deleteAll(mockEvent);
    
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(todoApp.todoService.clearAllTasks).toHaveBeenCalled();
    expect(todoApp.mainList.children[0].children[1].remove).toHaveBeenCalled();
    expect(todoApp.mainList.children[0].children[2].remove).toHaveBeenCalled();
  });
});

// Run the tests
test.todo('Add more specific tests for each method');