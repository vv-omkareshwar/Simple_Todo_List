import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TodoItem = ({ task, onDelete, onToggle, onAddInnerTask }) => {
  const [innerTaskText, setInnerTaskText] = useState('');

  const handleInnerTaskSubmit = (e) => {
    e.preventDefault();
    if (innerTaskText.trim()) {
      onAddInnerTask(task.text, innerTaskText);
      setInnerTaskText('');
    }
  };

  return (
    <li className="list-group-item">
      <div className="d-flex justify-content-between align-items-center">
        <span 
          className={`flex-grow-1 ${task.check ? 'text-decoration-line-through' : ''}`}
          onClick={() => onToggle(task.text)}
        >
          {task.text}
        </span>
        <button 
          className="btn btn-danger btn-sm ml-2"
          onClick={() => onDelete(task.text)}
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
      <div className="collapse mt-2" id={`collapse${task.id}`}>
        <ul className="list-group">
          {task.innerTasks && task.innerTasks.map((innerTask, index) => (
            <li key={index} className="list-group-item">
              <span 
                className={innerTask.check ? 'text-decoration-line-through' : ''}
                onClick={() => onToggle(task.text, innerTask.text)}
              >
                {innerTask.text}
              </span>
              <button 
                className="btn btn-danger btn-sm float-right"
                onClick={() => onDelete(task.text, innerTask.text)}
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={handleInnerTaskSubmit} className="mt-2">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Add inner task"
              value={innerTaskText}
              onChange={(e) => setInnerTaskText(e.target.value)}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="submit">
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </li>
  );
};

TodoItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    check: PropTypes.bool.isRequired,
    innerTasks: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      check: PropTypes.bool.isRequired,
    })),
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onAddInnerTask: PropTypes.func.isRequired,
};

export default TodoItem;