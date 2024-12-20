// Mock React implementation
const React = {
  useState: (initialState) => {
    let state = initialState;
    const setState = (newState) => {
      state = typeof newState === 'function' ? newState(state) : newState;
    };
    return [state, setState];
  },
};

// App component implementation
const App = () => {
  const [todos, setTodos] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');

  const addTodo = () => {
    const todoText = inputValue.trim();
    if (todoText !== '') {
      setTodos([...todos, todoText]);
      setInputValue('');
    }
  };

  const removeTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addTodo();
    }
  };

  return {
    todos,
    inputValue,
    addTodo,
    removeTodo,
    handleKeyPress,
    setInputValue,
  };
};

// Test suite
describe('App Component', () => {
  let app;

  beforeEach(() => {
    app = App();
  });

  test('initial state', () => {
    expect(app.todos).toEqual([]);
    expect(app.inputValue).toBe('');
  });

  test('addTodo - adds a new todo', () => {
    app.setInputValue('New Todo');
    app.addTodo();
    expect(app.todos).toEqual(['New Todo']);
    expect(app.inputValue).toBe('');
  });

  test('addTodo - does not add empty todo', () => {
    app.setInputValue('   ');
    app.addTodo();
    expect(app.todos).toEqual([]);
  });

  test('removeTodo - removes a todo', () => {
    app.setInputValue('Todo 1');
    app.addTodo();
    app.setInputValue('Todo 2');
    app.addTodo();
    app.removeTodo(0);
    expect(app.todos).toEqual(['Todo 2']);
  });

  test('handleKeyPress - adds todo on Enter key', () => {
    app.setInputValue('New Todo');
    app.handleKeyPress({ key: 'Enter' });
    expect(app.todos).toEqual(['New Todo']);
  });

  test('handleKeyPress - does not add todo on other keys', () => {
    app.setInputValue('New Todo');
    app.handleKeyPress({ key: 'Space' });
    expect(app.todos).toEqual([]);
  });
});

// Test runner implementation
function describe(name, fn) {
  console.log(`\nTest Suite: ${name}`);
  fn();
}

function test(name, fn) {
  console.log(`\nTest: ${name}`);
  fn();
}

function expect(actual) {
  return {
    toEqual: (expected) => {
      const result = JSON.stringify(actual) === JSON.stringify(expected);
      console.log(`Expected: ${JSON.stringify(expected)}`);
      console.log(`Actual: ${JSON.stringify(actual)}`);
      console.log(`Result: ${result ? 'PASS' : 'FAIL'}`);
    },
    toBe: (expected) => {
      const result = actual === expected;
      console.log(`Expected: ${expected}`);
      console.log(`Actual: ${actual}`);
      console.log(`Result: ${result ? 'PASS' : 'FAIL'}`);
    },
  };
}

function beforeEach(fn) {
  global.beforeEachFn = fn;
}

// Run the tests
describe('App Component', () => {
  let app;

  beforeEach(() => {
    app = App();
  });

  test('initial state', () => {
    global.beforeEachFn();
    expect(app.todos).toEqual([]);
    expect(app.inputValue).toBe('');
  });

  test('addTodo - adds a new todo', () => {
    global.beforeEachFn();
    app.setInputValue('New Todo');
    app.addTodo();
    expect(app.todos).toEqual(['New Todo']);
    expect(app.inputValue).toBe('');
  });

  test('addTodo - does not add empty todo', () => {
    global.beforeEachFn();
    app.setInputValue('   ');
    app.addTodo();
    expect(app.todos).toEqual([]);
  });

  test('removeTodo - removes a todo', () => {
    global.beforeEachFn();
    app.setInputValue('Todo 1');
    app.addTodo();
    app.setInputValue('Todo 2');
    app.addTodo();
    app.removeTodo(0);
    expect(app.todos).toEqual(['Todo 2']);
  });

  test('handleKeyPress - adds todo on Enter key', () => {
    global.beforeEachFn();
    app.setInputValue('New Todo');
    app.handleKeyPress({ key: 'Enter' });
    expect(app.todos).toEqual(['New Todo']);
  });

  test('handleKeyPress - does not add todo on other keys', () => {
    global.beforeEachFn();
    app.setInputValue('New Todo');
    app.handleKeyPress({ key: 'Space' });
    expect(app.todos).toEqual([]);
  });
});

console.log('\nAll tests completed.');