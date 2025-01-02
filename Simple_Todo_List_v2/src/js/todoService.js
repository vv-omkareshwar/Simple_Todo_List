// TodoService.js

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

export default TodoService;