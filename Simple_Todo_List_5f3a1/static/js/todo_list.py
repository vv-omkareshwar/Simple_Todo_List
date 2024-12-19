// Global variables
var allTasks = [];
var innerTasks = [];
var count = 1; // for identical collapse id

// Function declarations
function addEventListeners() {
    document.getElementById("addingForm").addEventListener("submit", addNewItem);
    document.getElementById("mainList").addEventListener("click", taskStuff);
    document.getElementById("delAll").addEventListener("click", deleteAll);
}

function createNewTask(text, check) {
    check = check || false;
    var newLi = document.getElementById("upperLi").cloneNode(true);
    newLi.classList.remove("d-none");
    newLi.id = "";
    newLi.children[0].href = "#collapse" + count;
    newLi.children[0].classList.remove("line-throught");
    newLi.children[0].textContent = text;
    if (check) {
        newLi.children[0].classList.add("line-throught");
    } else {
        newLi.children[0].classList.remove("line-throught");
    }
    newLi.children[3].id = "collapse" + count;
    document.getElementById("mainList").children[0].appendChild(newLi);
    count++;
    document.getElementById("addingForm").children[0].value = "";
}

function addNewItem(event) {
    event.preventDefault();
    var taskText = document.getElementById("addingForm").children[0].value;
    if (taskText) {
        allTasks = JSON.parse(localStorage.getItem("allTasks") || "[]");
        if (allTasks.some(function(item) { return item.text === taskText; })) {
            alert("Task Already Added");
        } else {
            createNewTask(taskText);
            saveLS(taskText, 1);
        }
    }
}

function addInnerTask(upperText, mainText, check) {
    check = check || false;
    var tempLi = document.getElementById("innerLi").cloneNode(true);
    tempLi.id = "";
    [3, 5].forEach(function(index) { tempLi.childNodes[index].classList.remove("d-none"); });
    tempLi.children[0].textContent = mainText;
    if (check) {
        tempLi.children[0].classList.add("line-throught");
    } else {
        tempLi.children[0].classList.remove("line-throught");
    }
    
    var tempList = null;
    var mainList = document.getElementById("mainList").children[0].children;
    for (var i = 1; i < mainList.length; i++) {
        if (upperText === mainList[i].children[0].textContent) {
            tempList = mainList[i];
            break;
        }
    }
    
    tempList.lastElementChild.firstElementChild.firstElementChild.insertBefore(
        tempLi,
        tempList.lastElementChild.firstElementChild.firstElementChild.lastElementChild
    );
}

function taskStuff(event) {
    event.preventDefault();
    var target = event.target;
    
    if (target.classList.contains("delete-item")) {
        var text = target.parentElement.children[0].textContent;
        saveLS(text, 0);
        var tempInnerList = JSON.parse(localStorage.getItem("innerTasks") || "[]");
        tempInnerList.forEach(function(item) {
            if (text === item.upperTaskText) {
                saveInnerTasks(item.mainText, 0, text);
            }
        });
        target.parentElement.remove();
    } else if (target.classList.contains("delete-inner-item")) {
        var upperText = target.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].textContent;
        saveInnerTasks(target.parentElement.children[0].textContent, 0, upperText);
        target.parentElement.remove();
    } else if (target.classList.contains("check")) {
        var tmpList = JSON.parse(localStorage.getItem("allTasks") || "[]");
        if (target.parentElement.children[0].classList.contains("line-throught")) {
            tmpList.forEach(function(item) {
                if (item.text === target.parentElement.children[0].textContent) {
                    item.check = false;
                }
            });
            localStorage.setItem("allTasks", JSON.stringify(tmpList));
            target.parentElement.children[0].classList.remove("line-throught");
        } else {
            tmpList.forEach(function(item) {
                if (item.text === target.parentElement.children[0].textContent) {
                    item.check = true;
                }
            });
            localStorage.setItem("allTasks", JSON.stringify(tmpList));
            target.parentElement.children[0].classList.add("line-throught");
        }
    } else if (target.classList.contains("inner-check")) {
        var tmp = JSON.parse(localStorage.getItem("innerTasks") || "[]");
        var upperText = target.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].textContent;
        if (target.parentElement.children[0].classList.contains("line-throught")) {
            tmp.forEach(function(item) {
                if (item.mainText === target.parentElement.children[0].textContent && item.upperTaskText === upperText) {
                    item.check = false;
                }
            });
            localStorage.setItem("innerTasks", JSON.stringify(tmp));
            target.parentElement.children[0].classList.remove("line-throught");
        } else {
            tmp.forEach(function(item) {
                if (item.mainText === target.parentElement.children[0].textContent && item.upperTaskText === upperText) {
                    item.check = true;
                }
            });
            localStorage.setItem("innerTasks", JSON.stringify(tmp));
            target.parentElement.children[0].classList.add("line-throught");
        }
    } else if (target.classList.contains("btn-add-inner-task") || target.classList.contains("i-add-inner-task")) {
        var text, upperText;
        if (target.classList.contains("i-add-inner-task")) {
            text = target.parentElement.parentElement.childNodes[1].value;
            upperText = target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].textContent;
        } else {
            text = target.parentElement.childNodes[1].value;
            upperText = target.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].textContent;
        }
        
        if (text) {
            innerTasks = JSON.parse(localStorage.getItem("innerTasks") || "[]");
            if (innerTasks.some(function(item) { return item.mainText === text && item.upperTaskText === upperText; })) {
                alert("Task Already Added");
            } else {
                innerTasks.push({
                    upperTaskText: upperText,
                    mainText: text,
                    check: false
                });
                addInnerTask(upperText, text);
                saveInnerTasks(innerTasks[innerTasks.length - 1], 1);
            }
        }
        
        if (target.classList.contains("i-add-inner-task")) {
            target.parentElement.parentElement.childNodes[1].value = "";
        } else {
            target.parentElement.childNodes[1].value = "";
        }
    }
}

