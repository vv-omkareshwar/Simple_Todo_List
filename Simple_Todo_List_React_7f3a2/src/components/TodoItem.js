import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TodoItem = ({ task, onDelete, onToggle, onAddInnerTask }) => {
  const [innerTaskText, setInnerTaskText] = useState('');

  const handleInnerTaskSubmit = (e) => {
    e.preventDefault();
    if (innerTaskText.trim() !== '') {
      onAddInnerTask(task.id, innerTaskText);
      setInnerTaskText('');
    }
  };

  return (
    <li className="list-group-item">
      <div className="d-flex justify-content-between align-items-center">
        <span 
          className={`flex-grow-1 ${task.check ? 'text-decoration-line-through' : ''}`}
          onClick={() => onToggle(task.id)}
        >
          {task.text}
        </span>
        <button 
          className="btn btn-danger btn-sm ms-2"
          onClick={() => onDelete(task.id)}
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
      <div className="mt-2">
        <form onSubmit={handleInnerTaskSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Add inner task"
              value={innerTaskText}
              onChange={(e) => setInnerTaskText(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="submit">
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </form>
      </div>
      {task.innerTasks && task.innerTasks.length > 0 && (
        <ul className="list-group mt-2">
          {task.innerTasks.map((innerTask) => (
            <li key={innerTask.id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <span 
                  className={innerTask.check ? 'text-decoration-line-through' : ''}
                  onClick={() => onToggle(task.id, innerTask.id)}
                >
                  {innerTask.text}
                </span>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(task.id, innerTask.id)}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

TodoItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    check: PropTypes.bool.isRequired,
    innerTasks: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      check: PropTypes.bool.isRequired,
    })),
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onAddInnerTask: PropTypes.func.isRequired,
};

export default TodoItem;