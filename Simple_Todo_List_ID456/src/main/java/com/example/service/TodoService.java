package com.example.service;

import com.example.model.Todo;
import org.springframework.stereotype.Service;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Api(tags = "Todo Service", description = "Operations pertaining to todos in the application")
public class TodoService {

    private List<Todo> todos = new ArrayList<>();
    private Long nextId = 1L;

    @ApiOperation(value = "Get all todos", notes = "Retrieves a list of all todos")
    public List<Todo> getAllTodos() {
        return new ArrayList<>(todos);
    }

    @ApiOperation(value = "Get a todo by ID", notes = "Retrieves a todo based on its ID")
    public Optional<Todo> getTodoById(Long id) {
        return todos.stream().filter(todo -> todo.getId().equals(id)).findFirst();
    }

    @ApiOperation(value = "Create a new todo", notes = "Creates a new todo and adds it to the list")
    public Todo createTodo(Todo todo) {
        todo.setId(nextId++);
        todos.add(todo);
        return todo;
    }

    @ApiOperation(value = "Update an existing todo", notes = "Updates an existing todo based on its ID")
    public Optional<Todo> updateTodo(Long id, Todo updatedTodo) {
        for (int i = 0; i < todos.size(); i++) {
            if (todos.get(i).getId().equals(id)) {
                updatedTodo.setId(id);
                todos.set(i, updatedTodo);
                return Optional.of(updatedTodo);
            }
        }
        return Optional.empty();
    }

    @ApiOperation(value = "Delete a todo", notes = "Deletes a todo based on its ID")
    public boolean deleteTodo(Long id) {
        return todos.removeIf(todo -> todo.getId().equals(id));
    }
}