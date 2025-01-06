// Mock React and other dependencies
const React = {
  useState: jest.fn(),
  useEffect: jest.fn(),
};

const PropTypes = {
  shape: jest.fn(),
  string: jest.fn(),
  bool: jest.fn(),
  func: jest.fn(),
  isRequired: { isRequired: true },
};

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    },
    removeItem: function(key) {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Import the component to be tested
const TodoItem = require('./TodoItem').default;

// Mock data
const mockTask = { text: 'Test Task', check: false };
const mockInnerTasks = [
  { upperTaskText: 'Test Task', mainText: 'Inner Task 1', check: false },
  { upperTaskText: 'Test Task', mainText: 'Inner Task 2', check: true },
];

// Mock functions
const mockSetState = jest.fn();
React.useState.mockImplementation(initialValue => [initialValue, mockSetState]);

const mockOnDelete = jest.fn();
const mockOnToggle = jest.fn();
const mockOnAddInnerTask = jest.fn();

// Test suite
describe('TodoItem Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should render the task text', () => {
    const { getByText } = render(<TodoItem task={mockTask} onDelete={mockOnDelete} onToggle={mockOnToggle} onAddInnerTask={mockOnAddInnerTask} />);
    expect(getByText('Test Task')).toBeInTheDocument();
  });

  it('should call onToggle when task is clicked', () => {
    const { getByText } = render(<TodoItem task={mockTask} onDelete={mockOnDelete} onToggle={mockOnToggle} onAddInnerTask={mockOnAddInnerTask} />);
    fireEvent.click(getByText('Test Task'));
    expect(mockOnToggle).toHaveBeenCalledWith(mockTask);
  });

  it('should call onDelete when delete button is clicked', () => {
    const { getByRole } = render(<TodoItem task={mockTask} onDelete={mockOnDelete} onToggle={mockOnToggle} onAddInnerTask={mockOnAddInnerTask} />);
    fireEvent.click(getByRole('button', { name: /trash/i }));
    expect(mockOnDelete).toHaveBeenCalledWith(mockTask);
  });

  it('should add inner task when form is submitted', () => {
    const { getByPlaceholderText, getByRole } = render(<TodoItem task={mockTask} onDelete={mockOnDelete} onToggle={mockOnToggle} onAddInnerTask={mockOnAddInnerTask} />);
    const input = getByPlaceholderText('Add inner task');
    fireEvent.change(input, { target: { value: 'New Inner Task' } });
    fireEvent.submit(getByRole('form'));
    expect(mockOnAddInnerTask).toHaveBeenCalledWith({
      upperTaskText: 'Test Task',
      mainText: 'New Inner Task',
      check: false,
    });
  });

  it('should toggle inner task when clicked', () => {
    localStorage.setItem('innerTasks', JSON.stringify(mockInnerTasks));
    const { getByText } = render(<TodoItem task={mockTask} onDelete={mockOnDelete} onToggle={mockOnToggle} onAddInnerTask={mockOnAddInnerTask} />);
    fireEvent.click(getByText('Inner Task 1'));
    const updatedInnerTasks = JSON.parse(localStorage.getItem('innerTasks'));
    expect(updatedInnerTasks[0].check).toBe(true);
  });

  it('should delete inner task when delete button is clicked', () => {
    localStorage.setItem('innerTasks', JSON.stringify(mockInnerTasks));
    const { getAllByRole } = render(<TodoItem task={mockTask} onDelete={mockOnDelete} onToggle={mockOnToggle} onAddInnerTask={mockOnAddInnerTask} />);
    const deleteButtons = getAllByRole('button', { name: /trash/i });
    fireEvent.click(deleteButtons[1]); // Click delete button of first inner task
    const updatedInnerTasks = JSON.parse(localStorage.getItem('innerTasks'));
    expect(updatedInnerTasks.length).toBe(1);
    expect(updatedInnerTasks[0].mainText).toBe('Inner Task 2');
  });
});

// Helper function to render components
function render(component) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(component, container);
  return {
    getByText: (text) => container.querySelector(`*:not(script):not(style):contains('${text}')`),
    getByRole: (role, options) => container.querySelector(`[role="${role}"]${options.name ? `:contains('${options.name}')` : ''}`),
    getByPlaceholderText: (placeholder) => container.querySelector(`input[placeholder="${placeholder}"]`),
    getAllByRole: (role) => container.querySelectorAll(`[role="${role}"]`),
  };
}

// Helper function to simulate events
function fireEvent(element, eventName, options = {}) {
  const event = new Event(eventName, { bubbles: true, cancelable: true, ...options });
  element.dispatchEvent(event);
}

// Run the tests
describe('TodoItem Component', () => {
  // ... (previous test cases)
});