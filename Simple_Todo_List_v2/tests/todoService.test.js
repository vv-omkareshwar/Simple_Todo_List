// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// TodoService implementation
class TodoService {
    constructor() {
        this.allTasks = [];
        this.innerTasks = [];
        this.count = 1; // for identical collapse id
    }

    loadTasks() {
        this.loadMainTasks();
        this.loadInnerTasks();
    }

    loadMainTasks() {
        if (localStorage.getItem("allTasks") === null) {
            localStorage.setItem("allTasks", JSON.stringify(this.allTasks));
        } else {
            this.allTasks = JSON.parse(localStorage.getItem("allTasks"));
        }
    }

    loadInnerTasks() {
        if (localStorage.getItem("innerTasks") === null) {
            localStorage.setItem("innerTasks", JSON.stringify(this.innerTasks));
        } else {
            this.innerTasks = JSON.parse(localStorage.getItem("innerTasks"));
        }
    }

    addTask(taskText) {
        if (taskText !== "") {
            const existingTask = this.allTasks.find(task => task.text === taskText);
            if (existingTask) {
                throw new Error("Task Already Added");
            }
            const newTask = { text: taskText, check: false };
            this.allTasks.push(newTask);
            this.saveMainTasks();
            return newTask;
        }
        return null;
    }

    addInnerTask(upperTaskText, innerTaskText) {
        if (innerTaskText !== "") {
            const existingInnerTask = this.innerTasks.find(
                task => task.upperTaskText === upperTaskText && task.mainText === innerTaskText
            );
            if (existingInnerTask) {
                throw new Error("Inner Task Already Added");
            }
            const newInnerTask = { upperTaskText, mainText: innerTaskText, check: false };
            this.innerTasks.push(newInnerTask);
            this.saveInnerTasks();
            return newInnerTask;
        }
        return null;
    }

    toggleTaskCheck(taskText, isInnerTask = false, upperTaskText = "") {
        let tasks = isInnerTask ? this.innerTasks : this.allTasks;
        let taskToToggle = isInnerTask
            ? tasks.find(task => task.mainText === taskText && task.upperTaskText === upperTaskText)
            : tasks.find(task => task.text === taskText);

        if (taskToToggle) {
            taskToToggle.check = !taskToToggle.check;
            this.saveMainTasks();
            if (isInnerTask) this.saveInnerTasks();
            return taskToToggle;
        }
        return null;
    }

    deleteTask(taskText) {
        const index = this.allTasks.findIndex(task => task.text === taskText);
        if (index !== -1) {
            this.allTasks.splice(index, 1);
            this.saveMainTasks();
            // Remove associated inner tasks
            this.innerTasks = this.innerTasks.filter(task => task.upperTaskText !== taskText);
            this.saveInnerTasks();
            return true;
        }
        return false;
    }

    deleteInnerTask(upperTaskText, innerTaskText) {
        const index = this.innerTasks.findIndex(
            task => task.upperTaskText === upperTaskText && task.mainText === innerTaskText
        );
        if (index !== -1) {
            this.innerTasks.splice(index, 1);
            this.saveInnerTasks();
            return true;
        }
        return false;
    }

    deleteAllTasks() {
        this.allTasks = [];
        this.innerTasks = [];
        this.saveMainTasks();
        this.saveInnerTasks();
    }

    saveMainTasks() {
        localStorage.setItem("allTasks", JSON.stringify(this.allTasks));
    }

    saveInnerTasks() {
        localStorage.setItem("innerTasks", JSON.stringify(this.innerTasks));
    }

    getAllTasks() {
        return this.allTasks;
    }

    getInnerTasks(upperTaskText) {
        return this.innerTasks.filter(task => task.upperTaskText === upperTaskText);
    }
}

// Test suite
describe('TodoService', () => {
    let todoService;

    beforeEach(() => {
        localStorage.clear();
        todoService = new TodoService();
    });

    test('addTask adds a new task', () => {
        const newTask = todoService.addTask('Test Task');
        expect(newTask).toEqual({ text: 'Test Task', check: false });
        expect(todoService.getAllTasks()).toHaveLength(1);
    });

    test('addTask throws error for duplicate task', () => {
        todoService.addTask('Test Task');
        expect(() => todoService.addTask('Test Task')).toThrow('Task Already Added');
    });

    test('addInnerTask adds a new inner task', () => {
        todoService.addTask('Upper Task');
        const newInnerTask = todoService.addInnerTask('Upper Task', 'Inner Task');
        expect(newInnerTask).toEqual({ upperTaskText: 'Upper Task', mainText: 'Inner Task', check: false });
        expect(todoService.getInnerTasks('Upper Task')).toHaveLength(1);
    });

    test('toggleTaskCheck toggles task check status', () => {
        todoService.addTask('Test Task');
        const toggledTask = todoService.toggleTaskCheck('Test Task');
        expect(toggledTask.check).toBe(true);
    });

    test('deleteTask removes a task and its inner tasks', () => {
        todoService.addTask('Test Task');
        todoService.addInnerTask('Test Task', 'Inner Task');
        const result = todoService.deleteTask('Test Task');
        expect(result).toBe(true);
        expect(todoService.getAllTasks()).toHaveLength(0);
        expect(todoService.getInnerTasks('Test Task')).toHaveLength(0);
    });

    test('deleteInnerTask removes an inner task', () => {
        todoService.addTask('Upper Task');
        todoService.addInnerTask('Upper Task', 'Inner Task');
        const result = todoService.deleteInnerTask('Upper Task', 'Inner Task');
        expect(result).toBe(true);
        expect(todoService.getInnerTasks('Upper Task')).toHaveLength(0);
    });

    test('deleteAllTasks clears all tasks', () => {
        todoService.addTask('Task 1');
        todoService.addTask('Task 2');
        todoService.addInnerTask('Task 1', 'Inner Task');
        todoService.deleteAllTasks();
        expect(todoService.getAllTasks()).toHaveLength(0);
        expect(todoService.getInnerTasks('Task 1')).toHaveLength(0);
    });

    test('loadTasks loads tasks from localStorage', () => {
        localStorage.setItem('allTasks', JSON.stringify([{ text: 'Loaded Task', check: false }]));
        localStorage.setItem('innerTasks', JSON.stringify([{ upperTaskText: 'Loaded Task', mainText: 'Loaded Inner Task', check: false }]));
        todoService.loadTasks();
        expect(todoService.getAllTasks()).toHaveLength(1);
        expect(todoService.getInnerTasks('Loaded Task')).toHaveLength(1);
    });
});

// Run the tests
describe('TodoService', () => {
    // ... (previous test cases remain the same)
});