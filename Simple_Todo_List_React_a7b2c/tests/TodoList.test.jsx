import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TodoList from '../src/components/TodoList';
import * as localStorage from '../src/utils/localStorage';

jest.mock('../src/utils/localStorage');

describe('TodoList Component', () => {
  beforeEach(() => {
    localStorage.loadTasks.mockReturnValue([]);
  });

  test('renders TodoList component', () => {
    render(<TodoList />);
    expect(screen.getByText('Todo List')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a new task')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  test('adds a new task', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText('Add a new task');
    const addButton = screen.getByText('Add Task');

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(addButton);

    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  test('deletes a task', () => {
    localStorage.loadTasks.mockReturnValue([{ id: '1', text: 'Test Task', completed: false }]);
    render(<TodoList />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    
    const deleteButton = screen.getByLabelText('Delete');
    fireEvent.click(deleteButton);

    expect(screen.queryByText('Test Task')).not.toBeInTheDocument();
  });

  test('toggles task completion', () => {
    localStorage.loadTasks.mockReturnValue([{ id: '1', text: 'Test Task', completed: false }]);
    render(<TodoList />);

    const taskText = screen.getByText('Test Task');
    expect(taskText).not.toHaveStyle('text-decoration: line-through');

    fireEvent.click(taskText);

    expect(taskText).toHaveStyle('text-decoration: line-through');
  });

  test('adds an inner task', () => {
    localStorage.loadTasks.mockReturnValue([{ id: '1', text: 'Test Task', completed: false, innerTasks: [] }]);
    render(<TodoList />);

    const expandButton = screen.getByLabelText('Expand');
    fireEvent.click(expandButton);

    const innerTaskInput = screen.getByPlaceholderText('Add inner task');
    const addInnerTaskButton = screen.getByText('Add Inner Task');

    fireEvent.change(innerTaskInput, { target: { value: 'Inner Task' } });
    fireEvent.click(addInnerTaskButton);

    expect(screen.getByText('Inner Task')).toBeInTheDocument();
  });

  test('deletes all tasks', () => {
    localStorage.loadTasks.mockReturnValue([
      { id: '1', text: 'Task 1', completed: false },
      { id: '2', text: 'Task 2', completed: true }
    ]);
    render(<TodoList />);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();

    const deleteAllButton = screen.getByText('Delete All Tasks');
    fireEvent.click(deleteAllButton);

    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
  });
});