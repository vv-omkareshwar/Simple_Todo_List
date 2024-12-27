import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

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
    removeItem: function(key) {
      delete store[key];
    },
    clear: function() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Component implementation
const TodoList = () => {
  const [allTasks, setAllTasks] = React.useState([]);
  const [innerTasks, setInnerTasks] = React.useState([]);
  const [count, setCount] = React.useState(1);
  const [mainInput, setMainInput] = React.useState('');

  React.useEffect(() => {
    loadLS();
    loadInnerTasks();
  }, []);

  const createNewTask = (text, check = false) => {
    const newTask = {
      id: count,
      text,
      check,
      innerTasks: []
    };
    setAllTasks(prevTasks => [...prevTasks, newTask]);
    setCount(prevCount => prevCount + 1);
  };

  const addNewItem = (e) => {
    e.preventDefault();
    if (mainInput !== '') {
      const taskExists = allTasks.some(task => task.text === mainInput);
      if (!taskExists) {
        createNewTask(mainInput);
        saveLS(mainInput, 1);
        setMainInput('');
      } else {
        alert("Task Already Added");
      }
    }
  };

  const addInnerTask = (upperTaskId, mainText, check = false) => {
    setAllTasks(prevTasks => prevTasks.map(task => {
      if (task.id === upperTaskId) {
        return {
          ...task,
          innerTasks: [...task.innerTasks, { text: mainText, check }]
        };
      }
      return task;
    }));
    saveInnerTasks({ upperTaskId, mainText, check }, 1);
  };

  const taskStufs = (e, taskId) => {
    e.preventDefault();
    if (e.target.classList.contains("delete-item")) {
      deleteTask(taskId);
    } else if (e.target.classList.contains("check")) {
      toggleTaskCheck(taskId);
    } else if (e.target.classList.contains("btn-add-inner-task")) {
      const text = e.target.previousSibling.value;
      if (text !== '') {
        addInnerTask(taskId, text);
        e.target.previousSibling.value = '';
      }
    }
  };

  const deleteTask = (taskId) => {
    const taskToDelete = allTasks.find(task => task.id === taskId);
    if (taskToDelete) {
      saveLS(taskToDelete.text, 0);
      taskToDelete.innerTasks.forEach(innerTask => {
        saveInnerTasks(innerTask.text, 0, taskToDelete.text);
      });
      setAllTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    }
  };

  const toggleTaskCheck = (taskId) => {
    setAllTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        const newCheck = !task.check;
        saveLS(task.text, newCheck ? 2 : 3);
        return { ...task, check: newCheck };
      }
      return task;
    }));
  };

  const deleteAll = () => {
    setAllTasks([]);
    setInnerTasks([]);
    saveLS("", -1);
    saveInnerTasks("", -1);
  };

  const loadLS = () => {
    const storedTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
    setAllTasks(storedTasks);
  };

  const loadInnerTasks = () => {
    const storedInnerTasks = JSON.parse(localStorage.getItem("innerTasks")) || [];
    setInnerTasks(storedInnerTasks);
  };

  const saveLS = (text, index) => {
    let tasks = [...allTasks];
    if (index === -1) {
      localStorage.removeItem("allTasks");
      setAllTasks([]);
    } else if (index === 0) {
      tasks = tasks.filter(task => task.text !== text);
    } else if (index === 1) {
      tasks.push({ text, check: false });
    } else if (index === 2 || index === 3) {
      tasks = tasks.map(task => 
        task.text === text ? { ...task, check: index === 2 } : task
      );
    }
    localStorage.setItem("allTasks", JSON.stringify(tasks));
    setAllTasks(tasks);
  };

  const saveInnerTasks = (item, index, upperText = "") => {
    let tasks = [...innerTasks];
    if (index === -1) {
      localStorage.removeItem("innerTasks");
      setInnerTasks([]);
    } else if (index === 0) {
      tasks = tasks.filter(task => 
        !(task.mainText === item && task.upperTaskText === upperText)
      );
    } else if (index === 1) {
      tasks.push(item);
    }
    localStorage.setItem("innerTasks", JSON.stringify(tasks));
    setInnerTasks(tasks);
  };

  return (
    <div>
      <form onSubmit={addNewItem}>
        <input 
          type="text" 
          value={mainInput}
          onChange={(e) => setMainInput(e.target.value)}
          placeholder="Add new task"
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {allTasks.map(task => (
          <li key={task.id}>
            <span className={task.check ? "line-through" : ""}>{task.text}</span>
            <button onClick={(e) => taskStufs(e, task.id)} className="check">
              {task.check ? "Uncheck" : "Check"}
            </button>
            <button onClick={(e) => taskStufs(e, task.id)} className="delete-item">
              Delete
            </button>
            <ul>
              {task.innerTasks.map((innerTask, index) => (
                <li key={index}>
                  <span className={innerTask.check ? "line-through" : ""}>
                    {innerTask.text}
                  </span>
                </li>
              ))}
            </ul>
            <input type="text" placeholder="Add inner task" />
            <button onClick={(e) => taskStufs(e, task.id)} className="btn-add-inner-task">
              Add Inner Task
            </button>
          </li>
        ))}
      </ul>
      <button onClick={deleteAll}>Delete All</button>
    </div>
  );
};

