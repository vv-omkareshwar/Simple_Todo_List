// Mock implementations
const React = {
  useState: jest.fn(),
  useEffect: jest.fn()
};

const localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

// Mock component
const TodoItem = jest.fn().mockImplementation(({ task, innerTasks, onToggleCheck, onDelete, onAddInnerTask, onToggleInnerCheck, onDeleteInnerTask }) => (
  <li>
    <span>{task.text}</span>
    <button onClick={onToggleCheck}>Toggle</button>
    <button onClick={onDelete}>Delete</button>
    <ul>
      {innerTasks.map((innerTask, index) => (
        <li key={index}>
          <span>{innerTask.mainText}</span>
          <button onClick={() => onToggleInnerCheck(innerTask.mainText)}>Toggle</button>
          <button onClick={() => onDeleteInnerTask(innerTask.mainText)}>Delete</button>
        </li>
      ))}
    </ul>
    <input type="text" placeholder="Add inner task" />
    <button onClick={() => onAddInnerTask("New Inner Task")}>Add Inner Task</button>
  </li>
));

// Implementation of TodoList component
const TodoList = () => {
  const [allTasks, setAllTasks] = React.useState([]);
  const [innerTasks, setInnerTasks] = React.useState([]);
  const [newTaskText, setNewTaskText] = React.useState('');

  React.useEffect(() => {
    loadTasks();
    loadInnerTasks();
  }, []);

  const loadTasks = () => {
    const storedTasks = JSON.parse(localStorage.getItem('allTasks')) || [];
    setAllTasks(storedTasks);
  };

  const loadInnerTasks = () => {
    const storedInnerTasks = JSON.parse(localStorage.getItem('innerTasks')) || [];
    setInnerTasks(storedInnerTasks);
  };

  const addNewTask = (e) => {
    e.preventDefault();
    if (newTaskText.trim() !== '') {
      const taskExists = allTasks.some(task => task.text === newTaskText);
      if (!taskExists) {
        const newTask = { text: newTaskText, check: false };
        setAllTasks([...allTasks, newTask]);
        localStorage.setItem('allTasks', JSON.stringify([...allTasks, newTask]));
        setNewTaskText('');
      } else {
        alert('Task Already Added');
      }
    }
  };

  const toggleTaskCheck = (taskText) => {
    const updatedTasks = allTasks.map(task => 
      task.text === taskText ? { ...task, check: !task.check } : task
    );
    setAllTasks(updatedTasks);
    localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
  };

  const deleteTask = (taskText) => {
    const updatedTasks = allTasks.filter(task => task.text !== taskText);
    setAllTasks(updatedTasks);
    localStorage.setItem('allTasks', JSON.stringify(updatedTasks));

    const updatedInnerTasks = innerTasks.filter(task => task.upperTaskText !== taskText);
    setInnerTasks(updatedInnerTasks);
    localStorage.setItem('innerTasks', JSON.stringify(updatedInnerTasks));
  };

  const addInnerTask = (upperTaskText, innerTaskText) => {
    if (innerTaskText.trim() !== '') {
      const newInnerTask = { upperTaskText, mainText: innerTaskText, check: false };
      const updatedInnerTasks = [...innerTasks, newInnerTask];
      setInnerTasks(updatedInnerTasks);
      localStorage.setItem('innerTasks', JSON.stringify(updatedInnerTasks));
    }
  };

  const toggleInnerTaskCheck = (upperTaskText, innerTaskText) => {
    const updatedInnerTasks = innerTasks.map(task => 
      (task.upperTaskText === upperTaskText && task.mainText === innerTaskText)
        ? { ...task, check: !task.check }
        : task
    );
    setInnerTasks(updatedInnerTasks);
    localStorage.setItem('innerTasks', JSON.stringify(updatedInnerTasks));
  };

  const deleteInnerTask = (upperTaskText, innerTaskText) => {
    const updatedInnerTasks = innerTasks.filter(task => 
      !(task.upperTaskText === upperTaskText && task.mainText === innerTaskText)
    );
    setInnerTasks(updatedInnerTasks);
    localStorage.setItem('innerTasks', JSON.stringify(updatedInnerTasks));
  };

  const deleteAllTasks = () => {
    setAllTasks([]);
    setInnerTasks([]);
    localStorage.removeItem('allTasks');
    localStorage.removeItem('innerTasks');
  };

  return (
    <div>
      <form onSubmit={addNewTask}>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add new task"
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {allTasks.map((task, index) => (
          <TodoItem
            key={index}
            task={task}
            innerTasks={innerTasks.filter(innerTask => innerTask.upperTaskText === task.text)}
            onToggleCheck={() => toggleTaskCheck(task.text)}
            onDelete={() => deleteTask(task.text)}
            onAddInnerTask={(innerTaskText) => addInnerTask(task.text, innerTaskText)}
            onToggleInnerCheck={(innerTaskText) => toggleInnerTaskCheck(task.text, innerTaskText)}
            onDeleteInnerTask={(innerTaskText) => deleteInnerTask(task.text, innerTaskText)}
          />
        ))}
      </ul>
      <button onClick={deleteAllTasks}>Delete All</button>
    </div>
  );
};

