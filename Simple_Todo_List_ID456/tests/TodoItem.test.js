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

// TodoItem component
const TodoItem = ({ text, onRemove }) => ({
  type: 'li',
  props: {
    children: [
      { type: 'span', props: { children: text } },
      { type: 'button', props: { onClick: onRemove, children: 'Remove' } }
    ]
  }
});

// TodoList component
const TodoList = () => {
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
    setTodos(todos.filter((_, i) => i !== index));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addTodo();
    }
  };

  return {
    type: 'div',
    props: {
      children: [
        {
          type: 'input',
          props: {
            type: 'text',
            value: inputValue,
            onChange: (e) => setInputValue(e.target.value),
            onKeyPress: handleKeyPress,
            placeholder: 'Enter a todo item'
          }
        },
        {
          type: 'button',
          props: { onClick: addTodo, children: 'Add' }
        },
        {
          type: 'ul',
          props: {
            children: todos.map((todo, index) => 
              TodoItem({ key: index, text: todo, onRemove: () => removeTodo(index) })
            )
          }
        }
      ]
    }
  };
};

// Test suite
describe('TodoList Component', () => {
  let todoList;

  beforeEach(() => {
    todoList = TodoList();
  });

  test('initial render', () => {
    expect(todoList.type).toBe('div');
    expect(todoList.props.children.length).toBe(3);
    expect(todoList.props.children[0].type).toBe('input');
    expect(todoList.props.children[1].type).toBe('button');
    expect(todoList.props.children[2].type).toBe('ul');
    expect(todoList.props.children[2].props.children.length).toBe(0);
  });

  test('add todo', () => {
    const input = todoList.props.children[0];
    const addButton = todoList.props.children[1];

    input.props.onChange({ target: { value: 'New Todo' } });
    addButton.props.onClick();

    const updatedTodoList = TodoList();
    const todoItems = updatedTodoList.props.children[2].props.children;

    expect(todoItems.length).toBe(1);
    expect(todoItems[0].props.children[0].props.children).toBe('New Todo');
  });

  test('remove todo', () => {
    const input = todoList.props.children[0];
    const addButton = todoList.props.children[1];

    input.props.onChange({ target: { value: 'Todo 1' } });
    addButton.props.onClick();
    input.props.onChange({ target: { value: 'Todo 2' } });
    addButton.props.onClick();

    let updatedTodoList = TodoList();
    let todoItems = updatedTodoList.props.children[2].props.children;

    expect(todoItems.length).toBe(2);

    const removeButton = todoItems[0].props.children[1];
    removeButton.props.onClick();

    updatedTodoList = TodoList();
    todoItems = updatedTodoList.props.children[2].props.children;

    expect(todoItems.length).toBe(1);
    expect(todoItems[0].props.children[0].props.children).toBe('Todo 2');
  });

  test('handle key press', () => {
    const input = todoList.props.children[0];

    input.props.onChange({ target: { value: 'Enter Todo' } });
    input.props.onKeyPress({ key: 'Enter' });

    const updatedTodoList = TodoList();
    const todoItems = updatedTodoList.props.children[2].props.children;

    expect(todoItems.length).toBe(1);
    expect(todoItems[0].props.children[0].props.children).toBe('Enter Todo');
  });
});

// Test runner implementation
function describe(name, fn) {
  console.log(`\nTest Suite: ${name}`);
  fn();
}

function test(name, fn) {
  console.log(`\nTest: ${name}`);
  try {
    fn();
    console.log('PASSED');
  } catch (error) {
    console.error('FAILED', error);
  }
}

function expect(actual) {
  return {
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, but got ${actual}`);
      }
    },
    toEqual: (expected) => {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
      }
    },
  };
}

function beforeEach(fn) {
  fn();
}

// Run the tests
describe('TodoList Component', () => {
  let todoList;

  beforeEach(() => {
    todoList = TodoList();
  });

  test('initial render', () => {
    expect(todoList.type).toBe('div');
    expect(todoList.props.children.length).toBe(3);
    expect(todoList.props.children[0].type).toBe('input');
    expect(todoList.props.children[1].type).toBe('button');
    expect(todoList.props.children[2].type).toBe('ul');
    expect(todoList.props.children[2].props.children.length).toBe(0);
  });

  test('add todo', () => {
    const input = todoList.props.children[0];
    const addButton = todoList.props.children[1];

    input.props.onChange({ target: { value: 'New Todo' } });
    addButton.props.onClick();

    const updatedTodoList = TodoList();
    const todoItems = updatedTodoList.props.children[2].props.children;

    expect(todoItems.length).toBe(1);
    expect(todoItems[0].props.children[0].props.children).toBe('New Todo');
  });

  test('remove todo', () => {
    const input = todoList.props.children[0];
    const addButton = todoList.props.children[1];

    input.props.onChange({ target: { value: 'Todo 1' } });
    addButton.props.onClick();
    input.props.onChange({ target: { value: 'Todo 2' } });
    addButton.props.onClick();

    let updatedTodoList = TodoList();
    let todoItems = updatedTodoList.props.children[2].props.children;

    expect(todoItems.length).toBe(2);

    const removeButton = todoItems[0].props.children[1];
    removeButton.props.onClick();

    updatedTodoList = TodoList();
    todoItems = updatedTodoList.props.children[2].props.children;

    expect(todoItems.length).toBe(1);
    expect(todoItems[0].props.children[0].props.children).toBe('Todo 2');
  });

  test('handle key press', () => {
    const input = todoList.props.children[0];

    input.props.onChange({ target: { value: 'Enter Todo' } });
    input.props.onKeyPress({ key: 'Enter' });

    const updatedTodoList = TodoList();
    const todoItems = updatedTodoList.props.children[2].props.children;

    expect(todoItems.length).toBe(1);
    expect(todoItems[0].props.children[0].props.children).toBe('Enter Todo');
  });
});

console.log('\nAll tests completed.');