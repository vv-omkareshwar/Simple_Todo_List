// Mock React and other dependencies
const React = {
  useState: jest.fn(),
  useEffect: jest.fn()
};

const localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn()
};

// Mock TodoList component
const TodoList = jest.fn(() => null);

// Utility function to simulate React's useState
function useStateMock(initialValue) {
  let state = initialValue;
  const setState = jest.fn((newValue) => {
    state = typeof newValue === 'function' ? newValue(state) : newValue;
  });
  return [state, setState];
}

// Mock App component implementation
function App() {
  const [allTasks, setAllTasks] = useStateMock([]);
  const [innerTasks, setInnerTasks] = useStateMock([]);
  const [mainInput, setMainInput] = useStateMock('');

  React.useEffect.mockImplementation((callback) => {
    callback();
  });

  const loadLS = () => {
    const storedTasks = JSON.parse(localStorage.getItem('allTasks')) || [];
    setAllTasks(storedTasks);
  };

  const loadInnerTasks = () => {
    const storedInnerTasks = JSON.parse(localStorage.getItem('innerTasks')) || [];
    setInnerTasks(storedInnerTasks);
  };

  const saveLS = (text, index) => {
    let updatedTasks = [...allTasks];
    if (index === -1) {
      updatedTasks = [];
    } else if (index === 0) {
      updatedTasks = updatedTasks.filter(item => item.text !== text);
    } else if (index === 1) {
      updatedTasks.push({ text, check: false });
    }
    localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
    setAllTasks(updatedTasks);
  };

  const saveInnerTasks = (item, index, upperText = '') => {
    let updatedInnerTasks = [...innerTasks];
    if (index === -1) {
      updatedInnerTasks = [];
    } else if (index === 0) {
      updatedInnerTasks = updatedInnerTasks.filter(
        e => !(e.mainText === item && e.upperTaskText === upperText)
      );
    } else if (index === 1) {
      updatedInnerTasks.push(item);
    }
    localStorage.setItem('innerTasks', JSON.stringify(updatedInnerTasks));
    setInnerTasks(updatedInnerTasks);
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

  return {
    allTasks,
    innerTasks,
    mainInput,
    loadLS,
    loadInnerTasks,
    saveLS,
    saveInnerTasks,
    addNewItem,
    deleteAll,
    setMainInput
  };
}

// Test suite
describe('App Component', () => {
  let app;
  
  beforeEach(() => {
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
    app = App();
  });

  test('loadLS should load tasks from localStorage', () => {
    const mockTasks = [{ text: 'Task 1', check: false }];
    localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
    
    app.loadLS();
    
    expect(localStorage.getItem).toHaveBeenCalledWith('allTasks');
    expect(app.allTasks).toEqual(mockTasks);
  });

  test('loadInnerTasks should load inner tasks from localStorage', () => {
    const mockInnerTasks = [{ mainText: 'Inner Task 1', upperTaskText: 'Task 1' }];
    localStorage.getItem.mockReturnValue(JSON.stringify(mockInnerTasks));
    
    app.loadInnerTasks();
    
    expect(localStorage.getItem).toHaveBeenCalledWith('innerTasks');
    expect(app.innerTasks).toEqual(mockInnerTasks);
  });

  test('saveLS should add a new task', () => {
    app.saveLS('New Task', 1);
    
    expect(localStorage.setItem).toHaveBeenCalledWith('allTasks', JSON.stringify([{ text: 'New Task', check: false }]));
    expect(app.allTasks).toEqual([{ text: 'New Task', check: false }]);
  });

  test('saveInnerTasks should add a new inner task', () => {
    const newInnerTask = { mainText: 'New Inner Task', upperTaskText: 'Task 1' };
    app.saveInnerTasks(newInnerTask, 1);
    
    expect(localStorage.setItem).toHaveBeenCalledWith('innerTasks', JSON.stringify([newInnerTask]));
    expect(app.innerTasks).toEqual([newInnerTask]);
  });

  test('addNewItem should add a new task if it does not exist', () => {
    app.setMainInput('New Task');
    const mockEvent = { preventDefault: jest.fn() };
    
    app.addNewItem(mockEvent);
    
    expect(localStorage.setItem).toHaveBeenCalledWith('allTasks', JSON.stringify([{ text: 'New Task', check: false }]));
    expect(app.allTasks).toEqual([{ text: 'New Task', check: false }]);
    expect(app.mainInput).toBe('');
  });

  test('addNewItem should not add a task if it already exists', () => {
    app.allTasks = [{ text: 'Existing Task', check: false }];
    app.setMainInput('Existing Task');
    const mockEvent = { preventDefault: jest.fn() };
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    app.addNewItem(mockEvent);
    
    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(app.allTasks).toEqual([{ text: 'Existing Task', check: false }]);
    expect(alertMock).toHaveBeenCalledWith('Task Already Added');
    alertMock.mockRestore();
  });

  test('deleteAll should clear all tasks and inner tasks', () => {
    app.deleteAll();
    
    expect(localStorage.setItem).toHaveBeenCalledWith('allTasks', '[]');
    expect(localStorage.setItem).toHaveBeenCalledWith('innerTasks', '[]');
    expect(app.allTasks).toEqual([]);
    expect(app.innerTasks).toEqual([]);
  });
});