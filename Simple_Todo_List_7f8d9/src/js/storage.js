// storage.js

class Storage {
  constructor() {
    this.allTasks = [];
    this.innerTasks = [];
  }

  // Load main tasks from localStorage
  loadMainTasks() {
    if (localStorage.getItem('allTasks') === null) {
      localStorage.setItem('allTasks', JSON.stringify(this.allTasks));
    } else {
      this.allTasks = JSON.parse(localStorage.getItem('allTasks'));
    }
    return this.allTasks;
  }

  // Load inner tasks from localStorage
  loadInnerTasks() {
    if (localStorage.getItem('innerTasks') === null) {
      localStorage.setItem('innerTasks', JSON.stringify(this.innerTasks));
    } else {
      this.innerTasks = JSON.parse(localStorage.getItem('innerTasks'));
    }
    return this.innerTasks;
  }

  // Save main tasks to localStorage
  saveMainTask(text, index) {
    if (index === -1) {
      localStorage.removeItem('allTasks');
      this.allTasks = [];
      this.loadMainTasks();
    } else if (index === 0) {
      const tasks = JSON.parse(localStorage.getItem('allTasks'));
      const taskIndex = tasks.findIndex(item => item.text === text);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        localStorage.setItem('allTasks', JSON.stringify(tasks));
        
        // Delete associated inner tasks
        const innerTasks = JSON.parse(localStorage.getItem('innerTasks'));
        const updatedInnerTasks = innerTasks.filter(item => item.upperTaskText !== text);
        localStorage.setItem('innerTasks', JSON.stringify(updatedInnerTasks));
      }
    } else if (index === 1) {
      const tasks = JSON.parse(localStorage.getItem('allTasks'));
      tasks.push({ text: text, check: false });
      localStorage.setItem('allTasks', JSON.stringify(tasks));
    }
  }

  // Save inner tasks to localStorage
  saveInnerTask(item, index, upperText = '') {
    if (index === -1) {
      localStorage.removeItem('innerTasks');
      this.innerTasks = [];
      this.loadInnerTasks();
    } else if (index === 0) {
      const tasks = JSON.parse(localStorage.getItem('innerTasks'));
      const taskIndex = tasks.findIndex(e => e.mainText === item && e.upperTaskText === upperText);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        localStorage.setItem('innerTasks', JSON.stringify(tasks));
      }
    } else if (index === 1) {
      const tasks = JSON.parse(localStorage.getItem('innerTasks'));
      tasks.push(item);
      localStorage.setItem('innerTasks', JSON.stringify(tasks));
    }
  }

  // Update task check status
  updateTaskCheck(text, isMainTask, upperText = '') {
    if (isMainTask) {
      const tasks = JSON.parse(localStorage.getItem('allTasks'));
      const task = tasks.find(item => item.text === text);
      if (task) {
        task.check = !task.check;
        localStorage.setItem('allTasks', JSON.stringify(tasks));
      }
    } else {
      const tasks = JSON.parse(localStorage.getItem('innerTasks'));
      const task = tasks.find(item => item.mainText === text && item.upperTaskText === upperText);
      if (task) {
        task.check = !task.check;
        localStorage.setItem('innerTasks', JSON.stringify(tasks));
      }
    }
  }
}

export default Storage;