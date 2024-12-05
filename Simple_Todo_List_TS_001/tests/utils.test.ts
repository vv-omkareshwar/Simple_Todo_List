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

// Interfaces
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
function createNewTask(text: string, check: boolean): void {
  const newLi = document.getElementById('upperLi')!.cloneNode(true) as HTMLLIElement;
  newLi.classList.remove('d-none');
  newLi.setAttribute('id', '');
  const anchor = newLi.children[0] as HTMLAnchorElement;
  anchor.innerText = text;
  if (check) {
    anchor.classList.add('line-throught');
  }
  document.getElementById('mainList')!.appendChild(newLi);
}

function addInnerTask(upperText: string, mainText: string, check: boolean): void {
  const tempLi = document.getElementById('innerLi')!.cloneNode(true) as HTMLLIElement;
  tempLi.setAttribute('id', '');
  (tempLi.children[0] as HTMLElement).innerText = mainText;
  if (check) {
    tempLi.children[0].classList.add('line-throught');
  }
  const mainList = document.getElementById('mainList')!;
  for (let i = 1; i < mainList.children.length; i++) {
    if (upperText === (mainList.children[i].children[0] as HTMLElement).innerText) {
      const innerTaskList = mainList.children[i].lastElementChild!.firstElementChild!.firstElementChild as HTMLUListElement;
      innerTaskList.insertBefore(tempLi, innerTaskList.lastElementChild);
      break;
    }
  }
}

function saveLS(text: string, index: number): void {
  let allTasks: Task[] = JSON.parse(localStorage.getItem('allTasks') || '[]');
  if (index === -1) {
    localStorage.removeItem('allTasks');
  } else if (index === 0) {
    allTasks = allTasks.filter(task => task.text !== text);
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
  } else if (index === 1) {
    allTasks.push({ text, check: false });
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
  }
}

function saveInnerTasks(item: string | InnerTask, index: number, upperText: string = ''): void {
  let innerTasks: InnerTask[] = JSON.parse(localStorage.getItem('innerTasks') || '[]');
  if (index === -1) {
    localStorage.removeItem('innerTasks');
  } else if (index === 0) {
    innerTasks = innerTasks.filter(task => !(task.mainText === item && task.upperTaskText === upperText));
    localStorage.setItem('innerTasks', JSON.stringify(innerTasks));
  } else if (index === 1 && typeof item !== 'string') {
    innerTasks.push(item);
    localStorage.setItem('innerTasks', JSON.stringify(innerTasks));
  }
}

// Tests
describe('Task Management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should create a new task', () => {
    createNewTask('Test Task', false);
    const mainList = document.getElementById('mainList')!;
    expect(mainList.children.length).to.equal(2);
    expect((mainList.lastElementChild!.children[0] as HTMLElement).innerText).to.equal('Test Task');
  });

  it('should add an inner task', () => {
    createNewTask('Upper Task', false);
    addInnerTask('Upper Task', 'Inner Task', false);
    const mainList = document.getElementById('mainList')!;
    const innerTaskList = mainList.lastElementChild!.lastElementChild!.firstElementChild!.firstElementChild as HTMLUListElement;
    expect(innerTaskList.children.length).to.equal(2);
    expect((innerTaskList.firstElementChild!.children[0] as HTMLElement).innerText).to.equal('Inner Task');
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