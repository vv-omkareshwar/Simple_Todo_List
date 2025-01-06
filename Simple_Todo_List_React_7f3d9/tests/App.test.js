// Mock implementations
const React = {
  useState: jest.fn(),
  useEffect: jest.fn(),
};

const localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

// Mock components
jest.mock('./components/TodoList', () => {
  return function MockTodoList() {
    return <div data-testid="todo-list"></div>;
  };
});

// Actual implementation
function App() {
  const [allTasks, setAllTasks] = React.useState([]);
  const [innerTasks, setInnerTasks] = React.useState([]);
  const [mainInput, setMainInput] = React.useState('');

  React.useEffect(() => {
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

// Test suite
describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    React.useState.mockImplementation(jest.requireActual('react').useState);
    React.useEffect.mockImplementation(jest.requireActual('react').useEffect);
  });

  it('should load tasks from localStorage on mount', () => {
    const mockAllTasks = [{ text: 'Task 1', check: false }];
    const mockInnerTasks = [{ upperTaskText: 'Task 1', mainText: 'Subtask 1', check: false }];
    
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'allTasks') return JSON.stringify(mockAllTasks);
      if (key === 'innerTasks') return JSON.stringify(mockInnerTasks);
      return null;
    });

    const { getByText } = render(<App />);
    
    expect(localStorage.getItem).toHaveBeenCalledWith('allTasks');
    expect(localStorage.getItem).toHaveBeenCalledWith('innerTasks');
    expect(getByText('Todo List')).toBeInTheDocument();
  });

  it('should add a new task', () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    const input = getByPlaceholderText('Add a new task');
    const addButton = getByText('Add Task');

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(addButton);

    expect(localStorage.setItem).toHaveBeenCalledWith('allTasks', JSON.stringify([{ text: 'New Task', check: false }]));
  });

  it('should delete all tasks', () => {
    const { getByText } = render(<App />);
    const deleteAllButton = getByText('Delete All');

    fireEvent.click(deleteAllButton);

    expect(localStorage.removeItem).toHaveBeenCalledWith('allTasks');
    expect(localStorage.removeItem).toHaveBeenCalledWith('innerTasks');
  });
});

// Helper function to simulate React's rendering
function render(component) {
  let container = document.createElement('div');
  ReactDOM.render(component, container);
  return {
    getByText: (text) => container.querySelector(`*:not(script):not(style):contains('${text}')`),
    getByPlaceholderText: (text) => container.querySelector(`input[placeholder='${text}']`),
  };
}

// Helper function to simulate events
function fireEvent(element, eventName, options = {}) {
  const event = new Event(eventName, { bubbles: true, cancelable: true, ...options });
  element.dispatchEvent(event);
}

// Run the tests
describe('App Component', () => {
  // ... (previous test cases)
});