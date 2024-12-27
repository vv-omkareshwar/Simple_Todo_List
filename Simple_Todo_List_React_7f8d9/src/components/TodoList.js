import React, { useState, useEffect } from 'react';

const TodoList = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [innerTasks, setInnerTasks] = useState([]);
  const [count, setCount] = useState(1);
  const [mainInput, setMainInput] = useState('');

  useEffect(() => {
    loadLS();
    loadInnerTasks();
  }, []);

  const createNewTask = (text, check = false) => {
    const newTask = {
      id: count,
      text,
      check,
      innerTasks: []
    };
    setAllTasks(prevTasks => [...prevTasks, newTask]);
    setCount(prevCount => prevCount + 1);
  };

  const addNewItem = (e) => {
    e.preventDefault();
    if (mainInput !== '') {
      const taskExists = allTasks.some(task => task.text === mainInput);
      if (!taskExists) {
        createNewTask(mainInput);
        saveLS(mainInput, 1);
        setMainInput('');
      } else {
        alert("Task Already Added");
      }
    }
  };

  const addInnerTask = (upperTaskId, mainText, check = false) => {
    setAllTasks(prevTasks => prevTasks.map(task => {
      if (task.id === upperTaskId) {
        return {
          ...task,
          innerTasks: [...task.innerTasks, { text: mainText, check }]
        };
      }
      return task;
    }));
    saveInnerTasks({ upperTaskId, mainText, check }, 1);
  };

  const taskStufs = (e, taskId) => {
    e.preventDefault();
    if (e.target.classList.contains("delete-item")) {
      deleteTask(taskId);
    } else if (e.target.classList.contains("check")) {
      toggleTaskCheck(taskId);
    } else if (e.target.classList.contains("btn-add-inner-task")) {
      const text = e.target.previousSibling.value;
      if (text !== '') {
        addInnerTask(taskId, text);
        e.target.previousSibling.value = '';
      }
    }
  };

  const deleteTask = (taskId) => {
    const taskToDelete = allTasks.find(task => task.id === taskId);
    if (taskToDelete) {
      saveLS(taskToDelete.text, 0);
      taskToDelete.innerTasks.forEach(innerTask => {
        saveInnerTasks(innerTask.text, 0, taskToDelete.text);
      });
      setAllTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    }
  };

  const toggleTaskCheck = (taskId) => {
    setAllTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        const newCheck = !task.check;
        saveLS(task.text, newCheck ? 2 : 3);
        return { ...task, check: newCheck };
      }
      return task;
    }));
  };

  const deleteAll = () => {
    setAllTasks([]);
    setInnerTasks([]);
    saveLS("", -1);
    saveInnerTasks("", -1);
  };

  const loadLS = () => {
    const storedTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
    setAllTasks(storedTasks);
  };

  const loadInnerTasks = () => {
    const storedInnerTasks = JSON.parse(localStorage.getItem("innerTasks")) || [];
    setInnerTasks(storedInnerTasks);
  };

  const saveLS = (text, index) => {
    let tasks = [...allTasks];
    if (index === -1) {
      localStorage.removeItem("allTasks");
      setAllTasks([]);
    } else if (index === 0) {
      tasks = tasks.filter(task => task.text !== text);
    } else if (index === 1) {
      tasks.push({ text, check: false });
    } else if (index === 2 || index === 3) {
      tasks = tasks.map(task => 
        task.text === text ? { ...task, check: index === 2 } : task
      );
    }
    localStorage.setItem("allTasks", JSON.stringify(tasks));
    setAllTasks(tasks);
  };

  const saveInnerTasks = (item, index, upperText = "") => {
    let tasks = [...innerTasks];
    if (index === -1) {
      localStorage.removeItem("innerTasks");
      setInnerTasks([]);
    } else if (index === 0) {
      tasks = tasks.filter(task => 
        !(task.mainText === item && task.upperTaskText === upperText)
      );
    } else if (index === 1) {
      tasks.push(item);
    }
    localStorage.setItem("innerTasks", JSON.stringify(tasks));
    setInnerTasks(tasks);
  };

  return (
    <div>
      <form onSubmit={addNewItem}>
        <input 
          type="text" 
          value={mainInput}
          onChange={(e) => setMainInput(e.target.value)}
          placeholder="Add new task"
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {allTasks.map(task => (
          <li key={task.id}>
            <span className={task.check ? "line-through" : ""}>{task.text}</span>
            <button onClick={(e) => taskStufs(e, task.id)} className="check">
              {task.check ? "Uncheck" : "Check"}
            </button>
            <button onClick={(e) => taskStufs(e, task.id)} className="delete-item">
              Delete
            </button>
            <ul>
              {task.innerTasks.map((innerTask, index) => (
                <li key={index}>
                  <span className={innerTask.check ? "line-through" : ""}>
                    {innerTask.text}
                  </span>
                </li>
              ))}
            </ul>
            <input type="text" placeholder="Add inner task" />
            <button onClick={(e) => taskStufs(e, task.id)} className="btn-add-inner-task">
              Add Inner Task
            </button>
          </li>
        ))}
      </ul>
      <button onClick={deleteAll}>Delete All</button>
    </div>
  );
};

export default TodoList;