import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// Component implementation
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
    <li className={`list-group-item ${task.check ? 'line-through' : ''}`} data-testid="todo-item">
      <div className="d-flex justify-content-between align-items-center">
        <span onClick={() => onToggle(task.text)} data-testid="task-text">{task.text}</span>
        <div>
          <button className="btn btn-sm btn-outline-success mr-2" onClick={() => onToggle(task.text)} data-testid="toggle-button">
            <i className="fas fa-check"></i>
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(task.text)} data-testid="delete-button">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div className="collapse" id={`collapse${task.id}`}>
        <ul className="list-group list-group-flush mt-2">
          {task.innerTasks && task.innerTasks.map((innerTask, index) => (
            <li key={index} className={`list-group-item ${innerTask.check ? 'line-through' : ''}`} data-testid={`inner-task-${index}`}>
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
              data-testid="inner-task-input"
            />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="submit" data-testid="add-inner-task-button">
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </li>
  );
};

// Test suite
describe('TodoItem Component', () => {
  const mockTask = {
    id: 1,
    text: 'Test Task',
    check: false,
    innerTasks: [
      { text: 'Inner Task 1', check: false },
      { text: 'Inner Task 2', check: true }
    ]
  };

  const mockOnDelete = jest.fn();
  const mockOnToggle = jest.fn();
  const mockOnAddInnerTask = jest.fn();

  beforeEach(() => {
    render(
      <TodoItem
        task={mockTask}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onAddInnerTask={mockOnAddInnerTask}
      />
    );
  });

  it('renders the task text', () => {
    expect(screen.getByTestId('task-text')).toHaveTextContent('Test Task');
  });

  it('applies line-through class when task is checked', () => {
    const checkedTask = { ...mockTask, check: true };
    render(
      <TodoItem
        task={checkedTask}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onAddInnerTask={mockOnAddInnerTask}
      />
    );
    expect(screen.getByTestId('todo-item')).toHaveClass('line-through');
  });

  it('calls onToggle when task text is clicked', () => {
    fireEvent.click(screen.getByTestId('task-text'));
    expect(mockOnToggle).toHaveBeenCalledWith('Test Task');
  });

  it('calls onDelete when delete button is clicked', () => {
    fireEvent.click(screen.getByTestId('delete-button'));
    expect(mockOnDelete).toHaveBeenCalledWith('Test Task');
  });

  it('renders inner tasks', () => {
    expect(screen.getByTestId('inner-task-0')).toHaveTextContent('Inner Task 1');
    expect(screen.getByTestId('inner-task-1')).toHaveTextContent('Inner Task 2');
  });

  it('applies line-through class to checked inner tasks', () => {
    expect(screen.getByTestId('inner-task-1')).toHaveClass('line-through');
  });

  it('allows adding new inner tasks', () => {
    const input = screen.getByTestId('inner-task-input');
    const addButton = screen.getByTestId('add-inner-task-button');

    fireEvent.change(input, { target: { value: 'New Inner Task' } });
    fireEvent.click(addButton);

    expect(mockOnAddInnerTask).toHaveBeenCalledWith('Test Task', 'New Inner Task');
    expect(input).toHaveValue('');
  });

  it('does not add empty inner tasks', () => {
    const addButton = screen.getByTestId('add-inner-task-button');

    fireEvent.click(addButton);

    expect(mockOnAddInnerTask).not.toHaveBeenCalled();
  });
});

// Run the tests
test('Run all tests', () => {
  // This is a placeholder to ensure all tests are run
});