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
    if (index === -1) {
      localStorage.removeItem('allTasks');
      setAllTasks([]);
    } else if (index === 0) {
      const updatedTasks = allTasks.filter(item => item.text !== text);
      localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
      setAllTasks(updatedTasks);

      // Delete inner tasks whose upper text matches
      const updatedInnerTasks = innerTasks.filter(item => item.upperTaskText !== text);
      saveInnerTasks(updatedInnerTasks, -2);
    } else if (index === 1) {
      const updatedTasks = [...allTasks, { text, check: false }];
      localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
      setAllTasks(updatedTasks);
    }
  };

  const saveInnerTasks = (item, index, upperText = '') => {
    if (index === -1) {
      localStorage.removeItem('innerTasks');
      setInnerTasks([]);
    } else if (index === 0) {
      const updatedInnerTasks = innerTasks.filter(
        e => !(e.mainText === item && e.upperTaskText === upperText)
      );
      localStorage.setItem('innerTasks', JSON.stringify(updatedInnerTasks));
      setInnerTasks(updatedInnerTasks);
    } else if (index === 1) {
      const updatedInnerTasks = [...innerTasks, item];
      localStorage.setItem('innerTasks', JSON.stringify(updatedInnerTasks));
      setInnerTasks(updatedInnerTasks);
    } else if (index === -2) {
      // For bulk update
      localStorage.setItem('innerTasks', JSON.stringify(item));
      setInnerTasks(item);
    }
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