import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';

// Mock localStorage
class MockLocalStorage {
    private store: { [key: string]: string } = {};

    public setItem(key: string, value: string): void {
        this.store[key] = value;
    }

    public getItem(key: string): string | null {
        return key in this.store ? this.store[key] : null;
    }

    public removeItem(key: string): void {
        delete this.store[key];
    }

    public clear(): void {
        this.store = {};
    }
}

// Actual implementation
interface Task {
    text: string;
    check: boolean;
}

interface InnerTask {
    upperTaskText: string;
    mainText: string;
    check: boolean;
}

class Storage {
    private static instance: Storage;
    private constructor() {}

    public static getInstance(): Storage {
        if (!Storage.instance) {
            Storage.instance = new Storage();
        }
        return Storage.instance;
    }

    public loadMainTasks(): Task[] {
        let allTasks: Task[] = [];
        if (localStorage.getItem("allTasks") === null) {
            localStorage.setItem("allTasks", JSON.stringify(allTasks));
        } else {
            allTasks = JSON.parse(localStorage.getItem("allTasks") || "[]");
        }
        return allTasks;
    }

    public loadInnerTasks(): InnerTask[] {
        let innerTasks: InnerTask[] = [];
        if (localStorage.getItem("innerTasks") === null) {
            localStorage.setItem("innerTasks", JSON.stringify(innerTasks));
        } else {
            innerTasks = JSON.parse(localStorage.getItem("innerTasks") || "[]");
        }
        return innerTasks;
    }

    public saveMainTask(text: string, index: number): void {
        if (index === -1) {
            localStorage.removeItem("allTasks");
            this.loadMainTasks();
        } else if (index === 0) {
            const tmp: Task[] = JSON.parse(localStorage.getItem("allTasks") || "[]");
            const taskIndex = tmp.findIndex(item => item.text === text);
            if (taskIndex !== -1) {
                tmp.splice(taskIndex, 1);
                localStorage.setItem("allTasks", JSON.stringify(tmp));
            }

            // Delete inner tasks whose upper text matches
            const innerTasks: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");
            const updatedInnerTasks = innerTasks.filter(item => item.upperTaskText !== text);
            localStorage.setItem("innerTasks", JSON.stringify(updatedInnerTasks));
        } else if (index === 1) {
            const tmp: Task[] = JSON.parse(localStorage.getItem("allTasks") || "[]");
            tmp.push({ text: text, check: false });
            localStorage.setItem("allTasks", JSON.stringify(tmp));
        }
    }

    public saveInnerTask(item: InnerTask | string, index: number, upperText: string = ""): void {
        if (index === -1) {
            localStorage.removeItem("innerTasks");
            this.loadInnerTasks();
        } else if (index === 0) {
            const tmp: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");
            const taskIndex = tmp.findIndex(e => e.mainText === item && e.upperTaskText === upperText);
            if (taskIndex !== -1) {
                tmp.splice(taskIndex, 1);
                localStorage.setItem("innerTasks", JSON.stringify(tmp));
            }
        } else if (index === 1) {
            const tmp: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");
            if (typeof item === "object") {
                tmp.push(item);
                localStorage.setItem("innerTasks", JSON.stringify(tmp));
            }
        }
    }

    public updateTaskCheck(text: string, isChecked: boolean): void {
        const tmp: Task[] = JSON.parse(localStorage.getItem("allTasks") || "[]");
        const taskIndex = tmp.findIndex(item => item.text === text);
        if (taskIndex !== -1) {
            tmp[taskIndex].check = isChecked;
            localStorage.setItem("allTasks", JSON.stringify(tmp));
        }
    }

    public updateInnerTaskCheck(upperText: string, mainText: string, isChecked: boolean): void {
        const tmp: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");
        const taskIndex = tmp.findIndex(item => item.upperTaskText === upperText && item.mainText === mainText);
        if (taskIndex !== -1) {
            tmp[taskIndex].check = isChecked;
            localStorage.setItem("innerTasks", JSON.stringify(tmp));
        }
    }
}

