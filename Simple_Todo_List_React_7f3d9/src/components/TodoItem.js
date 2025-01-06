import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const TodoItem = ({ task, onDelete, onToggle, onAddInnerTask }) => {
  const [innerTasks, setInnerTasks] = useState([]);
  const [newInnerTask, setNewInnerTask] = useState('');

  useEffect(() => {
    loadInnerTasks();
  }, []);

  const loadInnerTasks = () => {
    const storedInnerTasks = JSON.parse(localStorage.getItem('innerTasks')) || [];
    const relevantInnerTasks = storedInnerTasks.filter(
      (innerTask) => innerTask.upperTaskText === task.text
    );
    setInnerTasks(relevantInnerTasks);
  };

  const handleAddInnerTask = (e) => {
    e.preventDefault();
    if (newInnerTask.trim() !== '') {
      const newInnerTaskObj = {
        upperTaskText: task.text,
        mainText: newInnerTask,
        check: false,
      };
      onAddInnerTask(newInnerTaskObj);
      setInnerTasks([...innerTasks, newInnerTaskObj]);
      setNewInnerTask('');
    }
  };

  const handleToggleInnerTask = (innerTask) => {
    const updatedInnerTasks = innerTasks.map((item) =>
      item.mainText === innerTask.mainText
        ? { ...item, check: !item.check }
        : item
    );
    setInnerTasks(updatedInnerTasks);
    // Update localStorage
    const allInnerTasks = JSON.parse(localStorage.getItem('innerTasks')) || [];
    const updatedAllInnerTasks = allInnerTasks.map((item) =>
      item.mainText === innerTask.mainText && item.upperTaskText === task.text
        ? { ...item, check: !item.check }
        : item
    );
    localStorage.setItem('innerTasks', JSON.stringify(updatedAllInnerTasks));
  };

  const handleDeleteInnerTask = (innerTask) => {
    const updatedInnerTasks = innerTasks.filter(
      (item) => item.mainText !== innerTask.mainText
    );
    setInnerTasks(updatedInnerTasks);
    // Update localStorage
    const allInnerTasks = JSON.parse(localStorage.getItem('innerTasks')) || [];
    const updatedAllInnerTasks = allInnerTasks.filter(
      (item) =>
        !(item.mainText === innerTask.mainText && item.upperTaskText === task.text)
    );
    localStorage.setItem('innerTasks', JSON.stringify(updatedAllInnerTasks));
  };

  return (
    <li className={`list-group-item ${task.check ? 'line-through' : ''}`}>
      <div className="d-flex justify-content-between align-items-center">
        <span onClick={() => onToggle(task)}>{task.text}</span>
        <div>
          <button className="btn btn-sm btn-outline-success mr-2" onClick={() => onToggle(task)}>
            <i className="fas fa-check"></i>
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(task)}>
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div className="mt-2">
        <ul className="list-group">
          {innerTasks.map((innerTask, index) => (
            <li key={index} className={`list-group-item ${innerTask.check ? 'line-through' : ''}`}>
              <div className="d-flex justify-content-between align-items-center">
                <span onClick={() => handleToggleInnerTask(innerTask)}>{innerTask.mainText}</span>
                <div>
                  <button
                    className="btn btn-sm btn-outline-success mr-2"
                    onClick={() => handleToggleInnerTask(innerTask)}
                  >
                    <i className="fas fa-check"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteInnerTask(innerTask)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleAddInnerTask} className="mt-2">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Add inner task"
            value={newInnerTask}
            onChange={(e) => setNewInnerTask(e.target.value)}
          />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="submit">
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </form>
    </li>
  );
};

TodoItem.propTypes = {
  task: PropTypes.shape({
    text: PropTypes.string.isRequired,
    check: PropTypes.bool.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onAddInnerTask: PropTypes.func.isRequired,
};

export default TodoItem;