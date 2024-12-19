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
    private long nextId = 1;

    @ApiOperation(value = "Get all todos", notes = "Retrieves a list of all todos")
    public List<Todo> getAllTodos() {
        return new ArrayList<>(todos);
    }

    @ApiOperation(value = "Get a todo by ID", notes = "Retrieves a todo based on its ID")
    public Optional<Todo> getTodoById(long id) {
        return todos.stream().filter(todo -> todo.getId() == id).findFirst();
    }

    @ApiOperation(value = "Add a new todo", notes = "Creates a new todo and adds it to the list")
    public Todo addTodo(String text) {
        Todo newTodo = new Todo(nextId++, text, false);
        todos.add(newTodo);
        return newTodo;
    }

    @ApiOperation(value = "Update a todo", notes = "Updates an existing todo's text and completion status")
    public Optional<Todo> updateTodo(long id, String text, boolean completed) {
        Optional<Todo> todoOptional = getTodoById(id);
        if (todoOptional.isPresent()) {
            Todo todo = todoOptional.get();
            todo.setText(text);
            todo.setCompleted(completed);
            return Optional.of(todo);
        }
        return Optional.empty();
    }

    @ApiOperation(value = "Delete a todo", notes = "Removes a todo from the list based on its ID")
    public boolean deleteTodo(long id) {
        return todos.removeIf(todo -> todo.getId() == id);
    }
}