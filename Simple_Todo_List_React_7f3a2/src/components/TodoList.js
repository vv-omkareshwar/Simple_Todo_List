import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';

const TodoList = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [innerTasks, setInnerTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    loadTasks();
    loadInnerTasks();
  }, []);

  const loadTasks = () => {
    const storedTasks = JSON.parse(localStorage.getItem('allTasks')) || [];
    setAllTasks(storedTasks);
  };

  const loadInnerTasks = () => {
    const storedInnerTasks = JSON.parse(localStorage.getItem('innerTasks')) || [];
    setInnerTasks(storedInnerTasks);
  };

  const addNewTask = (e) => {
    e.preventDefault();
    if (newTaskText.trim() !== '') {
      const taskExists = allTasks.some(task => task.text === newTaskText);
      if (!taskExists) {
        const newTask = { text: newTaskText, check: false };
        setAllTasks([...allTasks, newTask]);
        localStorage.setItem('allTasks', JSON.stringify([...allTasks, newTask]));
        setNewTaskText('');
      } else {
        alert('Task Already Added');
      }
    }
  };

  const toggleTaskCheck = (taskText) => {
    const updatedTasks = allTasks.map(task => 
      task.text === taskText ? { ...task, check: !task.check } : task
    );
    setAllTasks(updatedTasks);
    localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
  };

  const deleteTask = (taskText) => {
    const updatedTasks = allTasks.filter(task => task.text !== taskText);
    setAllTasks(updatedTasks);
    localStorage.setItem('allTasks', JSON.stringify(updatedTasks));

    // Remove inner tasks associated with the deleted task
    const updatedInnerTasks = innerTasks.filter(task => task.upperTaskText !== taskText);
    setInnerTasks(updatedInnerTasks);
    localStorage.setItem('innerTasks', JSON.stringify(updatedInnerTasks));
  };

  const addInnerTask = (upperTaskText, innerTaskText) => {
    if (innerTaskText.trim() !== '') {
      const newInnerTask = { upperTaskText, mainText: innerTaskText, check: false };
      const updatedInnerTasks = [...innerTasks, newInnerTask];
      setInnerTasks(updatedInnerTasks);
      localStorage.setItem('innerTasks', JSON.stringify(updatedInnerTasks));
    }
  };

  const toggleInnerTaskCheck = (upperTaskText, innerTaskText) => {
    const updatedInnerTasks = innerTasks.map(task => 
      (task.upperTaskText === upperTaskText && task.mainText === innerTaskText)
        ? { ...task, check: !task.check }
        : task
    );
    setInnerTasks(updatedInnerTasks);
    localStorage.setItem('innerTasks', JSON.stringify(updatedInnerTasks));
  };

  const deleteInnerTask = (upperTaskText, innerTaskText) => {
    const updatedInnerTasks = innerTasks.filter(task => 
      !(task.upperTaskText === upperTaskText && task.mainText === innerTaskText)
    );
    setInnerTasks(updatedInnerTasks);
    localStorage.setItem('innerTasks', JSON.stringify(updatedInnerTasks));
  };

  const deleteAllTasks = () => {
    setAllTasks([]);
    setInnerTasks([]);
    localStorage.removeItem('allTasks');
    localStorage.removeItem('innerTasks');
  };

  return (
    <div>
      <form onSubmit={addNewTask}>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add new task"
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {allTasks.map((task, index) => (
          <TodoItem
            key={index}
            task={task}
            innerTasks={innerTasks.filter(innerTask => innerTask.upperTaskText === task.text)}
            onToggleCheck={() => toggleTaskCheck(task.text)}
            onDelete={() => deleteTask(task.text)}
            onAddInnerTask={(innerTaskText) => addInnerTask(task.text, innerTaskText)}
            onToggleInnerCheck={(innerTaskText) => toggleInnerTaskCheck(task.text, innerTaskText)}
            onDeleteInnerTask={(innerTaskText) => deleteInnerTask(task.text, innerTaskText)}
          />
        ))}
      </ul>
      <button onClick={deleteAllTasks}>Delete All</button>
    </div>
  );
};

export default TodoList;