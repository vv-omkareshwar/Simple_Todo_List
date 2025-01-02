// todoService.js

class TodoService {
    constructor() {
        this.allTasks = [];
        this.innerTasks = [];
        this.count = 1; // for identical collapse id
    }

    init() {
        this.loadTasks();
        this.loadInnerTasks();
    }

    createNewTask(text, check = false) {
        const newTask = { id: this.count++, text, check };
        this.allTasks.push(newTask);
        this.saveTasks();
        return newTask;
    }

    addNewItem(taskText) {
        if (taskText === "") return null;

        const existingTask = this.allTasks.find(task => task.text === taskText);
        if (existingTask) {
            throw new Error("Task Already Added");
        }

        return this.createNewTask(taskText);
    }

    addInnerTask(upperTaskId, mainText, check = false) {
        const newInnerTask = { upperTaskId, mainText, check };
        this.innerTasks.push(newInnerTask);
        this.saveInnerTasks();
        return newInnerTask;
    }

    deleteTask(taskId) {
        const taskIndex = this.allTasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.allTasks.splice(taskIndex, 1);
            this.saveTasks();

            // Remove associated inner tasks
            this.innerTasks = this.innerTasks.filter(innerTask => innerTask.upperTaskId !== taskId);
            this.saveInnerTasks();
        }
    }

    deleteInnerTask(upperTaskId, mainText) {
        this.innerTasks = this.innerTasks.filter(
            task => !(task.upperTaskId === upperTaskId && task.mainText === mainText)
        );
        this.saveInnerTasks();
    }

    toggleTaskCheck(taskId) {
        const task = this.allTasks.find(task => task.id === taskId);
        if (task) {
            task.check = !task.check;
            this.saveTasks();
        }
    }

    toggleInnerTaskCheck(upperTaskId, mainText) {
        const innerTask = this.innerTasks.find(
            task => task.upperTaskId === upperTaskId && task.mainText === mainText
        );
        if (innerTask) {
            innerTask.check = !innerTask.check;
            this.saveInnerTasks();
        }
    }

    deleteAllTasks() {
        this.allTasks = [];
        this.innerTasks = [];
        this.saveTasks();
        this.saveInnerTasks();
    }

    loadTasks() {
        const storedTasks = localStorage.getItem('allTasks');
        this.allTasks = storedTasks ? JSON.parse(storedTasks) : [];
    }

    loadInnerTasks() {
        const storedInnerTasks = localStorage.getItem('innerTasks');
        this.innerTasks = storedInnerTasks ? JSON.parse(storedInnerTasks) : [];
    }

    saveTasks() {
        localStorage.setItem('allTasks', JSON.stringify(this.allTasks));
    }

    saveInnerTasks() {
        localStorage.setItem('innerTasks', JSON.stringify(this.innerTasks));
    }

    getAllTasks() {
        return this.allTasks;
    }

    getInnerTasks(upperTaskId) {
        return this.innerTasks.filter(task => task.upperTaskId === upperTaskId);
    }
}

export default TodoService;