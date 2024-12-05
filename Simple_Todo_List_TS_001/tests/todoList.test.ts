import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import sinon from 'sinon';

// Mock DOM
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
  <body>
    <ul id="mainList">
      <li id="upperLi" class="d-none">
        <a href="#"></a>
        <i class="check"></i>
        <i class="delete-item"></i>
        <div id="collapse"></div>
      </li>
    </ul>
    <li id="innerLi" class="d-none">
      <span></span>
      <i class="inner-check d-none"></i>
      <i class="delete-inner-item d-none"></i>
    </li>
    <form id="addingForm">
      <input type="text" />
    </form>
    <button id="delAll"></button>
  </body>
</html>
`);

global.document = dom.window.document;
global.window = dom.window as any;

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Types
interface Task {
  text: string;
  check: boolean;
}

interface InnerTask {
  upperTaskText: string;
  mainText: string;
  check: boolean;
}

// Utility functions
const saveLS = (text: string, operation: number) => {
  let tempList: Task[] = JSON.parse(localStorage.getItem('allTasks') || '[]');
  if (operation === 1) {
    tempList.push({ text, check: false });
  } else if (operation === 0) {
    tempList = tempList.filter(item => item.text !== text);
  } else if (operation === -1) {
    tempList = [];
  }
  localStorage.setItem('allTasks', JSON.stringify(tempList));
};

const saveInnerTasks = (task: InnerTask | string, operation: number, upperText?: string) => {
  let tempList: InnerTask[] = JSON.parse(localStorage.getItem('innerTasks') || '[]');
  if (operation === 1 && typeof task !== 'string') {
    tempList.push(task);
  } else if (operation === 0 && typeof task === 'string' && upperText) {
    tempList = tempList.filter(item => !(item.mainText === task && item.upperTaskText === upperText));
  } else if (operation === -1) {
    tempList = [];
  }
  localStorage.setItem('innerTasks', JSON.stringify(tempList));
};

const loadLS = () => {
  const tasks: Task[] = JSON.parse(localStorage.getItem('allTasks') || '[]');
  tasks.forEach(task => createNewTask(task.text, task.check));
};

const loadInnerTasks = () => {
  const tasks: InnerTask[] = JSON.parse(localStorage.getItem('innerTasks') || '[]');
  tasks.forEach(task => addInnerTask(task.upperTaskText, task.mainText, task.check));
};

// Main code
let allTasks: Task[] = [];
let innerTasks: InnerTask[] = [];

let count = 1;
const upperLi = document.getElementById("upperLi") as HTMLLIElement;
const innerLi = document.getElementById("innerLi") as HTMLLIElement;
const mainForm = document.getElementById("addingForm") as HTMLFormElement;
const mainInput = mainForm.children[0] as HTMLInputElement;
const mainList = document.getElementById("mainList") as HTMLUListElement;
const delAll = document.getElementById("delAll") as HTMLButtonElement;

function eventListeners(): void {
  mainForm.addEventListener("submit", addNewItem);
  mainList.addEventListener("click", taskStufs);
  delAll.addEventListener("click", deleteAll);
}

function createNewTask(text: string, check: boolean): void {
  const newLi = upperLi.cloneNode(true) as HTMLLIElement;
  newLi.classList.remove("d-none");
  newLi.setAttribute("id", "");

  const anchor = newLi.children[0] as HTMLAnchorElement;
  anchor.setAttribute("href", `#collapse${count}`);
  anchor.classList.remove("line-throught");
  anchor.innerText = text;
  
  if (check) {
    anchor.classList.add("line-throught");
  }
  
  newLi.children[3].setAttribute("id", `collapse${count}`);
  mainList.children[0].appendChild(newLi);
  count++;
  mainInput.value = "";
}

function addNewItem(e: Event): void {
  e.preventDefault();
  const taskText = mainInput.value;
  if (taskText !== "") {
    allTasks = JSON.parse(localStorage.getItem("allTasks") || "[]");
    if (!allTasks.some(item => item.text === taskText)) {
      createNewTask(taskText, false);
      saveLS(taskText, 1);
    } else {
      console.log("Task Already Added");
    }
  }
}

function addInnerTask(upperText: string, mainText: string, check: boolean): void {
  const tempLi = innerLi.cloneNode(true) as HTMLLIElement;
  tempLi.setAttribute("id", "");
  tempLi.childNodes.forEach((item, index) => {
    if (index === 3 || index === 5) {
      (item as HTMLElement).classList.remove("d-none");
    }
  });
  (tempLi.children[0] as HTMLElement).innerText = mainText;
  if (check) {
    tempLi.children[0].classList.add("line-throught");
  }
  const tempList = Array.from(mainList.children[0].children).find(
    child => (child.children[0] as HTMLElement).innerText === upperText
  ) as HTMLElement | undefined;
  if (tempList) {
    const innerTaskList = tempList.lastElementChild?.firstElementChild?.firstElementChild as HTMLElement;
    innerTaskList.insertBefore(tempLi, innerTaskList.lastElementChild);
  }
}