function deleteAll(event) {
    event.preventDefault();
    var listElement = event.target.parentElement.parentElement.children[1].children[0].childNodes[1];
    while (listElement.children.length > 1) {
        listElement.children[listElement.children.length - 1].remove();
    }
    saveLS("", -1);
    saveInnerTasks("", -1);
}

function loadLS() {
    if (localStorage.getItem("allTasks") === null) {
        localStorage.setItem("allTasks", JSON.stringify([]));
    } else {
        allTasks = JSON.parse(localStorage.getItem("allTasks"));
        allTasks.forEach(function(item) {
            if (item) {
                createNewTask(item.text, item.check);
            }
        });
    }
}

function loadInnerTasks() {
    if (localStorage.getItem("innerTasks") === null) {
        localStorage.setItem("innerTasks", JSON.stringify([]));
    } else {
        innerTasks = JSON.parse(localStorage.getItem("innerTasks"));
        innerTasks.forEach(function(item) {
            if (item.mainText) {
                addInnerTask(item.upperTaskText, item.mainText, item.check);
            }
        });
    }
}

function saveLS(text, index) {
    if (index === -1) {
        localStorage.removeItem("allTasks");
        allTasks = [];
        loadLS();
    } else if (index === 0) {
        var tmp = JSON.parse(localStorage.getItem("allTasks") || "[]");
        tmp = tmp.filter(function(item) { return item.text !== text; });
        localStorage.setItem("allTasks", JSON.stringify(tmp));
        var tmp2 = JSON.parse(localStorage.getItem("innerTasks") || "[]");
        tmp2.forEach(function(item) {
            if (item.upperTaskText === text) {
                saveInnerTasks(item, 0);
            }
        });
    } else if (index === 1) {
        var tmp = JSON.parse(localStorage.getItem("allTasks") || "[]");
        tmp.push({text: text, check: false});
        localStorage.setItem("allTasks", JSON.stringify(tmp));
    }
}

function saveInnerTasks(item, index, upperText) {
    upperText = upperText || "";
    if (index === -1) {
        localStorage.removeItem("innerTasks");
        innerTasks = [];
        loadInnerTasks();
    } else if (index === 0) {
        var tmp = JSON.parse(localStorage.getItem("innerTasks") || "[]");
        tmp = tmp.filter(function(e) { return !(e.mainText === item && e.upperTaskText === upperText); });
        localStorage.setItem("innerTasks", JSON.stringify(tmp));
    } else if (index === 1) {
        var tmp = JSON.parse(localStorage.getItem("innerTasks") || "[]");
        tmp.push(item);
        localStorage.setItem("innerTasks", JSON.stringify(tmp));
    }
}

function main() {
    addEventListeners();
    loadLS();
    loadInnerTasks();
}

// Run main function when DOM is loaded
document.addEventListener('DOMContentLoaded', main);