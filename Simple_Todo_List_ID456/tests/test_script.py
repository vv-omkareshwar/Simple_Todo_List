package com.example;

import com.example.model.Todo;
import com.example.service.TodoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class TodoServiceTest {

    @Autowired
    private TodoService todoService;

    @BeforeEach
    public void setUp() {
        // Clear all todos before each test
        List<Todo> allTodos = todoService.getAllTodos();
        for (Todo todo : allTodos) {
            todoService.deleteTodo(todo.getId());
        }
    }

    @Test
    public void testCreateTodo() {
        Todo todo = new Todo("Test Todo");
        Todo createdTodo = todoService.createTodo(todo);

        assertNotNull(createdTodo.getId());
        assertEquals("Test Todo", createdTodo.getTitle());
        assertFalse(createdTodo.isCompleted());
    }

    @Test
    public void testGetAllTodos() {
        todoService.createTodo(new Todo("Todo 1"));
        todoService.createTodo(new Todo("Todo 2"));

        List<Todo> todos = todoService.getAllTodos();

        assertEquals(2, todos.size());
        assertEquals("Todo 1", todos.get(0).getTitle());
        assertEquals("Todo 2", todos.get(1).getTitle());
    }

    @Test
    public void testGetTodoById() {
        Todo todo = todoService.createTodo(new Todo("Test Todo"));

        Optional<Todo> retrievedTodo = todoService.getTodoById(todo.getId());

        assertTrue(retrievedTodo.isPresent());
        assertEquals("Test Todo", retrievedTodo.get().getTitle());
    }

    @Test
    public void testUpdateTodo() {
        Todo todo = todoService.createTodo(new Todo("Original Todo"));

        Todo updatedTodo = new Todo("Updated Todo");
        updatedTodo.setCompleted(true);

        Optional<Todo> result = todoService.updateTodo(todo.getId(), updatedTodo);

        assertTrue(result.isPresent());
        assertEquals("Updated Todo", result.get().getTitle());
        assertTrue(result.get().isCompleted());
    }

    @Test
    public void testDeleteTodo() {
        Todo todo = todoService.createTodo(new Todo("Todo to delete"));

        boolean deleted = todoService.deleteTodo(todo.getId());

        assertTrue(deleted);
        assertTrue(todoService.getAllTodos().isEmpty());
    }
}