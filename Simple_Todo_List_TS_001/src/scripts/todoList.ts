// todoList.ts

interface Task {
    text: string;
    check: boolean;
}

interface InnerTask {
    upperTaskText: string;
    mainText: string;
    check: boolean;
}

let allTasks: Task[] = [];
let innerTasks: InnerTask[] = [];

let count = 1; // for identical collapse id
const upperLi = document.getElementById("upperLi") as HTMLLIElement;
const innerLi = document.getElementById("innerLi") as HTMLLIElement;
const mainForm = document.getElementById("addingForm") as HTMLFormElement;
const mainInput = (mainForm.children[0] as HTMLInputElement);
const mainList = document.getElementById("mainList") as HTMLUListElement;
const delAll = document.getElementById("delAll") as HTMLButtonElement;

eventListeners();
loadLS();
loadInnerTasks();

// all Listeners
function eventListeners(): void {
    // submit event
    mainForm.addEventListener("submit", addNewItem);

    // task stufs
    mainList.addEventListener("click", taskStufs);

    // delete all tasks
    delAll.addEventListener("click", deleteAll);
}

// to create new task
function createNewTask(text: string, check: boolean = false): void {
    // to clone upper visible li in html page
    const newLi = upperLi.cloneNode(true) as HTMLLIElement;
    // making visible the new li
    newLi.classList.remove("d-none");
    // removing id
    newLi.setAttribute("id", "");

    const anchor = newLi.children[0] as HTMLAnchorElement;
    anchor.setAttribute("href", `#collapse${count}`); // identical colapseId

    anchor.classList.remove("line-throught");

    anchor.innerText = text;
    if (check) {
        anchor.classList.add("line-throught");
    } else {
        anchor.classList.remove("line-throught");
    }
    (newLi.children[3] as HTMLElement).setAttribute("id", `collapse${count}`);

    mainList.children[0].appendChild(newLi);

    count++; // for different value of collapseId
    mainInput.value = "";
}

// add New Task
function addNewItem(e: Event): void {
    e.preventDefault();
    // entered text
    const taskText = mainInput.value;

    if (taskText !== "") {
        allTasks = JSON.parse(localStorage.getItem("allTasks") || "[]");
        let c = false;
        allTasks.forEach(function (item) {
            if (item.text == taskText) {
                c = true;
                alert("Task Already Added");
            }
        });
        if (c == false) {
            createNewTask(taskText);
            saveLS(taskText, 1);
        }
    }
}

// to add Inner Tasks
function addInnerTask(upperText: string, mainText: string, check: boolean = false): void {
    // to clone inner visible li from html page
    let tempLi = innerLi.cloneNode(true) as HTMLLIElement;
    tempLi.setAttribute("id", "");

    // making visible check and delete icons.
    tempLi.childNodes.forEach(function (item, index) {
        if (index == 3 || index == 5) {
            (item as HTMLElement).classList.remove("d-none");
        }
    });
    // to add the value to new li text
    (tempLi.children[0] as HTMLElement).innerText = mainText;

    // check
    if (check) {
        (tempLi.children[0] as HTMLElement).classList.add("line-throught");
    } else {
        (tempLi.children[0] as HTMLElement).classList.remove("line-throught");
    }

    // adding new inner task to last of the list before form
    let tempList: HTMLElement | null = null;
    for (let i = 1; i < mainList.children[0].children.length; i++) {
        if (upperText == (mainList.children[0].children[i].children[0] as HTMLElement).innerText) {
            tempList = mainList.children[0].children[i] as HTMLElement;
            break;
        }
    }

    // adding inner to upper
    if (tempList) {
        tempList.lastElementChild?.firstElementChild?.firstElementChild?.insertBefore(
            tempLi,
            tempList.lastElementChild.firstElementChild.firstElementChild.lastElementChild
        );
    }
}

