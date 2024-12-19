package com.example;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.example.model.Todo;
import com.example.service.TodoService;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
public class TodoIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TodoService todoService;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        // Clear all todos before each test
        todoService.getAllTodos().forEach(todo -> todoService.deleteTodo(todo.getId()));
    }

    @Test
    public void testCreateTodo() throws Exception {
        Todo newTodo = new Todo("Test Todo", false);
        
        mockMvc.perform(MockMvcRequestBuilders.post("/api/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newTodo)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.title").value("Test Todo"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.completed").value(false));
    }

    @Test
    public void testGetAllTodos() throws Exception {
        // Create a todo
        Todo newTodo = new Todo("Test Todo", false);
        todoService.createTodo(newTodo);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/todos"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].title").value("Test Todo"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].completed").value(false));
    }

    @Test
    public void testUpdateTodo() throws Exception {
        // Create a todo
        Todo newTodo = todoService.createTodo(new Todo("Test Todo", false));

        // Update the todo
        Todo updatedTodo = new Todo("Updated Todo", true);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/todos/" + newTodo.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedTodo)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.title").value("Updated Todo"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.completed").value(true));
    }

    @Test
    public void testDeleteTodo() throws Exception {
        // Create a todo
        Todo newTodo = todoService.createTodo(new Todo("Test Todo", false));

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/todos/" + newTodo.getId()))
                .andExpect(MockMvcResultMatchers.status().isNoContent());

        // Verify the todo is deleted
        mockMvc.perform(MockMvcRequestBuilders.get("/api/todos"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$").isEmpty());
    }
}