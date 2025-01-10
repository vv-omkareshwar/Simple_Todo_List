// app.js

const TodoService = require('./todoService.js');

class TodoApp {
    constructor() {
        this.todoService = new TodoService();
        this.count = 1; // for identical collapse id
        this.upperLi = null;
        this.innerLi = null;
        this.mainForm = null;
        this.mainInput = null;
        this.mainList = null;
        this.delAll = null;

        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.upperLi = document.getElementById("upperLi");
            this.innerLi = document.getElementById("innerLi");
            this.mainForm = document.getElementById("addingForm");
            this.mainInput = this.mainForm.children[0];
            this.mainList = document.getElementById("mainList");
            this.delAll = document.getElementById("delAll");

            this.eventListeners();
            this.loadTasks();
        });
    }

    eventListeners() {
        this.mainForm.addEventListener("submit", this.addNewItem.bind(this));
        this.mainList.addEventListener("click", this.taskStuffs.bind(this));
        this.delAll.addEventListener("click", this.deleteAll.bind(this));
    }

    createNewTask(text, check) {
        const newLi = this.upperLi.cloneNode(true);
        newLi.classList.remove("d-none");
        newLi.setAttribute("id", "");
        newLi.children[0].setAttribute("href", `#collapse${this.count}`);
        newLi.children[0].classList.remove("line-through");
        newLi.children[0].innerText = text;
        
        if (check) {
            newLi.children[0].classList.add("line-through");
        }
        
        newLi.children[3].setAttribute("id", `collapse${this.count}`);
        this.mainList.children[0].appendChild(newLi);
        this.count++;
        this.mainInput.value = "";
    }

    addNewItem(e) {
        e.preventDefault();
        const taskText = this.mainInput.value.trim();
        if (taskText !== "") {
            if (!this.todoService.taskExists(taskText)) {
                this.createNewTask(taskText);
                this.todoService.addTask(taskText);
            } else {
                alert("Task Already Added");
            }
        }
    }

    addInnerTask(upperText, mainText, check) {
        let tempLi = this.innerLi.cloneNode(true);
        tempLi.setAttribute("id", "");
        tempLi.childNodes.forEach((item, index) => {
            if (index === 3 || index === 5) {
                item.classList.remove("d-none");
            }
        });
        tempLi.children[0].innerText = mainText;
        
        if (check) {
            tempLi.children[0].classList.add("line-through");
        }

        let tempList = Array.from(this.mainList.children[0].children)
            .find(child => child.children[0].innerText === upperText);

        if (tempList) {
            tempList.lastElementChild.firstElementChild.firstElementChild.insertBefore(
                tempLi,
                tempList.lastElementChild.firstElementChild.firstElementChild.lastElementChild
            );
        }
    }

    taskStuffs(e) {
        e.preventDefault();
        const target = e.target;

        if (target.classList.contains("delete-item")) {
            this.deleteTask(target);
        } else if (target.classList.contains("delete-inner-item")) {
            this.deleteInnerTask(target);
        } else if (target.classList.contains("check")) {
            this.toggleTaskCheck(target);
        } else if (target.classList.contains("inner-check")) {
            this.toggleInnerTaskCheck(target);
        } else if (target.classList.contains("btn-add-inner-task") || target.classList.contains("i-add-inner-task")) {
            this.addNewInnerTask(target);
        }
    }

    deleteTask(target) {
        const text = target.parentElement.children[0].innerText;
        this.todoService.removeTask(text);
        this.todoService.removeInnerTasksByUpperTask(text);
        target.parentElement.remove();
    }

    deleteInnerTask(target) {
        const upperText = target.closest('.collapse').parentElement.children[0].innerText;
        const innerText = target.parentElement.children[0].innerText;
        this.todoService.removeInnerTask(upperText, innerText);
        target.parentElement.remove();
    }

    toggleTaskCheck(target) {
        const taskText = target.parentElement.children[0].innerText;
        const isChecked = target.parentElement.children[0].classList.toggle("line-through");
        this.todoService.updateTaskCheck(taskText, isChecked);
    }

    toggleInnerTaskCheck(target) {
        const upperText = target.closest('.collapse').parentElement.children[0].innerText;
        const innerText = target.parentElement.children[0].innerText;
        const isChecked = target.parentElement.children[0].classList.toggle("line-through");
        this.todoService.updateInnerTaskCheck(upperText, innerText, isChecked);
    }

    addNewInnerTask(target) {
        const inputElement = target.classList.contains("btn-add-inner-task") 
            ? target.parentElement.childNodes[1] 
            : target.parentElement.parentElement.childNodes[1];
        
        const text = inputElement.value.trim();
        if (text !== "") {
            const upperText = target.closest('.collapse').parentElement.children[0].innerText;
            if (!this.todoService.innerTaskExists(upperText, text)) {
                this.addInnerTask(upperText, text, false);
                this.todoService.addInnerTask(upperText, text);
                inputElement.value = "";
            } else {
                alert("Task Already Added");
            }
        }
    }

    deleteAll(e) {
        e.preventDefault();
        const list = this.mainList.children[0].children;
        while (list.length > 1) {
            list[list.length - 1].remove();
        }
        this.todoService.clearAllTasks();
    }

    loadTasks() {
        const allTasks = this.todoService.getAllTasks();
        allTasks.forEach(task => {
            if (task.text !== "") {
                this.createNewTask(task.text, task.check);
            }
        });

        const innerTasks = this.todoService.getAllInnerTasks();
        innerTasks.forEach(task => {
            if (task.mainText !== "") {
                this.addInnerTask(task.upperTaskText, task.mainText, task.check);
            }
        });
    }
}

// Initialize the app
new TodoApp();

module.exports = TodoApp;