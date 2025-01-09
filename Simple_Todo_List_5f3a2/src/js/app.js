// State management
let allTasks = [];
let innerTasks = [];
let count = 1; // for identical collapse id

// DOM element references
const upperLi = document.getElementById("upperLi");
const innerLi = document.getElementById("innerLi");
const mainForm = document.getElementById("addingForm");
const mainInput = mainForm.children[0];
const mainList = document.getElementById("mainList");
const delAll = document.getElementById("delAll");

// Initialize the application
const init = () => {
    eventListeners();
    loadLS();
    loadInnerTasks();
};

// Event listeners setup
const eventListeners = () => {
    mainForm.addEventListener("submit", addNewItem);
    mainList.addEventListener("click", taskStufs);
    delAll.addEventListener("click", deleteAll);
};

// Create new task
const createNewTask = (text, check = false) => {
    const newLi = upperLi.cloneNode(true);
    newLi.classList.remove("d-none");
    newLi.removeAttribute("id");

    newLi.children[0].setAttribute("href", `#collapse${count}`);
    newLi.children[0].classList.toggle("line-throught", check);
    newLi.children[0].innerText = text;
    newLi.children[3].setAttribute("id", `collapse${count}`);

    mainList.children[0].appendChild(newLi);

    count++;
    mainInput.value = "";
};

// Add new item
const addNewItem = (e) => {
    e.preventDefault();
    const taskText = mainInput.value.trim();

    if (taskText) {
        allTasks = JSON.parse(localStorage.getItem("allTasks") || "[]");
        const taskExists = allTasks.some(item => item.text === taskText);

        if (taskExists) {
            alert("Task Already Added");
        } else {
            createNewTask(taskText);
            saveLS(taskText, 1);
        }
    }
};

// Add inner task
const addInnerTask = (upperText, mainText, check = false) => {
    const tempLi = innerLi.cloneNode(true);
    tempLi.removeAttribute("id");

    tempLi.childNodes.forEach((item, index) => {
        if (index === 3 || index === 5) {
            item.classList.remove("d-none");
        }
    });

    tempLi.children[0].innerText = mainText;
    tempLi.children[0].classList.toggle("line-throught", check);

    const tempList = Array.from(mainList.children[0].children)
        .find(child => child.children[0].innerText === upperText);

    if (tempList) {
        const insertionPoint = tempList.lastElementChild.firstElementChild.firstElementChild;
        insertionPoint.insertBefore(tempLi, insertionPoint.lastElementChild);
    }
};

// Task operations (delete, check, add inner task)
const taskStufs = (e) => {
    e.preventDefault();
    const target = e.target;

    if (target.classList.contains("delete-item")) {
        handleDeleteItem(target);
    } else if (target.classList.contains("delete-inner-item")) {
        handleDeleteInnerItem(target);
    } else if (target.classList.contains("check")) {
        handleCheckItem(target);
    } else if (target.classList.contains("inner-check")) {
        handleInnerCheckItem(target);
    } else if (target.classList.contains("btn-add-inner-task") || target.classList.contains("i-add-inner-task")) {
        handleAddInnerTask(target);
    }
};

// Handle delete item
const handleDeleteItem = (target) => {
    const text = target.parentElement.children[0].innerText;
    saveLS(text, 0);

    const tempInnerList = JSON.parse(localStorage.getItem("innerTasks") || "[]");
    tempInnerList.forEach(item => {
        if (text === item.upperTaskText) {
            saveInnerTasks(item.mainText, 0, text);
        }
    });

    target.parentElement.remove();
};

// Handle delete inner item
const handleDeleteInnerItem = (target) => {
    const upperText = target.closest('.collapse').parentElement.children[0].innerText;
    saveInnerTasks(target.parentElement.children[0].innerText, 0, upperText);
    target.parentElement.remove();
};

