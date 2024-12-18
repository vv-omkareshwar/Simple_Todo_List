// Mock implementations and utility functions
interface Task {
    text: string;
    check: boolean;
}

interface InnerTask {
    upperTaskText: string;
    mainText: string;
    check: boolean;
}

// Mock localStorage
const mockLocalStorage = (() => {
    let store: { [key: string]: string } = {};
    return {
        getItem: (key: string): string | null => {
            return store[key] || null;
        },
        setItem: (key: string, value: string): void => {
            store[key] = value.toString();
        },
        removeItem: (key: string): void => {
            delete store[key];
        },
        clear: (): void => {
            store = {};
        }
    };
})();

// Mock DOM elements
const mockDocument = {
    getElementById: (id: string): any => ({
        addEventListener: jest.fn(),
        classList: {
            remove: jest.fn(),
            add: jest.fn(),
            contains: jest.fn().mockReturnValue(false)
        },
        setAttribute: jest.fn(),
        removeAttribute: jest.fn(),
        cloneNode: jest.fn().mockReturnValue({
            classList: { remove: jest.fn() },
            setAttribute: jest.fn(),
            children: [
                { setAttribute: jest.fn(), classList: { remove: jest.fn(), add: jest.fn() }, innerText: '' },
                {}, {}, { setAttribute: jest.fn() }
            ],
            childNodes: [
                {}, {}, { classList: { remove: jest.fn() } },
                { classList: { remove: jest.fn() } },
                { classList: { remove: jest.fn() } }
            ]
        }),
        children: [{ value: '' }],
        parentElement: {
            children: [{ innerText: '' }],
            remove: jest.fn()
        },
        lastElementChild: {
            firstElementChild: {
                firstElementChild: {
                    insertBefore: jest.fn(),
                    lastElementChild: {}
                }
            }
        }
    })
};

// Mock alert function
const mockAlert = jest.fn();

// Global variables and DOM elements
let allTasks: Task[] = [];
let innerTasks: InnerTask[] = [];
let count = 1;
const upperLi = mockDocument.getElementById("upperLi");
const innerLi = mockDocument.getElementById("innerLi");
const mainForm = mockDocument.getElementById("addingForm");
const mainInput = mainForm.children[0] as HTMLInputElement;
const mainList = mockDocument.getElementById("mainList");
const delAll = mockDocument.getElementById("delAll");

// Function implementations
function eventListeners(): void {
    mainForm.addEventListener("submit", addNewItem);
    mainList.addEventListener("click", taskStufs);
    delAll.addEventListener("click", deleteAll);
}

function createNewTask(text: string, check: boolean = false): void {
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
    (newLi.children[3] as HTMLElement).setAttribute("id", `collapse${count}`);

    mainList.children[0].appendChild(newLi);

    count++;
    mainInput.value = "";
}

function addNewItem(e: Event): void {
    e.preventDefault();
    const taskText = mainInput.value;

    if (taskText !== "") {
        allTasks = JSON.parse(mockLocalStorage.getItem("allTasks") || "[]");
        let c = false;
        allTasks.forEach(function (item) {
            if (item.text == taskText) {
                c = true;
                mockAlert("Task Already Added");
            }
        });
        if (c == false) {
            createNewTask(taskText);
            saveLS(taskText, 1);
        }
    }
}

function addInnerTask(upperText: string, mainText: string, check: boolean = false): void {
    let tempLi = innerLi.cloneNode(true) as HTMLLIElement;
    tempLi.setAttribute("id", "");

    tempLi.childNodes.forEach(function (item, index) {
        if (index == 3 || index == 5) {
            (item as HTMLElement).classList.remove("d-none");
        }
    });
    (tempLi.children[0] as HTMLElement).innerText = mainText;

    if (check) {
        (tempLi.children[0] as HTMLElement).classList.add("line-throught");
    } else {
        (tempLi.children[0] as HTMLElement).classList.remove("line-throught");
    }

    let tempList: HTMLElement | null = null;
    for (let i = 1; i < mainList.children[0].children.length; i++) {
        if (upperText == (mainList.children[0].children[i].children[0] as HTMLElement).innerText) {
            tempList = mainList.children[0].children[i] as HTMLElement;
            break;
        }
    }

    if (tempList) {
        tempList.lastElementChild?.firstElementChild?.firstElementChild?.insertBefore(
            tempLi,
            tempList.lastElementChild.firstElementChild.firstElementChild.lastElementChild
        );
    }
}

