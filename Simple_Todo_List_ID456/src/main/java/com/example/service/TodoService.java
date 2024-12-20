package com.example.service;

import com.example.model.Todo;
import org.springframework.stereotype.Service;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

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

    @ApiOperation(value = "Get a todo by ID", notes = "Returns a todo as per the id")
    public Optional<Todo> getTodoById(@ApiParam(value = "ID of the todo to be obtained", required = true) long id) {
        return todos.stream().filter(todo -> todo.getId() == id).findFirst();
    }

    @ApiOperation(value = "Create a new todo", notes = "Adds a new todo to the list")
    public Todo createTodo(@ApiParam(value = "Todo object to be added", required = true) Todo todo) {
        todo.setId(nextId++);
        todos.add(todo);
        return todo;
    }

    @ApiOperation(value = "Update an existing todo", notes = "Updates the todo with the given id")
    public Optional<Todo> updateTodo(
            @ApiParam(value = "ID of the todo to be updated", required = true) long id,
            @ApiParam(value = "Updated todo object", required = true) Todo updatedTodo) {
        Optional<Todo> todoOptional = getTodoById(id);
        if (todoOptional.isPresent()) {
            Todo todo = todoOptional.get();
            todo.setTitle(updatedTodo.getTitle());
            todo.setCompleted(updatedTodo.isCompleted());
            return Optional.of(todo);
        }
        return Optional.empty();
    }

    @ApiOperation(value = "Delete a todo", notes = "Removes the todo with the given id")
    public boolean deleteTodo(@ApiParam(value = "ID of the todo to be deleted", required = true) long id) {
        return todos.removeIf(todo -> todo.getId() == id);
    }
}