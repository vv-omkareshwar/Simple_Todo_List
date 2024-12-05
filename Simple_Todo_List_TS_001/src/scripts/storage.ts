// storage.ts

interface Task {
    text: string;
    check: boolean;
}

interface InnerTask {
    upperTaskText: string;
    mainText: string;
    check: boolean;
}

class Storage {
    private static instance: Storage;
    private constructor() {}

    public static getInstance(): Storage {
        if (!Storage.instance) {
            Storage.instance = new Storage();
        }
        return Storage.instance;
    }

    public loadMainTasks(): Task[] {
        let allTasks: Task[] = [];
        if (localStorage.getItem("allTasks") === null) {
            localStorage.setItem("allTasks", JSON.stringify(allTasks));
        } else {
            allTasks = JSON.parse(localStorage.getItem("allTasks") || "[]");
        }
        return allTasks;
    }

    public loadInnerTasks(): InnerTask[] {
        let innerTasks: InnerTask[] = [];
        if (localStorage.getItem("innerTasks") === null) {
            localStorage.setItem("innerTasks", JSON.stringify(innerTasks));
        } else {
            innerTasks = JSON.parse(localStorage.getItem("innerTasks") || "[]");
        }
        return innerTasks;
    }

    public saveMainTask(text: string, index: number): void {
        if (index === -1) {
            localStorage.removeItem("allTasks");
            this.loadMainTasks();
        } else if (index === 0) {
            const tmp: Task[] = JSON.parse(localStorage.getItem("allTasks") || "[]");
            const c = tmp.findIndex(item => item.text === text);
            if (c !== -1) {
                tmp.splice(c, 1);
                localStorage.setItem("allTasks", JSON.stringify(tmp));
            }

            // Delete inner tasks whose upper text matches
            const innerTasks: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");
            const updatedInnerTasks = innerTasks.filter(item => item.upperTaskText !== text);
            localStorage.setItem("innerTasks", JSON.stringify(updatedInnerTasks));
        } else if (index === 1) {
            const tmp: Task[] = JSON.parse(localStorage.getItem("allTasks") || "[]");
            tmp.push({ text: text, check: false });
            localStorage.setItem("allTasks", JSON.stringify(tmp));
        }
    }

    public saveInnerTask(item: InnerTask | string, index: number, upperText: string = ""): void {
        if (index === -1) {
            localStorage.removeItem("innerTasks");
            this.loadInnerTasks();
        } else if (index === 0) {
            const tmp: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");
            const c = tmp.findIndex(e => e.mainText === item && e.upperTaskText === upperText);
            if (c !== -1) {
                tmp.splice(c, 1);
                localStorage.setItem("innerTasks", JSON.stringify(tmp));
            }
        } else if (index === 1) {
            const tmp: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");
            if (typeof item === "object") {
                tmp.push(item);
                localStorage.setItem("innerTasks", JSON.stringify(tmp));
            }
        }
    }

    public updateTaskCheck(text: string, isChecked: boolean): void {
        const tmp: Task[] = JSON.parse(localStorage.getItem("allTasks") || "[]");
        const taskIndex = tmp.findIndex(item => item.text === text);
        if (taskIndex !== -1) {
            tmp[taskIndex].check = isChecked;
            localStorage.setItem("allTasks", JSON.stringify(tmp));
        }
    }

    public updateInnerTaskCheck(upperText: string, mainText: string, isChecked: boolean): void {
        const tmp: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");
        const taskIndex = tmp.findIndex(item => item.upperTaskText === upperText && item.mainText === mainText);
        if (taskIndex !== -1) {
            tmp[taskIndex].check = isChecked;
            localStorage.setItem("innerTasks", JSON.stringify(tmp));
        }
    }
}

export default Storage;