function taskStufs(e: Event): void {
    e.preventDefault();
    const target = e.target as HTMLElement;

    if (target.classList.contains("delete-item")) {
        const text = (target.parentElement?.children[0] as HTMLElement).innerText;
        saveLS(text, 0);

        let tempInnerList: InnerTask[] = JSON.parse(mockLocalStorage.getItem("innerTasks") || "[]");

        tempInnerList.forEach(function (item) {
            if (text == item.upperTaskText) {
                saveInnerTasks(item.mainText, 0, text);
            }
        });

        target.parentElement?.remove();
    } else if (target.classList.contains("delete-inner-item")) {
        const upperText = (target.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[0] as HTMLElement).innerText;
        saveInnerTasks((target.parentElement?.children[0] as HTMLElement).innerText, 0, upperText);
        target.parentElement?.remove();
    } else if (target.classList.contains("check")) {
        let tmpList: Task[] = JSON.parse(mockLocalStorage.getItem("allTasks") || "[]");

        if (target.parentElement?.children[0].classList.contains("line-throught")) {
            for (let i = 0; i < tmpList.length; i++) {
                if (tmpList[i].text == (target.parentElement.children[0] as HTMLElement).innerText) {
                    tmpList[i].check = false;
                    mockLocalStorage.setItem("allTasks", JSON.stringify(tmpList));
                    break;
                }
            }
            target.parentElement.children[0].classList.remove("line-throught");
        } else {
            for (let i = 0; i < tmpList.length; i++) {
                if (tmpList[i].text == (target.parentElement?.children[0] as HTMLElement).innerText) {
                    tmpList[i].check = true;
                    mockLocalStorage.setItem("allTasks", JSON.stringify(tmpList));
                    break;
                }
            }
            target.parentElement?.children[0].classList.add("line-throught");
        }
    } else if (target.classList.contains("inner-check")) {
        let tmp: InnerTask[] = JSON.parse(mockLocalStorage.getItem("innerTasks") || "[]");

        const upperText = (target.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[0] as HTMLElement).innerText;

        if (target.parentElement?.children[0].classList.contains("line-throught")) {
            tmp.forEach(function (item) {
                if (
                    item.mainText == (target.parentElement?.children[0] as HTMLElement).innerText &&
                    item.upperTaskText == upperText
                ) {
                    item.check = false;
                    mockLocalStorage.setItem("innerTasks", JSON.stringify(tmp));
                }
            });
            target.parentElement.children[0].classList.remove("line-throught");
        } else {
            tmp.forEach(function (item) {
                if (
                    item.mainText == (target.parentElement?.children[0] as HTMLElement).innerText &&
                    item.upperTaskText == upperText
                ) {
                    item.check = true;
                    mockLocalStorage.setItem("innerTasks", JSON.stringify(tmp));
                }
            });
            target.parentElement?.children[0].classList.add("line-throught");
        }
    } else if (target.classList.contains("btn-add-inner-task")) {
        const text = (target.parentElement?.childNodes[1] as HTMLInputElement).value;

        if (text != "") {
            innerTasks = JSON.parse(mockLocalStorage.getItem("innerTasks") || "[]");

            const upperText = (target.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[0] as HTMLElement).innerText;

            let c = true;
            innerTasks.forEach(function (item) {
                if (item.mainText == text && item.upperTaskText == upperText) {
                    c = false;
                    mockAlert("Task Already Added");
                }
            });
            if (c == true) {
                innerTasks.push({
                    upperTaskText: upperText,
                    mainText: text,
                    check: false,
                });
                addInnerTask(upperText, text);
                saveInnerTasks(innerTasks[innerTasks.length - 1], 1);
            }
        }
        (target.parentElement?.childNodes[1] as HTMLInputElement).value = "";
    } else if (target.classList.contains("i-add-inner-task")) {
        let text = (target.parentElement?.parentElement?.childNodes[1] as HTMLInputElement).value;

        if (text != "") {
            const upperText = (target.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[0] as HTMLElement).innerText;

            innerTasks.push({ upperTaskText: upperText, mainText: text, check: false });

            addInnerTask(upperText, text);
            saveInnerTasks(innerTasks[innerTasks.length - 1], 1);

            (target.parentElement?.parentElement?.childNodes[1] as HTMLInputElement).value = "";
        }
    }
}

