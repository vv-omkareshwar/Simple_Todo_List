import React from 'react';

const TodoItem = ({ task, onDelete, onToggle, onAddInnerTask }) => {
  const [innerTaskText, setInnerTaskText] = React.useState('');

  const handleInnerTaskSubmit = (e) => {
    e.preventDefault();
    if (innerTaskText.trim() !== '') {
      onAddInnerTask(task.text, innerTaskText);
      setInnerTaskText('');
    }
  };

  return (
    <li className={`list-group-item ${task.check ? 'line-through' : ''}`}>
      <div className="d-flex justify-content-between align-items-center">
        <span onClick={() => onToggle(task.text)}>{task.text}</span>
        <div>
          <button className="btn btn-sm btn-outline-success mr-2" onClick={() => onToggle(task.text)}>
            <i className="fas fa-check"></i>
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(task.text)}>
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div className="collapse" id={`collapse${task.id}`}>
        <ul className="list-group list-group-flush mt-2">
          {task.innerTasks && task.innerTasks.map((innerTask, index) => (
            <li key={index} className={`list-group-item ${innerTask.check ? 'line-through' : ''}`}>
              <div className="d-flex justify-content-between align-items-center">
                <span onClick={() => onToggle(task.text, innerTask.text)}>{innerTask.text}</span>
                <div>
                  <button className="btn btn-sm btn-outline-success mr-2" onClick={() => onToggle(task.text, innerTask.text)}>
                    <i className="fas fa-check"></i>
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(task.text, innerTask.text)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
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

export default TodoItem;