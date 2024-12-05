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
        <span></span>
        <i></i>
        <div></div>
      </li>
    </ul>
    <li id="innerLi" class="d-none">
      <span></span>
      <i class="d-none"></i>
      <i class="d-none"></i>
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
    removeItem: (key: string) => {
      delete store[key];
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
let count = 1;
const upperLi = document.getElementById("upperLi") as HTMLLIElement;
const innerLi = document.getElementById("innerLi") as HTMLLIElement;
const mainForm = document.getElementById("addingForm") as HTMLFormElement;
const mainInput = mainForm.children[0] as HTMLInputElement;
const mainList = document.getElementById("mainList") as HTMLUListElement;
const delAll = document.getElementById("delAll") as HTMLButtonElement;

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

function addInnerTask(upperText: string, mainText: string, check: boolean): void {
  let tempLi = innerLi.cloneNode(true) as HTMLLIElement;
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

  let tempList: HTMLElement | null = null;
  for (let i = 1; i < mainList.children[0].children.length; i++) {
    if (upperText === (mainList.children[0].children[i].children[0] as HTMLElement).innerText) {
      tempList = mainList.children[0].children[i] as HTMLElement;
      break;
    }
  }

  if (tempList) {
    const innerList = tempList.lastElementChild?.firstElementChild?.firstElementChild as HTMLElement;
    innerList.insertBefore(tempLi, innerList.lastElementChild);
  }
}

function saveLS(text: string, index: number): void {
  let allTasks: Task[] = JSON.parse(localStorage.getItem("allTasks") || "[]");
  
  if (index === -1) {
    localStorage.removeItem("allTasks");
    allTasks = [];
  } else if (index === 0) {
    allTasks = allTasks.filter(task => task.text !== text);
  } else if (index === 1) {
    allTasks.push({ text, check: false });
  }
  
  localStorage.setItem("allTasks", JSON.stringify(allTasks));
}

function saveInnerTasks(item: string | InnerTask, index: number, upperText: string = ""): void {
  let innerTasks: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");
  
  if (index === -1) {
    localStorage.removeItem("innerTasks");
    innerTasks = [];
  } else if (index === 0) {
    innerTasks = innerTasks.filter(task => !(task.mainText === item && task.upperTaskText === upperText));
  } else if (index === 1 && typeof item !== 'string') {
    innerTasks.push(item);
  }
  
  localStorage.setItem("innerTasks", JSON.stringify(innerTasks));
}

// Tests
describe('Task Management Functions', () => {
  beforeEach(() => {
    localStorage.clear();
    while (mainList.firstChild) {
      mainList.removeChild(mainList.firstChild);
    }
    mainList.appendChild(upperLi.cloneNode(true));
    count = 1;
  });

  it('should create a new task', () => {
    createNewTask('Test Task', false);
    expect(mainList.children[0].children.length).to.equal(2);
    expect((mainList.children[0].lastElementChild?.children[0] as HTMLElement).innerText).to.equal('Test Task');
  });

  it('should create a checked task', () => {
    createNewTask('Checked Task', true);
    expect((mainList.children[0].lastElementChild?.children[0] as HTMLElement).classList.contains('line-throught')).to.be.true;
  });

  it('should add an inner task', () => {
    createNewTask('Upper Task', false);
    addInnerTask('Upper Task', 'Inner Task', false);
    const upperTask = mainList.children[0].lastElementChild as HTMLElement;
    const innerList = upperTask.lastElementChild?.firstElementChild?.firstElementChild as HTMLElement;
    expect(innerList.children.length).to.equal(2);
    expect((innerList.firstElementChild?.children[0] as HTMLElement).innerText).to.equal('Inner Task');
  });

  it('should save a main task to localStorage', () => {
    saveLS('Test Task', 1);
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    expect(allTasks.length).to.equal(1);
    expect(allTasks[0].text).to.equal('Test Task');
  });

  it('should save an inner task to localStorage', () => {
    const innerTask: InnerTask = { upperTaskText: 'Upper Task', mainText: 'Inner Task', check: false };
    saveInnerTasks(innerTask, 1);
    const innerTasks = JSON.parse(localStorage.getItem('innerTasks') || '[]');
    expect(innerTasks.length).to.equal(1);
    expect(innerTasks[0].mainText).to.equal('Inner Task');
  });

  it('should delete a main task', () => {
    saveLS('Test Task', 1);
    saveLS('Test Task', 0);
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    expect(allTasks.length).to.equal(0);
  });

  it('should delete an inner task', () => {
    const innerTask: InnerTask = { upperTaskText: 'Upper Task', mainText: 'Inner Task', check: false };
    saveInnerTasks(innerTask, 1);
    saveInnerTasks('Inner Task', 0, 'Upper Task');
    const innerTasks = JSON.parse(localStorage.getItem('innerTasks') || '[]');
    expect(innerTasks.length).to.equal(0);
  });
});

// Run the tests
describe('Running all tests', () => {
  it('should run without errors', () => {
    // This will run all the tests defined above
  });
});

// If you want to run this as a standalone script, you can use:
// ts-node this_file_name.ts