// Test suite
describe('TodoList', () => {
  let setAllTasks;
  let setInnerTasks;
  let setNewTaskText;

  beforeEach(() => {
    jest.clearAllMocks();
    setAllTasks = jest.fn();
    setInnerTasks = jest.fn();
    setNewTaskText = jest.fn();
    React.useState.mockImplementation((initialValue) => [initialValue, initialValue === '' ? setNewTaskText : initialValue === [] ? setAllTasks : setInnerTasks]);
  });

  test('loads tasks and inner tasks on mount', () => {
    const mockTasks = [{ text: 'Task 1', check: false }];
    const mockInnerTasks = [{ upperTaskText: 'Task 1', mainText: 'Inner Task 1', check: false }];
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'allTasks') return JSON.stringify(mockTasks);
      if (key === 'innerTasks') return JSON.stringify(mockInnerTasks);
    });

    TodoList();

    expect(localStorage.getItem).toHaveBeenCalledWith('allTasks');
    expect(localStorage.getItem).toHaveBeenCalledWith('innerTasks');
    expect(setAllTasks).toHaveBeenCalledWith(mockTasks);
    expect(setInnerTasks).toHaveBeenCalledWith(mockInnerTasks);
  });

  test('adds a new task', () => {
    const mockEvent = { preventDefault: jest.fn() };
    const mockTasks = [{ text: 'Existing Task', check: false }];
    React.useState.mockReturnValueOnce([mockTasks, setAllTasks]);
    React.useState.mockReturnValueOnce([[], setInnerTasks]);
    React.useState.mockReturnValueOnce(['New Task', setNewTaskText]);

    const todoList = TodoList();
    todoList.props.children[0].props.onSubmit(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(setAllTasks).toHaveBeenCalledWith([...mockTasks, { text: 'New Task', check: false }]);
    expect(localStorage.setItem).toHaveBeenCalledWith('allTasks', JSON.stringify([...mockTasks, { text: 'New Task', check: false }]));
    expect(setNewTaskText).toHaveBeenCalledWith('');
  });

  test('toggles task check', () => {
    const mockTasks = [{ text: 'Task 1', check: false }];
    React.useState.mockReturnValueOnce([mockTasks, setAllTasks]);

    const todoList = TodoList();
    todoList.props.children[1].props.children[0].props.onToggleCheck();

    expect(setAllTasks).toHaveBeenCalledWith([{ text: 'Task 1', check: true }]);
    expect(localStorage.setItem).toHaveBeenCalledWith('allTasks', JSON.stringify([{ text: 'Task 1', check: true }]));
  });

  test('deletes a task', () => {
    const mockTasks = [{ text: 'Task 1', check: false }, { text: 'Task 2', check: false }];
    const mockInnerTasks = [{ upperTaskText: 'Task 1', mainText: 'Inner Task 1', check: false }];
    React.useState.mockReturnValueOnce([mockTasks, setAllTasks]);
    React.useState.mockReturnValueOnce([mockInnerTasks, setInnerTasks]);

    const todoList = TodoList();
    todoList.props.children[1].props.children[0].props.onDelete();

    expect(setAllTasks).toHaveBeenCalledWith([{ text: 'Task 2', check: false }]);
    expect(setInnerTasks).toHaveBeenCalledWith([]);
    expect(localStorage.setItem).toHaveBeenCalledWith('allTasks', JSON.stringify([{ text: 'Task 2', check: false }]));
    expect(localStorage.setItem).toHaveBeenCalledWith('innerTasks', JSON.stringify([]));
  });

  test('deletes all tasks', () => {
    const todoList = TodoList();
    todoList.props.children[2].props.onClick();

    expect(setAllTasks).toHaveBeenCalledWith([]);
    expect(setInnerTasks).toHaveBeenCalledWith([]);
    expect(localStorage.removeItem).toHaveBeenCalledWith('allTasks');
    expect(localStorage.removeItem).toHaveBeenCalledWith('innerTasks');
  });
});