// Test suite
describe('TodoList Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<TodoList />);
    expect(screen.getByPlaceholder('Add new task')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
    expect(screen.getByText('Delete All')).toBeInTheDocument();
  });

  it('adds a new task', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholder('Add new task');
    const addButton = screen.getByText('Add Task');

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(addButton);

    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  it('checks and unchecks a task', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholder('Add new task');
    const addButton = screen.getByText('Add Task');

    fireEvent.change(input, { target: { value: 'Task to check' } });
    fireEvent.click(addButton);

    const checkButton = screen.getByText('Check');
    fireEvent.click(checkButton);

    expect(screen.getByText('Task to check')).toHaveClass('line-through');
    expect(screen.getByText('Uncheck')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Uncheck'));
    expect(screen.getByText('Task to check')).not.toHaveClass('line-through');
  });

  it('deletes a task', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholder('Add new task');
    const addButton = screen.getByText('Add Task');

    fireEvent.change(input, { target: { value: 'Task to delete' } });
    fireEvent.click(addButton);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(screen.queryByText('Task to delete')).not.toBeInTheDocument();
  });

  it('adds an inner task', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholder('Add new task');
    const addButton = screen.getByText('Add Task');

    fireEvent.change(input, { target: { value: 'Main Task' } });
    fireEvent.click(addButton);

    const innerTaskInput = screen.getByPlaceholder('Add inner task');
    const addInnerTaskButton = screen.getByText('Add Inner Task');

    fireEvent.change(innerTaskInput, { target: { value: 'Inner Task' } });
    fireEvent.click(addInnerTaskButton);

    expect(screen.getByText('Inner Task')).toBeInTheDocument();
  });

  it('deletes all tasks', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholder('Add new task');
    const addButton = screen.getByText('Add Task');

    fireEvent.change(input, { target: { value: 'Task 1' } });
    fireEvent.click(addButton);
    fireEvent.change(input, { target: { value: 'Task 2' } });
    fireEvent.click(addButton);

    const deleteAllButton = screen.getByText('Delete All');
    fireEvent.click(deleteAllButton);

    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
  });

  it('loads tasks from localStorage', () => {
    localStorage.setItem('allTasks', JSON.stringify([{ id: 1, text: 'Loaded Task', check: false, innerTasks: [] }]));
    render(<TodoList />);
    expect(screen.getByText('Loaded Task')).toBeInTheDocument();
  });
});

// Run the tests
test('Run all tests', () => {
  // This is a placeholder to ensure all tests are run
});