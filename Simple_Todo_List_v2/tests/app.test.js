// Mock DOM elements
const mockDocument = {
  getElementById: (id) => ({
    addEventListener: jest.fn(),
    removeAttribute: jest.fn(),
    setAttribute: jest.fn(),
    classList: {
      remove: jest.fn(),
      toggle: jest.fn(),
    },
    children: [
      { setAttribute: jest.fn(), classList: { toggle: jest.fn() }, innerText: '' },
      {},
      {},
      { setAttribute: jest.fn() },
    ],
    appendChild: jest.fn(),
    remove: jest.fn(),
    closest: jest.fn().mockReturnValue({
      querySelector: jest.fn().mockReturnValue({ children: [{ children: [] }] }),
      parentElement: { children: [{ innerText: 'Upper Task' }] },
    }),
    parentElement: {
      children: [{ innerText: 'Task Text' }],
      remove: jest.fn(),
    },
    childNodes: [
      { classList: { remove: jest.fn() } },
      { classList: { remove: jest.fn() } },
      { classList: { remove: jest.fn() } },
      { classList: { remove: jest.fn() } },
      { classList: { remove: jest.fn() } },
      { classList: { remove: jest.fn() } },
    ],
  }),
};

global.document = mockDocument;
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
global.alert = jest.fn();

// Main code implementation
let allTasks = [];
let innerTasks = [];
let count = 1;

const upperLi = document.getElementById("upperLi");
const innerLi = document.getElementById("innerLi");
const mainForm = document.getElementById("addingForm");
const mainInput = { value: '' };
const mainList = document.getElementById("mainList");
const delAll = document.getElementById("delAll");

const eventListeners = () => {
  mainForm.addEventListener("submit", addNewItem);
  mainList.addEventListener("click", taskStufs);
  delAll.addEventListener("click", deleteAll);
};

const createNewTask = (text, check = false) => {
  const newLi = upperLi.cloneNode(true);
  newLi.classList.remove("d-none");
  newLi.removeAttribute("id");

  newLi.children[0].setAttribute("href", `#collapse${count}`);
  newLi.children[0].classList.toggle("line-throught", check);
  newLi.children[0].innerText = text;
  newLi.children[3].setAttribute("id", `collapse${count}`);

  mainList.children[0].appendChild(newLi);

  count++;
  mainInput.value = "";
};

const addNewItem = (e) => {
  e.preventDefault();
  const taskText = mainInput.value.trim();

  if (taskText) {
    allTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
    const taskExists = allTasks.some(item => item.text === taskText);
    
    if (taskExists) {
      alert("Task Already Added");
    } else {
      createNewTask(taskText);
      saveLS(taskText, 1);
    }
  }
};

const addInnerTask = (upperText, mainText, check = false) => {
  const tempLi = innerLi.cloneNode(true);
  tempLi.removeAttribute("id");

  tempLi.childNodes.forEach((item, index) => {
    if (index === 3 || index === 5) {
      item.classList.remove("d-none");
    }
  });

  tempLi.children[0].innerText = mainText;
  tempLi.children[0].classList.toggle("line-throught", check);

  const tempList = Array.from(mainList.children[0].children)
    .find(child => child.children[0].innerText === upperText);

  if (tempList) {
    const insertionPoint = tempList.lastElementChild.firstElementChild.firstElementChild;
    insertionPoint.insertBefore(tempLi, insertionPoint.lastElementChild);
  }
};

const taskStufs = (e) => {
  e.preventDefault();
  const target = e.target;

  if (target.classList.contains("delete-item")) {
    handleDeleteItem(target);
  } else if (target.classList.contains("delete-inner-item")) {
    handleDeleteInnerItem(target);
  } else if (target.classList.contains("check")) {
    handleCheck(target);
  } else if (target.classList.contains("inner-check")) {
    handleInnerCheck(target);
  } else if (target.classList.contains("btn-add-inner-task") || target.classList.contains("i-add-inner-task")) {
    handleAddInnerTask(target);
  }
};

const handleDeleteItem = (target) => {
  const text = target.parentElement.children[0].innerText;
  saveLS(text, 0);
  
  const tempInnerList = JSON.parse(localStorage.getItem("innerTasks")) || [];
  tempInnerList.forEach(item => {
    if (text === item.upperTaskText) {
      saveInnerTasks(item.mainText, 0, text);
    }
  });

  target.parentElement.remove();
};

const handleDeleteInnerItem = (target) => {
  const upperText = target.closest('.collapse').parentElement.children[0].innerText;
  saveInnerTasks(target.parentElement.children[0].innerText, 0, upperText);
  target.parentElement.remove();
};