// Handle check item
const handleCheckItem = (target) => {
    const tmpList = JSON.parse(localStorage.getItem("allTasks") || "[]");
    const textElement = target.parentElement.children[0];
    const text = textElement.innerText;
    const isChecked = textElement.classList.toggle("line-throught");

    const updatedList = tmpList.map(item => 
        item.text === text ? { ...item, check: isChecked } : item
    );

    localStorage.setItem("allTasks", JSON.stringify(updatedList));
};

// Handle inner check item
const handleInnerCheckItem = (target) => {
    const tmp = JSON.parse(localStorage.getItem("innerTasks") || "[]");
    const textElement = target.parentElement.children[0];
    const mainText = textElement.innerText;
    const upperText = target.closest('.collapse').parentElement.children[0].innerText;
    const isChecked = textElement.classList.toggle("line-throught");

    const updatedInnerTasks = tmp.map(item => 
        (item.mainText === mainText && item.upperTaskText === upperText) 
            ? { ...item, check: isChecked } 
            : item
    );

    localStorage.setItem("innerTasks", JSON.stringify(updatedInnerTasks));
};

// Handle add inner task
const handleAddInnerTask = (target) => {
    const inputElement = target.classList.contains("btn-add-inner-task") 
        ? target.parentElement.childNodes[1] 
        : target.parentElement.parentElement.childNodes[1];

    const text = inputElement.value.trim();
    if (!text) return;

    const upperText = target.closest('.collapse').parentElement.children[0].innerText;
    
    innerTasks = JSON.parse(localStorage.getItem("innerTasks") || "[]");
    const taskExists = innerTasks.some(item => item.mainText === text && item.upperTaskText === upperText);

    if (taskExists) {
        alert("Task Already Added");
    } else {
        const newInnerTask = { upperTaskText: upperText, mainText: text, check: false };
        addInnerTask(upperText, text);
        saveInnerTasks(newInnerTask, 1);
    }

    inputElement.value = "";
};

// Delete all tasks
const deleteAll = (e) => {
    e.preventDefault();
    const list = e.target.closest('.card-body').querySelector('ul');
    while (list.children.length > 1) {
        list.lastElementChild.remove();
    }
    saveLS("", -1);
    saveInnerTasks("", -1);
};

// Load main tasks from localStorage
const loadLS = () => {
    allTasks = JSON.parse(localStorage.getItem("allTasks") || "[]");
    allTasks.forEach(item => {
        if (item.text) {
            createNewTask(item.text, item.check);
        }
    });
};

// Load inner tasks from localStorage
const loadInnerTasks = () => {
    innerTasks = JSON.parse(localStorage.getItem("innerTasks") || "[]");
    innerTasks.forEach(item => {
        if (item.mainText) {
            addInnerTask(item.upperTaskText, item.mainText, item.check);
        }
    });
};

// Save main tasks to localStorage
const saveLS = (text, index) => {
    if (index === -1) {
        localStorage.removeItem("allTasks");
        allTasks = [];
        loadLS();
    } else if (index === 0) {
        allTasks = allTasks.filter(item => item.text !== text);
        localStorage.setItem("allTasks", JSON.stringify(allTasks));
        
        // Delete associated inner tasks
        innerTasks = innerTasks.filter(item => item.upperTaskText !== text);
        localStorage.setItem("innerTasks", JSON.stringify(innerTasks));
    } else if (index === 1) {
        allTasks.push({ text, check: false });
        localStorage.setItem("allTasks", JSON.stringify(allTasks));
    }
};

// Save inner tasks to localStorage
const saveInnerTasks = (item, index, upperText = "") => {
    if (index === -1) {
        localStorage.removeItem("innerTasks");
        innerTasks = [];
        loadInnerTasks();
    } else if (index === 0) {
        innerTasks = innerTasks.filter(e => !(e.mainText === item && e.upperTaskText === upperText));
        localStorage.setItem("innerTasks", JSON.stringify(innerTasks));
    } else if (index === 1) {
        innerTasks.push(item);
        localStorage.setItem("innerTasks", JSON.stringify(innerTasks));
    }
};

// Initialize the application
init();