// delete and check a task - add new inner task
function taskStufs(e: Event): void {
    e.preventDefault();
    const target = e.target as HTMLElement;
    // delete item
    if (target.classList.contains("delete-item")) {
        // remove LS
        const text = (target.parentElement?.children[0] as HTMLElement).innerText;
        saveLS(text, 0);

        // remove inner tasks of it
        let tempInnerList: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");

        tempInnerList.forEach(function (item) {
            if (text == item.upperTaskText) {
                saveInnerTasks(item.mainText, 0, text);
            }
        });

        // remove from page
        target.parentElement?.remove();

        // to check an inner task
    } else if (target.classList.contains("delete-inner-item")) {
        const upperText = (target.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[0] as HTMLElement).innerText;
        // removing LS
        saveInnerTasks((target.parentElement?.children[0] as HTMLElement).innerText, 0, upperText);

        // Removing Page
        target.parentElement?.remove();
    } else if (target.classList.contains("check")) {
        let tmpList: Task[] = JSON.parse(localStorage.getItem("allTasks") || "[]");

        if (target.parentElement?.children[0].classList.contains("line-throught")) {
            for (let i = 0; i < tmpList.length; i++) {
                if (tmpList[i].text == (target.parentElement.children[0] as HTMLElement).innerText) {
                    tmpList[i].check = false;
                    localStorage.setItem("allTasks", JSON.stringify(tmpList));
                    break;
                }
            }

            target.parentElement.children[0].classList.remove("line-throught");
        } else {
            for (let i = 0; i < tmpList.length; i++) {
                if (tmpList[i].text == (target.parentElement?.children[0] as HTMLElement).innerText) {
                    tmpList[i].check = true;
                    localStorage.setItem("allTasks", JSON.stringify(tmpList));
                    break;
                }
            }

            target.parentElement?.children[0].classList.add("line-throught");
        }

        // adding inner task with button
    } else if (target.classList.contains("inner-check")) {
        let tmp: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");

        const upperText = (target.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[0] as HTMLElement).innerText;

        if (target.parentElement?.children[0].classList.contains("line-throught")) {
            tmp.forEach(function (item) {
                if (
                    item.mainText == (target.parentElement?.children[0] as HTMLElement).innerText &&
                    item.upperTaskText == upperText
                ) {
                    item.check = false;
                    localStorage.setItem("innerTasks", JSON.stringify(tmp));
                }
            });
            target.parentElement.children[0].classList.remove("line-throught");
        } else {
            tmp.forEach(function (item) {
                if (
                    item.mainText == (target.parentElement?.children[0] as HTMLElement).innerText &&
                    item.upperTaskText == upperText
                ) {
                    item.check = true;
                    localStorage.setItem("innerTasks", JSON.stringify(tmp));
                }
            });
            target.parentElement?.children[0].classList.add("line-throught");
        }
    } else if (target.classList.contains("btn-add-inner-task")) {
        // getting value of input
        const text = (target.parentElement?.childNodes[1] as HTMLInputElement).value;

        if (text != "") {
            innerTasks = JSON.parse(localStorage.getItem("innerTasks") || "[]");

            // getting upper text
            const upperText = (target.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[0] as HTMLElement).innerText;

            let c = true;
            innerTasks.forEach(function (item) {
                if (item.mainText == text && item.upperTaskText == upperText) {
                    c = false;
                    alert("Task Already Added");
                }
            });
            if (c == true) {
                // adding innerTask List
                innerTasks.push({
                    upperTaskText: upperText,
                    mainText: text,
                    check: false,
                });
                addInnerTask(upperText, text);
                saveInnerTasks(innerTasks[innerTasks.length - 1], 1);
            }
        }
        // clear input
        (target.parentElement?.childNodes[1] as HTMLInputElement).value = "";

        // adding inner task with i tag that in the button
        // same things with adding with btn
    } else if (target.classList.contains("i-add-inner-task")) {
        let text = (target.parentElement?.parentElement?.childNodes[1] as HTMLInputElement).value;

        if (text != "") {
            // getting upper text
            const upperText = (target.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[0] as HTMLElement).innerText;

            // adding innerTask List
            innerTasks.push({ upperTaskText: upperText, mainText: text, check: false });

            addInnerTask(upperText, text);
            saveInnerTasks(innerTasks[innerTasks.length - 1], 1);

            // clear input
            (target.parentElement?.parentElement?.childNodes[1] as HTMLInputElement).value = "";
        }
    }
}

