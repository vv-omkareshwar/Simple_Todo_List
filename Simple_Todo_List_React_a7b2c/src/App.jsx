import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import { loadTasks, saveTasks, loadInnerTasks, saveInnerTasks } from './utils/localStorage';

function App() {
  const [allTasks, setAllTasks] = useState([]);
  const [innerTasks, setInnerTasks] = useState([]);

  useEffect(() => {
    const loadedTasks = loadTasks();
    const loadedInnerTasks = loadInnerTasks();
    setAllTasks(loadedTasks);
    setInnerTasks(loadedInnerTasks);
  }, []);

  const addNewTask = (taskText) => {
    if (taskText.trim() !== '') {
      const taskExists = allTasks.some(task => task.text === taskText);
      if (!taskExists) {
        const newTask = { text: taskText, check: false };
        setAllTasks(prevTasks => {
          const updatedTasks = [...prevTasks, newTask];
          saveTasks(updatedTasks);
          return updatedTasks;
        });
      } else {
        alert("Task Already Added");
      }
    }
  };

  const deleteTask = (taskText) => {
    setAllTasks(prevTasks => {
      const updatedTasks = prevTasks.filter(task => task.text !== taskText);
      saveTasks(updatedTasks);
      return updatedTasks;
    });

    setInnerTasks(prevInnerTasks => {
      const updatedInnerTasks = prevInnerTasks.filter(task => task.upperTaskText !== taskText);
      saveInnerTasks(updatedInnerTasks);
      return updatedInnerTasks;
    });
  };

  const toggleTaskCheck = (taskText) => {
    setAllTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.text === taskText ? { ...task, check: !task.check } : task
      );
      saveTasks(updatedTasks);
      return updatedTasks;
    });
  };

  const addInnerTask = (upperText, innerText) => {
    if (innerText.trim() !== '') {
      const taskExists = innerTasks.some(task => 
        task.upperTaskText === upperText && task.mainText === innerText
      );
      if (!taskExists) {
        setInnerTasks(prevInnerTasks => {
          const newInnerTask = { upperTaskText: upperText, mainText: innerText, check: false };
          const updatedInnerTasks = [...prevInnerTasks, newInnerTask];
          saveInnerTasks(updatedInnerTasks);
          return updatedInnerTasks;
        });
      } else {
        alert("Inner Task Already Added");
      }
    }
  };

  const deleteInnerTask = (upperText, innerText) => {
    setInnerTasks(prevInnerTasks => {
      const updatedInnerTasks = prevInnerTasks.filter(
        task => !(task.upperTaskText === upperText && task.mainText === innerText)
      );
      saveInnerTasks(updatedInnerTasks);
      return updatedInnerTasks;
    });
  };

  const toggleInnerTaskCheck = (upperText, innerText) => {
    setInnerTasks(prevInnerTasks => {
      const updatedInnerTasks = prevInnerTasks.map(task =>
        task.upperTaskText === upperText && task.mainText === innerText
          ? { ...task, check: !task.check }
          : task
      );
      saveInnerTasks(updatedInnerTasks);
      return updatedInnerTasks;
    });
  };

  const deleteAllTasks = () => {
    setAllTasks([]);
    setInnerTasks([]);
    saveTasks([]);
    saveInnerTasks([]);
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <TodoForm addNewTask={addNewTask} />
      <TodoList
        allTasks={allTasks}
        innerTasks={innerTasks}
        deleteTask={deleteTask}
        toggleTaskCheck={toggleTaskCheck}
        addInnerTask={addInnerTask}
        deleteInnerTask={deleteInnerTask}
        toggleInnerTaskCheck={toggleInnerTaskCheck}
      />
      <button onClick={deleteAllTasks}>Delete All Tasks</button>
    </div>
  );
}

export default App;