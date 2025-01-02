// todoService.js

class TodoService {
    constructor() {
        this.allTasks = [];
        this.innerTasks = [];
        this.count = 1; // for identical collapse id
    }

    loadFromLocalStorage() {
        this.allTasks = JSON.parse(localStorage.getItem('allTasks')) || [];
        this.innerTasks = JSON.parse(localStorage.getItem('innerTasks')) || [];
    }

    saveToLocalStorage() {
        localStorage.setItem('allTasks', JSON.stringify(this.allTasks));
        localStorage.setItem('innerTasks', JSON.stringify(this.innerTasks));
    }

    addTask(taskText) {
        if (taskText && !this.allTasks.some(task => task.text === taskText)) {
            this.allTasks.push({ text: taskText, check: false });
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    removeTask(taskText) {
        const index = this.allTasks.findIndex(task => task.text === taskText);
        if (index !== -1) {
            this.allTasks.splice(index, 1);
            this.innerTasks = this.innerTasks.filter(task => task.upperTaskText !== taskText);
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    toggleTaskCheck(taskText) {
        const task = this.allTasks.find(task => task.text === taskText);
        if (task) {
            task.check = !task.check;
            this.saveToLocalStorage();
            return task.check;
        }
        return null;
    }

    addInnerTask(upperText, mainText) {
        if (mainText && !this.innerTasks.some(task => task.upperTaskText === upperText && task.mainText === mainText)) {
            this.innerTasks.push({ upperTaskText: upperText, mainText: mainText, check: false });
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    removeInnerTask(upperText, mainText) {
        const index = this.innerTasks.findIndex(task => task.upperTaskText === upperText && task.mainText === mainText);
        if (index !== -1) {
            this.innerTasks.splice(index, 1);
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    toggleInnerTaskCheck(upperText, mainText) {
        const task = this.innerTasks.find(task => task.upperTaskText === upperText && task.mainText === mainText);
        if (task) {
            task.check = !task.check;
            this.saveToLocalStorage();
            return task.check;
        }
        return null;
    }

    deleteAllTasks() {
        this.allTasks = [];
        this.innerTasks = [];
        this.saveToLocalStorage();
    }

    getNextCollapseId() {
        return `collapse${this.count++}`;
    }
}

export default TodoService;