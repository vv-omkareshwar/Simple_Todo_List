import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  const [allTasks, setAllTasks] = useState([]);
  const [innerTasks, setInnerTasks] = useState([]);
  const [mainInput, setMainInput] = useState('');

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
      updatedTasks = updatedTasks.filter(item => item.text !== text);
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
        e => !(e.mainText === item && e.upperTaskText === upperText)
      );
    } else if (index === 1) {
      updatedInnerTasks.push(item);
    }
    localStorage.setItem('innerTasks', JSON.stringify(updatedInnerTasks));
    setInnerTasks(updatedInnerTasks);
  };

  const addNewItem = (e) => {
    e.preventDefault();
    if (mainInput !== '') {
      const taskExists = allTasks.some(item => item.text === mainInput);
      if (!taskExists) {
        saveLS(mainInput, 1);
        setMainInput('');
      } else {
        alert('Task Already Added');
      }
    }
  };

  const deleteAll = () => {
    saveLS('', -1);
    saveInnerTasks('', -1);
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <form onSubmit={addNewItem}>
        <input
          type="text"
          value={mainInput}
          onChange={(e) => setMainInput(e.target.value)}
          placeholder="Add a new task"
        />
        <button type="submit">Add Task</button>
      </form>
      <TodoList
        allTasks={allTasks}
        innerTasks={innerTasks}
        saveLS={saveLS}
        saveInnerTasks={saveInnerTasks}
      />
      <button onClick={deleteAll}>Delete All</button>
    </div>
  );
}

export default App;