import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  const [allTasks, setAllTasks] = useState([]);
  const [innerTasks, setInnerTasks] = useState([]);

  useEffect(() => {
    loadLS();
    loadInnerTasks();
  }, []);

  const loadLS = () => {
    const storedTasks = JSON.parse(localStorage.getItem('allTasks')) || [];
    setAllTasks(storedTasks);
  };

  const loadInnerTasks = () => {
    const storedInnerTasks = JSON.parse(localStorage.getItem('innerTasks')) || [];
    setInnerTasks(storedInnerTasks);
  };

  const saveLS = (text, index) => {
    let updatedTasks = [...allTasks];
    if (index === -1) {
      updatedTasks = [];
    } else if (index === 0) {
      updatedTasks = updatedTasks.filter(task => task.text !== text);
    } else if (index === 1) {
      updatedTasks.push({ text, check: false });
    }
    localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
    setAllTasks(updatedTasks);
  };

  const saveInnerTasks = (item, index, upperText = '') => {
    let updatedInnerTasks = [...innerTasks];
    if (index === -1) {
      updatedInnerTasks = [];
    } else if (index === 0) {
      updatedInnerTasks = updatedInnerTasks.filter(
        task => !(task.mainText === item && task.upperTaskText === upperText)
      );
    } else if (index === 1) {
      updatedInnerTasks.push(item);
    }
    localStorage.setItem('innerTasks', JSON.stringify(updatedInnerTasks));
    setInnerTasks(updatedInnerTasks);
  };

  const addNewItem = (taskText) => {
    if (taskText && !allTasks.some(task => task.text === taskText)) {
      saveLS(taskText, 1);
    }
  };

  const deleteAll = () => {
    saveLS('', -1);
    saveInnerTasks('', -1);
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <TodoList
        allTasks={allTasks}
        innerTasks={innerTasks}
        addNewItem={addNewItem}
        saveLS={saveLS}
        saveInnerTasks={saveInnerTasks}
        deleteAll={deleteAll}
      />
    </div>
  );
}

export default App;