// Assuming this is part of app.js or a similar file

// Define the addingForm variable
let addingForm = false;

// ... (other code)

// Function to toggle the adding form
function toggleAddingForm() {
    addingForm = !addingForm;
    // Update UI based on addingForm state
    // For example:
    document.getElementById('addTaskForm').style.display = addingForm ? 'block' : 'none';
}

// ... (other code)

// Correct the saveInnerTasks function call
function handleSaveInnerTasks(parentTaskId) {
    const innerTaskInput = document.getElementById(`innerTask_${parentTaskId}`);
    const innerTaskText = innerTaskInput.value.trim();
    
    if (innerTaskText) {
        saveInnerTasks(parentTaskId, innerTaskText);
        innerTaskInput.value = '';
        // Optionally, update the UI to show the new inner task
        updateTaskDisplay(parentTaskId);
    }
}

// ... (other code)

// Implement or update the saveInnerTasks function in todoService.js
function saveInnerTasks(parentTaskId, innerTaskText) {
    const parentTask = tasks.find(task => task.id === parentTaskId);
    if (parentTask) {
        if (!parentTask.innerTasks) {
            parentTask.innerTasks = [];
        }
        const newInnerTask = {
            id: Date.now(), // Use a unique identifier
            text: innerTaskText,
            completed: false
        };
        parentTask.innerTasks.push(newInnerTask);
        saveTasks(); // Assuming you have a function to save tasks to storage
    }
}

// ... (other code)