function taskStufs(e: Event): void {
  e.preventDefault();
  const target = e.target as HTMLElement;
  if (target.classList.contains("delete-item")) {
    const text = (target.parentElement?.children[0] as HTMLElement).innerText;
    saveLS(text, 0);
    let tempInnerList: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");
    tempInnerList.forEach(item => {
      if (text === item.upperTaskText) {
        saveInnerTasks(item.mainText, 0, text);
      }
    });
    target.parentElement?.remove();
  } else if (target.classList.contains("delete-inner-item")) {
    const upperText = (target.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[0] as HTMLElement).innerText;
    saveInnerTasks((target.parentElement?.children[0] as HTMLElement).innerText, 0, upperText);
    target.parentElement?.remove();
  } else if (target.classList.contains("check")) {
    let tmpList: Task[] = JSON.parse(localStorage.getItem("allTasks") || "[]");
    const taskText = (target.parentElement?.children[0] as HTMLElement).innerText;
    const task = tmpList.find(t => t.text === taskText);
    if (task) {
      task.check = !task.check;
      localStorage.setItem("allTasks", JSON.stringify(tmpList));
      target.parentElement?.children[0].classList.toggle("line-throught");
    }
  } else if (target.classList.contains("inner-check")) {
    let tmp: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");
    const upperText = (target.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[0] as HTMLElement).innerText;
    const taskText = (target.parentElement?.children[0] as HTMLElement).innerText;
    const task = tmp.find(t => t.mainText === taskText && t.upperTaskText === upperText);
    if (task) {
      task.check = !task.check;
      localStorage.setItem("innerTasks", JSON.stringify(tmp));
      target.parentElement?.children[0].classList.toggle("line-throught");
    }
  } else if (target.classList.contains("btn-add-inner-task") || target.classList.contains("i-add-inner-task")) {
    const input = target.classList.contains("btn-add-inner-task") 
      ? target.parentElement?.childNodes[1] as HTMLInputElement
      : target.parentElement?.parentElement?.childNodes[1] as HTMLInputElement;
    const text = input.value;
    if (text !== "") {
      const upperText = (target.closest('li')?.children[0] as HTMLElement).innerText;
      innerTasks = JSON.parse(localStorage.getItem("innerTasks") || "[]");
      if (!innerTasks.some(item => item.mainText === text && item.upperTaskText === upperText)) {
        innerTasks.push({ upperTaskText: upperText, mainText: text, check: false });
        addInnerTask(upperText, text, false);
        saveInnerTasks(innerTasks[innerTasks.length - 1], 1);
      } else {
        console.log("Task Already Added");
      }
    }
    input.value = "";
  }
}

function deleteAll(e: Event): void {
  e.preventDefault();
  const list = mainList.children[0].children;
  while (list.length > 1) {
    list[list.length - 1].remove();
  }
  saveLS("", -1);
  saveInnerTasks("", -1);
}

// Tests
describe('Todo List Application', () => {
  beforeEach(() => {
    localStorage.clear();
    while (mainList.firstChild) {
      mainList.removeChild(mainList.firstChild);
    }
    mainList.appendChild(upperLi.cloneNode(true));
    count = 1;
  });

  it('should add a new task', () => {
    mainInput.value = 'New Task';
    addNewItem(new Event('submit'));
    expect(mainList.children.length).to.equal(2);
    expect((mainList.lastElementChild?.children[0] as HTMLElement).innerText).to.equal('New Task');
  });

  it('should not add duplicate tasks', () => {
    mainInput.value = 'New Task';
    addNewItem(new Event('submit'));
    addNewItem(new Event('submit'));
    expect(mainList.children.length).to.equal(2);
  });

  it('should delete a task', () => {
    createNewTask('Task to delete', false);
    const deleteIcon = mainList.lastElementChild?.querySelector('.delete-item') as HTMLElement;
    taskStufs(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(mainList.children.length).to.equal(1);
  });

  it('should mark a task as completed', () => {
    createNewTask('Task to complete', false);
    const checkIcon = mainList.lastElementChild?.querySelector('.check') as HTMLElement;
    checkIcon.click();
    const taskText = mainList.lastElementChild?.querySelector('a') as HTMLElement;
    expect(taskText.classList.contains('line-throught')).to.be.true;
  });

  it('should add an inner task', () => {
    createNewTask('Main Task', false);
    const mainTask = mainList.lastElementChild as HTMLElement;
    const addInnerTaskBtn = mainTask.querySelector('.btn-add-inner-task') as HTMLElement;
    const innerTaskInput = mainTask.querySelector('input') as HTMLInputElement;
    innerTaskInput.value = 'Inner Task';
    addInnerTaskBtn.click();
    const innerTaskList = mainTask.querySelector('.inner-task-list') as HTMLElement;
    expect(innerTaskList.children.length).to.equal(2); // Including the form
    expect((innerTaskList.firstElementChild as HTMLElement).innerText).to.equal('Inner Task');
  });

  it('should delete all tasks', () => {
    createNewTask('Task 1', false);
    createNewTask('Task 2', false);
    deleteAll(new Event('click'));
    expect(mainList.children.length).to.equal(1); // Only the hidden template remains
  });
});

// Run the tests
mocha.run();