function deleteAll(e: Event): void {
    e.preventDefault();

    let list = (e.target as HTMLElement).parentElement?.parentElement?.children[1].children[0].childNodes[1].children;

    if (list) {
        while (list.length != 1) {
            list[list.length - 1].remove();
        }
    }
    saveLS("", -1);
    saveInnerTasks("", -1);
}

function loadLS(): void {
    if (mockLocalStorage.getItem("allTasks") === null) {
        mockLocalStorage.setItem("allTasks", JSON.stringify(allTasks));
    } else {
        allTasks = JSON.parse(mockLocalStorage.getItem("allTasks") || "[]");

        allTasks.forEach(function (item) {
            if (item.text != "") {
                createNewTask(item.text, item.check);
            }
        });
    }
}

function loadInnerTasks(): void {
    if (mockLocalStorage.getItem("innerTasks") === null) {
        mockLocalStorage.setItem("innerTasks", JSON.stringify(innerTasks));
    } else {
        innerTasks = JSON.parse(mockLocalStorage.getItem("innerTasks") || "[]");

        innerTasks.forEach(function (item) {
            if (item.mainText != "") {
                addInnerTask(item.upperTaskText, item.mainText, item.check);
            }
        });
    }
}

function saveLS(text: string, index: number): void {
    if (index == -1) {
        mockLocalStorage.removeItem("allTasks");
        allTasks.length = 0;
        loadLS();
    } else if (index == 0) {
        const tmp: Task[] = JSON.parse(mockLocalStorage.getItem("allTasks") || "[]");
        let c: number | undefined;
        tmp.forEach(function (item, ind) {
            if (item.text == text) c = ind;
        });
        if (c !== undefined) {
            tmp.splice(c, 1);
            mockLocalStorage.setItem("allTasks", JSON.stringify(tmp));
        }

        const tmp2: InnerTask[] = JSON.parse(mockLocalStorage.getItem("innerTasks") || "[]");

        for (let i = 0; i < tmp2.length; i++) {
            if (tmp2[i].upperTaskText == text) {
                saveInnerTasks(tmp2[i].mainText, 0, text);
            }
        }
    } else if (index == 1) {
        const tmp: Task[] = JSON.parse(mockLocalStorage.getItem("allTasks") || "[]");
        tmp.push({ text: text, check: false });
        mockLocalStorage.setItem("allTasks", JSON.stringify(tmp));
    }
}

function saveInnerTasks(item: string | InnerTask, index: number, upperText: string = ""): void {
    if (index == -1) {
        mockLocalStorage.removeItem("innerTasks");
        innerTasks.length = 0;
        loadInnerTasks();
    } else if (index == 0) {
        const tmp: InnerTask[] = JSON.parse(mockLocalStorage.getItem("innerTasks") || "[]");

        let cont = false;
        let c: number | undefined;
        tmp.forEach(function (e, ind) {
            if (typeof item === 'string' && e.mainText == item && e.upperTaskText == upperText) {
                c = ind;
                cont = true;
            }
        });
        if (cont && c !== undefined) {
            tmp.splice(c, 1);
            mockLocalStorage.setItem("innerTasks", JSON.stringify(tmp));
        }
    } else if (index == 1 && typeof item !== 'string') {
        const tmp: InnerTask[] = JSON.parse(mockLocalStorage.getItem("innerTasks") || "[]");
        tmp.push(item);
        mockLocalStorage.setItem("innerTasks", JSON.stringify(tmp));
    }
}