// delete all
function deleteAll(e: Event): void {
    e.preventDefault();

    let list = (e.target as HTMLElement).parentElement?.parentElement?.children[1].children[0].childNodes[1].children;

    if (list) {
        while (list.length != 1) {
            // block the remove main invisible li in html
            list[list.length - 1].remove();
        }
    }
    saveLS("", -1);
    saveInnerTasks("", -1);
}

// loading Main Tasks
function loadLS(): void {
    if (localStorage.getItem("allTasks") === null) {
        localStorage.setItem("allTasks", JSON.stringify(allTasks));
    } else {
        allTasks = JSON.parse(localStorage.getItem("allTasks") || "[]");

        allTasks.forEach(function (item) {
            if (item.text != "") {
                createNewTask(item.text, item.check);
            }
        });
    }
}

// loading Inner Tasks
function loadInnerTasks(): void {
    if (localStorage.getItem("innerTasks") === null) {
        localStorage.setItem("innerTasks", JSON.stringify(innerTasks));
    } else {
        innerTasks = JSON.parse(localStorage.getItem("innerTasks") || "[]");

        innerTasks.forEach(function (item) {
            if (item.mainText != "") {
                addInnerTask(item.upperTaskText, item.mainText, item.check);
            }
        });
    }
}

// saving Main Tasks
function saveLS(text: string, index: number): void {
    // if index = 1 add, = 0 remove, =-1 remove all
    if (index == -1) {
        localStorage.removeItem("allTasks");
        allTasks.length = 0;
        loadLS();
    } else if (index == 0) {
        const tmp: Task[] = JSON.parse(localStorage.getItem("allTasks") || "[]");
        let c: number | undefined;
        tmp.forEach(function (item, ind) {
            if (item.text == text) c = ind;
        });
        if (c !== undefined) {
            tmp.splice(c, 1);
            localStorage.setItem("allTasks", JSON.stringify(tmp));
        }

        // delete inner tasks whose upper text that
        const tmp2: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");

        for (let i = 0; i < tmp2.length; i++) {
            if (tmp2[i].upperTaskText == text) {
                saveInnerTasks(tmp2[i].mainText, 0, text);
            }
        }
    } else if (index == 1) {
        const tmp: Task[] = JSON.parse(localStorage.getItem("allTasks") || "[]");
        tmp.push({ text: text, check: false });
        localStorage.setItem("allTasks", JSON.stringify(tmp));
    }
}

// saving Inner Tasks
function saveInnerTasks(item: string | InnerTask, index: number, upperText: string = ""): void {
    // if index = 1 add, = 0 remove, =-1 remove all, 2 check, =3 removeCheck
    if (index == -1) {
        localStorage.removeItem("innerTasks");
        innerTasks.length = 0;
        loadInnerTasks();
    } else if (index == 0) {
        const tmp: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");

        let cont = false;
        let c: number | undefined;
        tmp.forEach(function (e, ind) {
            if (typeof item === 'string' && e.mainText == item && e.upperTaskText == upperText) {
                c = ind;
                cont = true;
            }
        });
        if (cont && c !== undefined) {
            tmp.splice(c, 1);
            localStorage.setItem("innerTasks", JSON.stringify(tmp));
        }
    } else if (index == 1 && typeof item !== 'string') {
        const tmp: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");
        tmp.push(item);
        localStorage.setItem("innerTasks", JSON.stringify(tmp));
    }
}