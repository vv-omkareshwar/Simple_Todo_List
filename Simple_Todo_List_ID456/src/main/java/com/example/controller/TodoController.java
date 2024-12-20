package com.example.controller;

import com.example.model.Todo;
import com.example.service.TodoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@Tag(name = "Todo Controller", description = "API endpoints for managing todos")
public class TodoController {

    private final TodoService todoService;

    @Autowired
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    @Operation(summary = "Get all todos", description = "Retrieves a list of all todos")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved todos")
    public ResponseEntity<List<Todo>> getAllTodos() {
        List<Todo> todos = todoService.getAllTodos();
        return new ResponseEntity<>(todos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a todo by ID", description = "Retrieves a todo by its ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved todo")
    @ApiResponse(responseCode = "404", description = "Todo not found")
    public ResponseEntity<Todo> getTodoById(
            @Parameter(description = "ID of the todo to retrieve") @PathVariable Long id) {
        return todoService.getTodoById(id)
                .map(todo -> new ResponseEntity<>(todo, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @Operation(summary = "Create a new todo", description = "Creates a new todo item")
    @ApiResponse(responseCode = "201", description = "Todo created successfully")
    public ResponseEntity<Todo> createTodo(
            @Parameter(description = "Todo object to be created") @RequestBody Todo todo) {
        Todo createdTodo = todoService.createTodo(todo);
        return new ResponseEntity<>(createdTodo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a todo", description = "Updates an existing todo item")
    @ApiResponse(responseCode = "200", description = "Todo updated successfully")
    @ApiResponse(responseCode = "404", description = "Todo not found")
    public ResponseEntity<Todo> updateTodo(
            @Parameter(description = "ID of the todo to update") @PathVariable Long id,
            @Parameter(description = "Updated todo object") @RequestBody Todo todo) {
        return todoService.updateTodo(id, todo)
                .map(updatedTodo -> new ResponseEntity<>(updatedTodo, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a todo", description = "Deletes a todo item by its ID")
    @ApiResponse(responseCode = "204", description = "Todo deleted successfully")
    @ApiResponse(responseCode = "404", description = "Todo not found")
    public ResponseEntity<Void> deleteTodo(
            @Parameter(description = "ID of the todo to delete") @PathVariable Long id) {
        if (todoService.deleteTodo(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}