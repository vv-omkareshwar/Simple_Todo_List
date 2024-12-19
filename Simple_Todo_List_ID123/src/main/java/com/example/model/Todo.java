package com.example.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@ApiModel(description = "Todo item representation")
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty(notes = "The unique identifier of the todo item")
    private Long id;

    @NotBlank(message = "Task description cannot be blank")
    @Size(max = 255, message = "Task description cannot exceed 255 characters")
    @ApiModelProperty(notes = "The description of the todo item", required = true)
    private String description;

    @ApiModelProperty(notes = "The completion status of the todo item")
    private boolean completed;

    // Default constructor
    public Todo() {}

    // Constructor with description
    public Todo(String description) {
        this.description = description;
        this.completed = false;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    @Override
    public String toString() {
        return "Todo{" +
                "id=" + id +
                ", description='" + description + '\'' +
                ", completed=" + completed +
                '}';
    }
}