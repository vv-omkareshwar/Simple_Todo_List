// Mock React and ReactDOM
const React = {
  useState: jest.fn(),
  createElement: jest.fn()
};

const ReactDOM = {
  render: jest.fn()
};

// Mock PropTypes
const PropTypes = {
  shape: jest.fn(),
  string: jest.fn(),
  bool: jest.fn(),
  func: jest.fn(),
  arrayOf: jest.fn()
};

// Mock component implementation
function TodoItem({ task, onDelete, onToggle, onAddInnerTask }) {
  const [innerTaskText, setInnerTaskText] = React.useState('');

  const handleInnerTaskSubmit = (e) => {
    e.preventDefault();
    if (innerTaskText.trim() !== '') {
      onAddInnerTask(task.id, innerTaskText);
      setInnerTaskText('');
    }
  };

  return React.createElement('li', { className: 'list-group-item' },
    React.createElement('div', { className: 'd-flex justify-content-between align-items-center' },
      React.createElement('span', {
        className: `flex-grow-1 ${task.check ? 'text-decoration-line-through' : ''}`,
        onClick: () => onToggle(task.id)
      }, task.text),
      React.createElement('button', {
        className: 'btn btn-danger btn-sm ms-2',
        onClick: () => onDelete(task.id)
      }, React.createElement('i', { className: 'fas fa-trash-alt' }))
    ),
    React.createElement('div', { className: 'mt-2' },
      React.createElement('form', { onSubmit: handleInnerTaskSubmit },
        React.createElement('div', { className: 'input-group' },
          React.createElement('input', {
            type: 'text',
            className: 'form-control',
            placeholder: 'Add inner task',
            value: innerTaskText,
            onChange: (e) => setInnerTaskText(e.target.value)
          }),
          React.createElement('button', { className: 'btn btn-outline-secondary', type: 'submit' },
            React.createElement('i', { className: 'fas fa-plus' })
          )
        )
      )
    ),
    task.innerTasks && task.innerTasks.length > 0 &&
    React.createElement('ul', { className: 'list-group mt-2' },
      task.innerTasks.map((innerTask) =>
        React.createElement('li', { key: innerTask.id, className: 'list-group-item' },
          React.createElement('div', { className: 'd-flex justify-content-between align-items-center' },
            React.createElement('span', {
              className: innerTask.check ? 'text-decoration-line-through' : '',
              onClick: () => onToggle(task.id, innerTask.id)
            }, innerTask.text),
            React.createElement('button', {
              className: 'btn btn-danger btn-sm',
              onClick: () => onDelete(task.id, innerTask.id)
            }, React.createElement('i', { className: 'fas fa-trash-alt' }))
          )
        )
      )
    )
  );
}

// Mock data
const mockTask = {
  id: '1',
  text: 'Test Task',
  check: false,
  innerTasks: [
    { id: '1-1', text: 'Inner Task 1', check: false },
    { id: '1-2', text: 'Inner Task 2', check: true }
  ]
};

// Test suite
describe('TodoItem Component', () => {
  let props;

  beforeEach(() => {
    props = {
      task: mockTask,
      onDelete: jest.fn(),
      onToggle: jest.fn(),
      onAddInnerTask: jest.fn()
    };

    React.useState.mockImplementation((initialValue) => [initialValue, jest.fn()]);
  });

  test('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(React.createElement(TodoItem, props), div);
  });

  test('calls onToggle when task is clicked', () => {
    const { task, onToggle } = props;
    const component = React.createElement(TodoItem, props);
    const span = component.props.children[0].props.children[0];
    span.props.onClick();
    expect(onToggle).toHaveBeenCalledWith(task.id);
  });

  test('calls onDelete when delete button is clicked', () => {
    const { task, onDelete } = props;
    const component = React.createElement(TodoItem, props);
    const deleteButton = component.props.children[0].props.children[1];
    deleteButton.props.onClick();
    expect(onDelete).toHaveBeenCalledWith(task.id);
  });

  test('adds inner task when form is submitted', () => {
    const { task, onAddInnerTask } = props;
    const component = React.createElement(TodoItem, props);
    const form = component.props.children[1].props.children;
    const mockEvent = { preventDefault: jest.fn() };
    React.useState.mockReturnValueOnce(['New Inner Task', jest.fn()]);
    form.props.onSubmit(mockEvent);
    expect(onAddInnerTask).toHaveBeenCalledWith(task.id, 'New Inner Task');
  });

  test('renders inner tasks', () => {
    const component = React.createElement(TodoItem, props);
    const innerTasksList = component.props.children[2];
    expect(innerTasksList).toBeTruthy();
    expect(innerTasksList.props.children.length).toBe(mockTask.innerTasks.length);
  });
});

// Run tests
test.run();