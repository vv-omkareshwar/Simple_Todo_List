// todoService.js

/**
 * TodoService class to handle all todo-related operations
 */
class TodoService {
    constructor() {
        this.allTasks = [];
        this.innerTasks = [];
        this.count = 1; // for identical collapse id
    }

    /**
     * Initialize the service
     */
    init() {
        this.loadTasks();
        this.loadInnerTasks();
    }

    /**
     * Create a new task
     * @param {string} text - The task text
     * @param {boolean} check - Whether the task is checked
     * @returns {HTMLElement} - The newly created task element
     */
    createNewTask(text, check = false) {
        const newLi = document.createElement('li');
        newLi.classList.add('list-group-item');
        
        const link = document.createElement('a');
        link.setAttribute('href', `#collapse${this.count}`);
        link.classList.add('task-link');
        if (check) {
            link.classList.add('line-through');
        }
        link.innerText = text;
        
        const checkBtn = document.createElement('button');
        checkBtn.classList.add('btn', 'btn-success', 'btn-sm', 'float-right', 'check');
        checkBtn.innerHTML = '<i class="fas fa-check"></i>';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'float-right', 'delete-item');
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        
        const collapseDiv = document.createElement('div');
        collapseDiv.classList.add('collapse');
        collapseDiv.id = `collapse${this.count}`;
        
        newLi.appendChild(link);
        newLi.appendChild(deleteBtn);
        newLi.appendChild(checkBtn);
        newLi.appendChild(collapseDiv);
        
        this.count++;
        return newLi;
    }

    /**
     * Add a new task
     * @param {string} taskText - The task text
     * @returns {boolean} - Whether the task was added successfully
     */
    addNewTask(taskText) {
        if (taskText === '') return false;
        
        const existingTask = this.allTasks.find(task => task.text === taskText);
        if (existingTask) {
            console.warn('Task already exists');
            return false;
        }
        
        this.allTasks.push({ text: taskText, check: false });
        this.saveTasks();
        return true;
    }

    /**
     * Add an inner task
     * @param {string} upperText - The text of the parent task
     * @param {string} mainText - The text of the inner task
     * @param {boolean} check - Whether the inner task is checked
     * @returns {HTMLElement} - The newly created inner task element
     */
    addInnerTask(upperText, mainText, check = false) {
        const innerLi = document.createElement('li');
        innerLi.classList.add('list-group-item', 'inner-task');
        
        const taskText = document.createElement('span');
        taskText.innerText = mainText;
        if (check) {
            taskText.classList.add('line-through');
        }
        
        const checkBtn = document.createElement('button');
        checkBtn.classList.add('btn', 'btn-success', 'btn-sm', 'float-right', 'inner-check');
        checkBtn.innerHTML = '<i class="fas fa-check"></i>';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'float-right', 'delete-inner-item');
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        
        innerLi.appendChild(taskText);
        innerLi.appendChild(deleteBtn);
        innerLi.appendChild(checkBtn);
        
        this.innerTasks.push({ upperTaskText: upperText, mainText: mainText, check: check });
        this.saveInnerTasks();
        
        return innerLi;
    }

    /**
     * Toggle the check state of a task
     * @param {string} taskText - The text of the task to toggle
     * @param {boolean} isInnerTask - Whether it's an inner task
     * @param {string} upperText - The text of the parent task (for inner tasks)
     */
    toggleTaskCheck(taskText, isInnerTask = false, upperText = '') {
        if (isInnerTask) {
            const innerTask = this.innerTasks.find(task => task.mainText === taskText && task.upperTaskText === upperText);
            if (innerTask) {
                innerTask.check = !innerTask.check;
                this.saveInnerTasks();
            }
        } else {
            const task = this.allTasks.find(task => task.text === taskText);
            if (task) {
                task.check = !task.check;
                this.saveTasks();
            }
        }
    }

    /**
     * Delete a task
     * @param {string} taskText - The text of the task to delete
     * @param {boolean} isInnerTask - Whether it's an inner task
     * @param {string} upperText - The text of the parent task (for inner tasks)
     */
    deleteTask(taskText, isInnerTask = false, upperText = '') {
        if (isInnerTask) {
            this.innerTasks = this.innerTasks.filter(task => !(task.mainText === taskText && task.upperTaskText === upperText));
            this.saveInnerTasks();
        } else {
            this.allTasks = this.allTasks.filter(task => task.text !== taskText);
            this.innerTasks = this.innerTasks.filter(task => task.upperTaskText !== taskText);
            this.saveTasks();
            this.saveInnerTasks();
        }
    }

    /**
     * Delete all tasks
     */
    deleteAllTasks() {
        this.allTasks = [];
        this.innerTasks = [];
        this.saveTasks();
        this.saveInnerTasks();
    }

    /**
     * Load tasks from local storage
     */
    loadTasks() {
        const storedTasks = localStorage.getItem('allTasks');
        this.allTasks = storedTasks ? JSON.parse(storedTasks) : [];
    }

    /**
     * Load inner tasks from local storage
     */
    loadInnerTasks() {
        const storedInnerTasks = localStorage.getItem('innerTasks');
        this.innerTasks = storedInnerTasks ? JSON.parse(storedInnerTasks) : [];
    }

    /**
     * Save tasks to local storage
     */
    saveTasks() {
        localStorage.setItem('allTasks', JSON.stringify(this.allTasks));
    }

    /**
     * Save inner tasks to local storage
     */
    saveInnerTasks() {
        localStorage.setItem('innerTasks', JSON.stringify(this.innerTasks));
    }
}

export default TodoService;