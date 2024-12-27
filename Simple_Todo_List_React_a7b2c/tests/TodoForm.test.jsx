import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TodoForm from '../src/components/TodoForm';

describe('TodoForm', () => {
  test('renders TodoForm component', () => {
    render(<TodoForm addTask={() => {}} />);
    expect(screen.getByPlaceholderText('Add a new task')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Task' })).toBeInTheDocument();
  });

  test('calls addTask with input value when form is submitted', () => {
    const mockAddTask = jest.fn();
    render(<TodoForm addTask={mockAddTask} />);
    
    const input = screen.getByPlaceholderText('Add a new task');
    const button = screen.getByRole('button', { name: 'Add Task' });

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(button);

    expect(mockAddTask).toHaveBeenCalledWith('New Task');
  });

  test('clears input after form submission', () => {
    render(<TodoForm addTask={() => {}} />);
    
    const input = screen.getByPlaceholderText('Add a new task');

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Task' }));

    expect(input).toHaveValue('');
  });

  test('does not call addTask when input is empty', () => {
    const mockAddTask = jest.fn();
    render(<TodoForm addTask={mockAddTask} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Add Task' }));

    expect(mockAddTask).not.toHaveBeenCalled();
  });
});