// Test suite
describe('Storage', () => {
    let storage: Storage;
    let mockLocalStorage: MockLocalStorage;

    beforeEach(() => {
        mockLocalStorage = new MockLocalStorage();
        (global as any).localStorage = mockLocalStorage;
        storage = Storage.getInstance();
    });

    afterEach(() => {
        mockLocalStorage.clear();
    });

    describe('loadMainTasks', () => {
        it('should return an empty array when no tasks are stored', () => {
            const tasks = storage.loadMainTasks();
            expect(tasks).to.deep.equal([]);
        });

        it('should return stored tasks', () => {
            const storedTasks = [{ text: 'Task 1', check: false }];
            localStorage.setItem('allTasks', JSON.stringify(storedTasks));
            const tasks = storage.loadMainTasks();
            expect(tasks).to.deep.equal(storedTasks);
        });
    });

    describe('loadInnerTasks', () => {
        it('should return an empty array when no inner tasks are stored', () => {
            const innerTasks = storage.loadInnerTasks();
            expect(innerTasks).to.deep.equal([]);
        });

        it('should return stored inner tasks', () => {
            const storedInnerTasks = [{ upperTaskText: 'Upper', mainText: 'Inner', check: false }];
            localStorage.setItem('innerTasks', JSON.stringify(storedInnerTasks));
            const innerTasks = storage.loadInnerTasks();
            expect(innerTasks).to.deep.equal(storedInnerTasks);
        });
    });

    describe('saveMainTask', () => {
        it('should add a new task', () => {
            storage.saveMainTask('New Task', 1);
            const tasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
            expect(tasks).to.deep.equal([{ text: 'New Task', check: false }]);
        });

        it('should remove a task', () => {
            localStorage.setItem('allTasks', JSON.stringify([{ text: 'Task to remove', check: false }]));
            storage.saveMainTask('Task to remove', 0);
            const tasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
            expect(tasks).to.deep.equal([]);
        });

        it('should clear all tasks', () => {
            localStorage.setItem('allTasks', JSON.stringify([{ text: 'Task', check: false }]));
            storage.saveMainTask('', -1);
            const tasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
            expect(tasks).to.deep.equal([]);
        });
    });

    describe('saveInnerTask', () => {
        it('should add a new inner task', () => {
            const newInnerTask = { upperTaskText: 'Upper', mainText: 'Inner', check: false };
            storage.saveInnerTask(newInnerTask, 1);
            const innerTasks = JSON.parse(localStorage.getItem('innerTasks') || '[]');
            expect(innerTasks).to.deep.equal([newInnerTask]);
        });

        it('should remove an inner task', () => {
            const innerTask = { upperTaskText: 'Upper', mainText: 'Inner', check: false };
            localStorage.setItem('innerTasks', JSON.stringify([innerTask]));
            storage.saveInnerTask('Inner', 0, 'Upper');
            const innerTasks = JSON.parse(localStorage.getItem('innerTasks') || '[]');
            expect(innerTasks).to.deep.equal([]);
        });

        it('should clear all inner tasks', () => {
            localStorage.setItem('innerTasks', JSON.stringify([{ upperTaskText: 'Upper', mainText: 'Inner', check: false }]));
            storage.saveInnerTask('', -1);
            const innerTasks = JSON.parse(localStorage.getItem('innerTasks') || '[]');
            expect(innerTasks).to.deep.equal([]);
        });
    });

    describe('updateTaskCheck', () => {
        it('should update the check status of a task', () => {
            localStorage.setItem('allTasks', JSON.stringify([{ text: 'Task', check: false }]));
            storage.updateTaskCheck('Task', true);
            const tasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
            expect(tasks[0].check).to.be.true;
        });
    });

    describe('updateInnerTaskCheck', () => {
        it('should update the check status of an inner task', () => {
            localStorage.setItem('innerTasks', JSON.stringify([{ upperTaskText: 'Upper', mainText: 'Inner', check: false }]));
            storage.updateInnerTaskCheck('Upper', 'Inner', true);
            const innerTasks = JSON.parse(localStorage.getItem('innerTasks') || '[]');
            expect(innerTasks[0].check).to.be.true;
        });
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