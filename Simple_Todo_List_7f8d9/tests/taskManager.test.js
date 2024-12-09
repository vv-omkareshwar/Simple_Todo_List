import pytest
from src.js.taskManager import TaskManager

@pytest.fixture
def task_manager():
    return TaskManager()

def test_create_new_task(task_manager):
    task_text = "New Task"
    task_manager.createNewTask(task_text, False)
    assert len(task_manager.tasks) == 1
    assert task_manager.tasks[0]['text'] == task_text
    assert task_manager.tasks[0]['checked'] == False

def test_add_inner_task(task_manager):
    upper_text = "Main Task"
    inner_text = "Inner Task"
    task_manager.createNewTask(upper_text, False)
    task_manager.addInnerTask(upper_text, inner_text, False)
    assert len(task_manager.tasks) == 1
    assert len(task_manager.tasks[0]['innerTasks']) == 1
    assert task_manager.tasks[0]['innerTasks'][0]['text'] == inner_text
    assert task_manager.tasks[0]['innerTasks'][0]['checked'] == False

def test_delete_main_task(task_manager):
    task_text = "Task to Delete"
    task_manager.createNewTask(task_text, False)
    assert len(task_manager.tasks) == 1
    task_manager.deleteMainTask(task_manager.tasks[0])
    assert len(task_manager.tasks) == 0

def test_delete_inner_task(task_manager):
    upper_text = "Main Task"
    inner_text = "Inner Task to Delete"
    task_manager.createNewTask(upper_text, False)
    task_manager.addInnerTask(upper_text, inner_text, False)
    assert len(task_manager.tasks[0]['innerTasks']) == 1
    task_manager.deleteInnerTask(task_manager.tasks[0]['innerTasks'][0])
    assert len(task_manager.tasks[0]['innerTasks']) == 0

def test_toggle_main_task_check(task_manager):
    task_text = "Task to Toggle"
    task_manager.createNewTask(task_text, False)
    assert task_manager.tasks[0]['checked'] == False
    task_manager.toggleMainTaskCheck(task_manager.tasks[0])
    assert task_manager.tasks[0]['checked'] == True

def test_toggle_inner_task_check(task_manager):
    upper_text = "Main Task"
    inner_text = "Inner Task to Toggle"
    task_manager.createNewTask(upper_text, False)
    task_manager.addInnerTask(upper_text, inner_text, False)
    assert task_manager.tasks[0]['innerTasks'][0]['checked'] == False
    task_manager.toggleInnerTaskCheck(task_manager.tasks[0]['innerTasks'][0])
    assert task_manager.tasks[0]['innerTasks'][0]['checked'] == True

def test_delete_all(task_manager):
    task_manager.createNewTask("Task 1", False)
    task_manager.createNewTask("Task 2", False)
    assert len(task_manager.tasks) == 2
    task_manager.deleteAll()
    assert len(task_manager.tasks) == 0