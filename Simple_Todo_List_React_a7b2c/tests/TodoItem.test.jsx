import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoItem from '../src/components/TodoItem';

describe('TodoItem', () => {
  const mockTask = {
    id: '1',
    text: 'Test Task',
    completed: false,
    innerTasks: []
  };

  const mockOnDelete = jest.fn();
  const mockOnToggle = jest.fn();
  const mockOnAddInnerTask = jest.fn();

  beforeEach(() => {
    render(
      <TodoItem
        task={mockTask}
        onDelete={mockOnDelete}
        onToggle={mockOnToggle}
        onAddInnerTask={mockOnAddInnerTask}
      />
    );
  });

  test('renders task text', () => {
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  test('calls onToggle when checkbox is clicked', () => {
    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockOnToggle).toHaveBeenCalledWith(mockTask.id);
  });

  test('calls onDelete when delete button is clicked', () => {
    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
  });

  test('adds inner task when form is submitted', () => {
    fireEvent.change(screen.getByPlaceholderText('Add inner task...'), {
      target: { value: 'New Inner Task' }
    });
    fireEvent.submit(screen.getByTestId('inner-task-form'));
    expect(mockOnAddInnerTask).toHaveBeenCalledWith(mockTask.id, 'New Inner Task');
  });

  test('toggles inner tasks visibility when button is clicked', () => {
    const toggleButton = screen.getByText('Inner Tasks');
    fireEvent.click(toggleButton);
    expect(screen.getByTestId('inner-tasks-list')).toBeVisible();
    fireEvent.click(toggleButton);
    expect(screen.getByTestId('inner-tasks-list')).not.toBeVisible();
  });
});