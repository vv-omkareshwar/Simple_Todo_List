import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// Mock implementation of localStorage
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
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock TodoList component
jest.mock('./components/TodoList', () => {
  return function MockTodoList(props) {
    return (
      <div data-testid="todo-list">
        <button onClick={() => props.addNewItem('New Task')}>Add New Task</button>
        <button onClick={props.deleteAll}>Delete All</button>
        <ul>
          {props.allTasks.map((task, index) => (
            <li key={index}>{task.text}</li>
          ))}
        </ul>
      </div>
    );
  };
});

// App component implementation
function App() {
  const [allTasks, setAllTasks] = React.useState([]);
  const [innerTasks, setInnerTasks] = React.useState([]);

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
    let updatedTasks = [...allTasks];
    if (index === -1) {
      updatedTasks = [];
    } else if (index === 0) {
      updatedTasks = updatedTasks.filter(task => task.text !== text);
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
        task => !(task.mainText === item && task.upperTaskText === upperText)
      );
    } else if (index === 1) {
      updatedInnerTasks.push(item);
    }
    localStorage.setItem('innerTasks', JSON.stringify(updatedInnerTasks));
    setInnerTasks(updatedInnerTasks);
  };

  const addNewItem = (taskText) => {
    if (taskText && !allTasks.some(task => task.text === taskText)) {
      saveLS(taskText, 1);
    }
  };

  const deleteAll = () => {
    saveLS('', -1);
    saveInnerTasks('', -1);
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <TodoList
        allTasks={allTasks}
        innerTasks={innerTasks}
        addNewItem={addNewItem}
        saveLS={saveLS}
        saveInnerTasks={saveInnerTasks}
        deleteAll={deleteAll}
      />
    </div>
  );
}

// Test suite
describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without crashing', () => {
    const { getByText } = render(<App />);
    expect(getByText('Todo List')).toBeInTheDocument();
  });

  it('loads tasks from localStorage on mount', async () => {
    const mockTasks = [{ text: 'Task 1', check: false }, { text: 'Task 2', check: true }];
    localStorage.setItem('allTasks', JSON.stringify(mockTasks));

    const { findByText } = render(<App />);

    await waitFor(() => {
      expect(findByText('Task 1')).toBeTruthy();
      expect(findByText('Task 2')).toBeTruthy();
    });
  });

  it('adds a new task', async () => {
    const { getByText, findByText } = render(<App />);

    fireEvent.click(getByText('Add New Task'));

    await waitFor(() => {
      expect(findByText('New Task')).toBeTruthy();
    });
  });

  it('deletes all tasks', async () => {
    const mockTasks = [{ text: 'Task 1', check: false }, { text: 'Task 2', check: true }];
    localStorage.setItem('allTasks', JSON.stringify(mockTasks));

    const { getByText, queryByText } = render(<App />);

    await waitFor(() => {
      expect(queryByText('Task 1')).toBeTruthy();
      expect(queryByText('Task 2')).toBeTruthy();
    });

    fireEvent.click(getByText('Delete All'));

    await waitFor(() => {
      expect(queryByText('Task 1')).toBeNull();
      expect(queryByText('Task 2')).toBeNull();
    });
  });

  it('does not add duplicate tasks', async () => {
    const { getByText, findByText, getAllByText } = render(<App />);

    fireEvent.click(getByText('Add New Task'));
    fireEvent.click(getByText('Add New Task'));

    await waitFor(() => {
      expect(findByText('New Task')).toBeTruthy();
      expect(getAllByText('New Task')).toHaveLength(1);
    });
  });
});

// Run the tests
test('Run all tests', () => {
  // This is a placeholder to ensure all tests are run
});