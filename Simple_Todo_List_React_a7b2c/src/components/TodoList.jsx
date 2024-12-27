import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import { loadFromLS, saveToLS, loadInnerTasks, saveInnerTasks } from '../utils/localStorage';

const TodoList = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [innerTasks, setInnerTasks] = useState([]);

  useEffect(() => {
    loadTasks();
    loadInnerTasksData();
  }, []);

  const loadTasks = () => {
    const loadedTasks = loadFromLS('allTasks') || [];
    setAllTasks(loadedTasks);
  };

  const loadInnerTasksData = () => {
    const loadedInnerTasks = loadInnerTasks() || [];
    setInnerTasks(loadedInnerTasks);
  };

  const addNewTask = (taskText) => {
    if (taskText.trim() !== '') {
      const taskExists = allTasks.some(task => task.text === taskText);
      if (!taskExists) {
        const newTask = { text: taskText, check: false };
        setAllTasks(prevTasks => {
          const updatedTasks = [...prevTasks, newTask];
          saveToLS('allTasks', updatedTasks);
          return updatedTasks;
        });
      } else {
        alert('Task Already Added');
      }
    }
  };

  const toggleTaskCheck = (taskText) => {
    setAllTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => 
        task.text === taskText ? { ...task, check: !task.check } : task
      );
      saveToLS('allTasks', updatedTasks);
      return updatedTasks;
    });
  };

  const deleteTask = (taskText) => {
    setAllTasks(prevTasks => {
      const updatedTasks = prevTasks.filter(task => task.text !== taskText);
      saveToLS('allTasks', updatedTasks);
      return updatedTasks;
    });

    setInnerTasks(prevInnerTasks => {
      const updatedInnerTasks = prevInnerTasks.filter(task => task.upperTaskText !== taskText);
      saveInnerTasks(updatedInnerTasks);
      return updatedInnerTasks;
    });
  };

  const addInnerTask = (upperText, mainText) => {
    const newInnerTask = { upperTaskText: upperText, mainText: mainText, check: false };
    setInnerTasks(prevInnerTasks => {
      const updatedInnerTasks = [...prevInnerTasks, newInnerTask];
      saveInnerTasks(updatedInnerTasks);
      return updatedInnerTasks;
    });
  };

  const toggleInnerTaskCheck = (upperText, mainText) => {
    setInnerTasks(prevInnerTasks => {
      const updatedInnerTasks = prevInnerTasks.map(task => 
        (task.upperTaskText === upperText && task.mainText === mainText)
          ? { ...task, check: !task.check }
          : task
      );
      saveInnerTasks(updatedInnerTasks);
      return updatedInnerTasks;
    });
  };

  const deleteInnerTask = (upperText, mainText) => {
    setInnerTasks(prevInnerTasks => {
      const updatedInnerTasks = prevInnerTasks.filter(
        task => !(task.upperTaskText === upperText && task.mainText === mainText)
      );
      saveInnerTasks(updatedInnerTasks);
      return updatedInnerTasks;
    });
  };

  const deleteAllTasks = () => {
    setAllTasks([]);
    setInnerTasks([]);
    saveToLS('allTasks', []);
    saveInnerTasks([]);
  };

  return (
    <div>
      <TodoForm onAddTask={addNewTask} />
      <ul id="mainList">
        {allTasks.map((task, index) => (
          <TodoItem
            key={index}
            task={task}
            innerTasks={innerTasks.filter(innerTask => innerTask.upperTaskText === task.text)}
            onToggleCheck={() => toggleTaskCheck(task.text)}
            onDelete={() => deleteTask(task.text)}
            onAddInnerTask={(mainText) => addInnerTask(task.text, mainText)}
            onToggleInnerCheck={(mainText) => toggleInnerTaskCheck(task.text, mainText)}
            onDeleteInnerTask={(mainText) => deleteInnerTask(task.text, mainText)}
          />
        ))}
      </ul>
      <button id="delAll" onClick={deleteAllTasks}>Delete All</button>
    </div>
  );
};

export default TodoList;