// Test suite
describe('Todo List', () => {
    beforeEach(() => {
        mockLocalStorage.clear();
        jest.clearAllMocks();
        allTasks = [];
        innerTasks = [];
        count = 1;
    });

    test('createNewTask adds a new task', () => {
        createNewTask('Test Task');
        expect(mainList.children[0].appendChild).toHaveBeenCalled();
        expect(count).toBe(2);
        expect(mainInput.value).toBe('');
    });

    test('addNewItem adds a new task to localStorage', () => {
        mainInput.value = 'New Task';
        addNewItem(new Event('submit'));
        const storedTasks = JSON.parse(mockLocalStorage.getItem('allTasks') || '[]');
        expect(storedTasks).toContainEqual({ text: 'New Task', check: false });
    });

    test('addNewItem prevents duplicate tasks', () => {
        mockLocalStorage.setItem('allTasks', JSON.stringify([{ text: 'Existing Task', check: false }]));
        mainInput.value = 'Existing Task';
        addNewItem(new Event('submit'));
        expect(mockAlert).toHaveBeenCalledWith('Task Already Added');
    });

    test('addInnerTask adds an inner task', () => {
        addInnerTask('Upper Task', 'Inner Task');
        expect(innerLi.cloneNode).toHaveBeenCalled();
    });

    test('deleteAll removes all tasks', () => {
        const mockEvent = {
            preventDefault: jest.fn(),
            target: {
                parentElement: {
                    parentElement: {
                        children: [
                            {},
                            {
                                children: [
                                    {
                                        childNodes: [
                                            {},
                                            { children: [{ remove: jest.fn() }, { remove: jest.fn() }] }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        };
        deleteAll(mockEvent as any);
        expect(mockLocalStorage.getItem('allTasks')).toBe('[]');
        expect(mockLocalStorage.getItem('innerTasks')).toBe('[]');
    });

    test('loadLS loads tasks from localStorage', () => {
        mockLocalStorage.setItem('allTasks', JSON.stringify([{ text: 'Saved Task', check: false }]));
        loadLS();
        expect(allTasks).toEqual([{ text: 'Saved Task', check: false }]);
    });

    test('loadInnerTasks loads inner tasks from localStorage', () => {
        mockLocalStorage.setItem('innerTasks', JSON.stringify([{ upperTaskText: 'Upper', mainText: 'Inner', check: false }]));
        loadInnerTasks();
        expect(innerTasks).toEqual([{ upperTaskText: 'Upper', mainText: 'Inner', check: false }]);
    });

    test('saveLS saves a task to localStorage', () => {
        saveLS('New Task', 1);
        const storedTasks = JSON.parse(mockLocalStorage.getItem('allTasks') || '[]');
        expect(storedTasks).toContainEqual({ text: 'New Task', check: false });
    });

    test('saveInnerTasks saves an inner task to localStorage', () => {
        const innerTask = { upperTaskText: 'Upper', mainText: 'Inner', check: false };
        saveInnerTasks(innerTask, 1);
        const storedInnerTasks = JSON.parse(mockLocalStorage.getItem('innerTasks') || '[]');
        expect(storedInnerTasks).toContainEqual(innerTask);
    });
});

// Mock jest functions
const jest = {
    fn: () => {
        const mockFn = (...args: any[]) => {
            mockFn.mock.calls.push(args);
            return mockFn.mockImplementation ? mockFn.mockImplementation(...args) : undefined;
        };
        mockFn.mock = { calls: [] };
        mockFn.mockImplementation = (fn: Function) => {
            mockFn.mockImplementation = fn;
        };
        return mockFn;
    },
    clearAllMocks: () => {
        for (const key in mockDocument) {
            if (typeof mockDocument[key] === 'function') {
                mockDocument[key].mock.calls = [];
            }
        }
        mockAlert.mock.calls = [];
    }
};

// Test runner
const describe = (name: string, fn: () => void) => {
    console.log(`\nTest Suite: ${name}`);
    fn();
};

const test = (name: string, fn: () => void) => {
    try {
        fn();
        console.log(`  ✓ ${name}`);
    } catch (error) {
        console.error(`  ✗ ${name}`);
        console.error(`    ${error}`);
    }
};

const expect = (actual: any) => ({
    toBe: (expected: any) => {
        if (actual !== expected) {
            throw new Error(`Expected ${expected}, but got ${actual}`);
        }
    },
    toEqual: (expected: any) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
        }
    },
    toHaveBeenCalled: () => {
        if (actual.mock.calls.length === 0) {
            throw new Error('Expected function to have been called');
        }
    },
    toHaveBeenCalledWith: (...args: any[]) => {
        const calls = actual.mock.calls;
        const match = calls.some(call => 
            call.length === args.length && call.every((arg, index) => arg === args[index])
        );
        if (!match) {
            throw new Error(`Expected function to have been called with ${JSON.stringify(args)}`);
        }
    },
    toContainEqual: (expected: any) => {
        if (!actual.some((item: any) => JSON.stringify(item) === JSON.stringify(expected))) {
            throw new Error(`Expected array to contain ${JSON.stringify(expected)}`);
        }
    }
});

const beforeEach = (fn: () => void) => {
    test = (function(originalTest) {
        return function(name: string, testFn: () => void) {
            originalTest(name, () => {
                fn();
                testFn();
            });
        };
    })(test);
};

// Run the tests
describe('Todo List', () => {
    beforeEach(() => {
        mockLocalStorage.clear();
        jest.clearAllMocks();
        allTasks = [];
        innerTasks = [];
        count = 1;
    });

    test('createNewTask adds a new task', () => {
        createNewTask('Test Task');
        expect(mainList.children[0].appendChild).toHaveBeenCalled();
        expect(count).toBe(2);
        expect(mainInput.value).toBe('');
    });

    test('addNewItem adds a new task to localStorage', () => {
        mainInput.value = 'New Task';
        addNewItem(new Event('submit'));
        const storedTasks = JSON.parse(mockLocalStorage.getItem('allTasks') || '[]');
        expect(storedTasks).toContainEqual({ text: 'New Task', check: false });
    });

    test('addNewItem prevents duplicate tasks', () => {
        mockLocalStorage.setItem('allTasks', JSON.stringify([{ text: 'Existing Task', check: false }]));
        mainInput.value = 'Existing Task';
        addNewItem(new Event('submit'));
        expect(mockAlert).toHaveBeenCalledWith('Task Already Added');
    });

    test('addInnerTask adds an inner task', () => {
        addInnerTask('Upper Task', 'Inner Task');
        expect(innerLi.cloneNode).toHaveBeenCalled();
    });

    test('deleteAll removes all tasks', () => {
        const mockEvent = {
            preventDefault: jest.fn(),
            target: {
                parentElement: {
                    parentElement: {
                        children: [
                            {},
                            {
                                children: [
                                    {
                                        childNodes: [
                                            {},
                                            { children: [{ remove: jest.fn() }, { remove: jest.fn() }] }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        };
        deleteAll(mockEvent as any);
        expect(mockLocalStorage.getItem('allTasks')).toBe('[]');
        expect(mockLocalStorage.getItem('innerTasks')).toBe('[]');
    });

    test('loadLS loads tasks from localStorage', () => {
        mockLocalStorage.setItem('allTasks', JSON.stringify([{ text: 'Saved Task', check: false }]));
        loadLS();
        expect(allTasks).toEqual([{ text: 'Saved Task', check: false }]);
    });

    test('loadInnerTasks loads inner tasks from localStorage', () => {
        mockLocalStorage.setItem('innerTasks', JSON.stringify([{ upperTaskText: 'Upper', mainText: 'Inner', check: false }]));
        loadInnerTasks();
        expect(innerTasks).toEqual([{ upperTaskText: 'Upper', mainText: 'Inner', check: false }]);
    });

    test('saveLS saves a task to localStorage', () => {
        saveLS('New Task', 1);
        const storedTasks = JSON.parse(mockLocalStorage.getItem('allTasks') || '[]');
        expect(storedTasks).toContainEqual({ text: 'New Task', check: false });
    });

    test('saveInnerTasks saves an inner task to localStorage', () => {
        const innerTask = { upperTaskText: 'Upper', mainText: 'Inner', check: false };
        saveInnerTasks(innerTask, 1);
        const storedInnerTasks = JSON.parse(mockLocalStorage.getItem('innerTasks') || '[]');
        expect(storedInnerTasks).toContainEqual(innerTask);
    });
});

console.log('All tests completed.');