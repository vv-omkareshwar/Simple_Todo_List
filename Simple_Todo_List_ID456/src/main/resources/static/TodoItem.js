import React, { useState } from 'react';

const TodoItem = ({ text, onRemove }) => (
  <li>
    <span>{text}</span>
    <button onClick={onRemove}>Remove</button>
  </li>
);

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

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

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter a todo item"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo, index) => (
          <TodoItem
            key={index}
            text={todo}
            onRemove={() => removeTodo(index)}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;