const handleCheck = (target) => {
  const tmpList = JSON.parse(localStorage.getItem("allTasks")) || [];
  const textElement = target.parentElement.children[0];
  const text = textElement.innerText;
  const isChecked = textElement.classList.toggle("line-throught");

  const updatedList = tmpList.map(item => 
    item.text === text ? { ...item, check: isChecked } : item
  );

  localStorage.setItem("allTasks", JSON.stringify(updatedList));
};

const handleInnerCheck = (target) => {
  const tmp = JSON.parse(localStorage.getItem("innerTasks")) || [];
  const textElement = target.parentElement.children[0];
  const upperText = target.closest('.collapse').parentElement.children[0].innerText;
  const isChecked = textElement.classList.toggle("line-throught");

  const updatedInnerTasks = tmp.map(item => 
    (item.mainText === textElement.innerText && item.upperTaskText === upperText)
      ? { ...item, check: isChecked }
      : item
  );

  localStorage.setItem("innerTasks", JSON.stringify(updatedInnerTasks));
};

const handleAddInnerTask = (target) => {
  const inputElement = target.classList.contains("btn-add-inner-task") 
    ? target.parentElement.childNodes[1]
    : target.parentElement.parentElement.childNodes[1];

  const text = inputElement.value.trim();
  const upperText = target.closest('.collapse').parentElement.children[0].innerText;

  if (text) {
    innerTasks = JSON.parse(localStorage.getItem("innerTasks")) || [];
    const taskExists = innerTasks.some(item => item.mainText === text && item.upperTaskText === upperText);

    if (taskExists) {
      alert("Task Already Added");
    } else {
      const newInnerTask = { upperTaskText: upperText, mainText: text, check: false };
      addInnerTask(upperText, text);
      saveInnerTasks(newInnerTask, 1);
    }
  }

  inputElement.value = "";
};

const deleteAll = (e) => {
  e.preventDefault();
  const list = e.target.closest('.container').querySelector('#mainList').children[0].children;
  
  while (list.length > 1) {
    list[list.length - 1].remove();
  }
  
  saveLS("", -1);
  saveInnerTasks("", -1);
};

const loadLS = () => {
  allTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
  allTasks.forEach(item => {
    if (item.text) {
      createNewTask(item.text, item.check);
    }
  });
};

const loadInnerTasks = () => {
  innerTasks = JSON.parse(localStorage.getItem("innerTasks")) || [];
  innerTasks.forEach(item => {
    if (item.mainText) {
      addInnerTask(item.upperTaskText, item.mainText, item.check);
    }
  });
};

const saveLS = (text, index) => {
  let tmp = JSON.parse(localStorage.getItem("allTasks")) || [];

  switch (index) {
    case -1:
      localStorage.removeItem("allTasks");
      allTasks = [];
      break;
    case 0:
      tmp = tmp.filter(item => item.text !== text);
      const tmp2 = JSON.parse(localStorage.getItem("innerTasks")) || [];
      tmp2.forEach(item => {
        if (item.upperTaskText === text) {
          saveInnerTasks(item, 0);
        }
      });
      break;
    case 1:
      tmp.push({ text, check: false });
      break;
  }

  localStorage.setItem("allTasks", JSON.stringify(tmp));
};

const saveInnerTasks = (item, index, upperText = "") => {
  let tmp = JSON.parse(localStorage.getItem("innerTasks")) || [];

  switch (index) {
    case -1:
      localStorage.removeItem("innerTasks");
      innerTasks = [];
      break;
    case 0:
      tmp = tmp.filter(e => !(e.mainText === item && e.upperTaskText === upperText));
      break;
    case 1:
      tmp.push(item);
      break;
  }

  localStorage.setItem("innerTasks", JSON.stringify(tmp));
};

// Test suite
describe('Todo List Application', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
    localStorage.removeItem.mockClear();
    count = 1;
    allTasks = [];
    innerTasks = [];
  });

  test('eventListeners sets up event listeners', () => {
    eventListeners();
    expect(mainForm.addEventListener).toHaveBeenCalledWith("submit", addNewItem);
    expect(mainList.addEventListener).toHaveBeenCalledWith("click", taskStufs);
    expect(delAll.addEventListener).toHaveBeenCalledWith("click", deleteAll);
  });

  test('createNewTask creates a new task element', () => {
    createNewTask('Test Task');
    expect(upperLi.classList.remove).toHaveBeenCalledWith("d-none");
    expect(upperLi.removeAttribute).toHaveBeenCalledWith("id");
    expect(upperLi.children[0].setAttribute).toHaveBeenCalledWith("href", "#collapse1");
    expect(upperLi.children[0].innerText).toBe('Test Task');
    expect(mainList.children[0].appendChild).toHaveBeenCalled();
    expect(count).toBe(2);
    expect(mainInput.value).toBe('');
  });

  test('addNewItem adds a new task if it does not exist', () => {
    mainInput.value = 'New Task';
    localStorage.getItem.mockReturnValue(JSON.stringify([]));
    addNewItem({ preventDefault: jest.fn() });
    expect(localStorage.setItem).toHaveBeenCalledWith("allTasks", JSON.stringify([{ text: 'New Task', check: false }]));
  });

  test('addNewItem shows alert if task already exists', () => {
    mainInput.value = 'Existing Task';
    localStorage.getItem.mockReturnValue(JSON.stringify([{ text: 'Existing Task', check: false }]));
    addNewItem({ preventDefault: jest.fn() });
    expect(alert).toHaveBeenCalledWith("Task Already Added");
  });

  test('addInnerTask adds an inner task', () => {
    addInnerTask('Upper Task', 'Inner Task');
    expect(innerLi.removeAttribute).toHaveBeenCalledWith("id");
    expect(innerLi.children[0].innerText).toBe('Inner Task');
  });

  test('handleDeleteItem deletes a task', () => {
    const mockTarget = {
      parentElement: {
        children: [{ innerText: 'Task to Delete' }],
        remove: jest.fn(),
      },
    };
    localStorage.getItem.mockReturnValue(JSON.stringify([{ text: 'Task to Delete', check: false }]));
    handleDeleteItem(mockTarget);
    expect(localStorage.setItem).toHaveBeenCalledWith("allTasks", JSON.stringify([]));
    expect(mockTarget.parentElement.remove).toHaveBeenCalled();
  });

  test('handleCheck toggles task check state', () => {
    const mockTarget = {
      parentElement: {
        children: [{ innerText: 'Task to Toggle', classList: { toggle: jest.fn().mockReturnValue(true) } }],
      },
    };
    localStorage.getItem.mockReturnValue(JSON.stringify([{ text: 'Task to Toggle', check: false }]));
    handleCheck(mockTarget);
    expect(localStorage.setItem).toHaveBeenCalledWith("allTasks", JSON.stringify([{ text: 'Task to Toggle', check: true }]));
  });

  test('handleAddInnerTask adds a new inner task', () => {
    const mockTarget = {
      classList: { contains: jest.fn().mockReturnValue(true) },
      parentElement: {
        childNodes: [null, { value: 'New Inner Task' }],
      },
      closest: jest.fn().mockReturnValue({
        parentElement: {
          children: [{ innerText: 'Upper Task' }],
        },
      }),
    };
    localStorage.getItem.mockReturnValue(JSON.stringify([]));
    handleAddInnerTask(mockTarget);
    expect(localStorage.setItem).toHaveBeenCalledWith("innerTasks", JSON.stringify([{ upperTaskText: 'Upper Task', mainText: 'New Inner Task', check: false }]));
  });

  test('deleteAll removes all tasks', () => {
    const mockEvent = {
      preventDefault: jest.fn(),
      target: {
        closest: jest.fn().mockReturnValue({
          querySelector: jest.fn().mockReturnValue({
            children: [{ children: [null, { remove: jest.fn() }] }],
          }),
        }),
      },
    };
    deleteAll(mockEvent);
    expect(localStorage.removeItem).toHaveBeenCalledWith("allTasks");
    expect(localStorage.removeItem).toHaveBeenCalledWith("innerTasks");
  });

  test('loadLS loads all tasks', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify([
      { text: 'Task 1', check: false },
      { text: 'Task 2', check: true },
    ]));
    loadLS();
    expect(upperLi.children[0].innerText).toHaveBeenCalledWith('Task 1');
    expect(upperLi.children[0].innerText).toHaveBeenCalledWith('Task 2');
  });

  test('loadInnerTasks loads all inner tasks', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify([
      { upperTaskText: 'Upper 1', mainText: 'Inner 1', check: false },
      { upperTaskText: 'Upper 2', mainText: 'Inner 2', check: true },
    ]));
    loadInnerTasks();
    expect(innerLi.children[0].innerText).toHaveBeenCalledWith('Inner 1');
    expect(innerLi.children[0].innerText).toHaveBeenCalledWith('Inner 2');
  });
});