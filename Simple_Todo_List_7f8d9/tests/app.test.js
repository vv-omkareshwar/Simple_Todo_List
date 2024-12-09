import pytest
from src.js.app import App

@pytest.fixture
def app():
    return App()

def test_create_new_task(app):
    task_text = "New Task"
    check = False
    new_task = app.create_new_task(task_text, check)
    
    assert new_task is not None
    assert task_text in new_task.text
    assert not new_task.classList.contains('line-throught')

def test_add_new_item(app, mocker):
    mock_event = mocker.Mock()
    mock_event.preventDefault = mocker.Mock()
    mock_event.target = mocker.Mock()
    mock_event.target.querySelector.return_value.value = "New Task"

    mocker.patch.object(app, 'create_new_task')
    mocker.patch.object(app.storage, 'save_main_task')

    app.add_new_item(mock_event)

    mock_event.preventDefault.assert_called_once()
    app.create_new_task.assert_called_once_with("New Task", False)
    app.storage.save_main_task.assert_called_once_with("New Task", 1)

def test_delete_task(app, mocker):
    mock_target = mocker.Mock()
    mock_target.closest.return_value.querySelector.return_value.textContent = "Task to Delete"

    mocker.patch.object(app.storage, 'save_main_task')
    mocker.patch.object(app, 'load_tasks')

    app.delete_task(mock_target)

    app.storage.save_main_task.assert_called_once_with("Task to Delete", 0)
    app.load_tasks.assert_called_once()

def test_toggle_task_check(app, mocker):
    mock_target = mocker.Mock()
    mock_target.closest.return_value.querySelector.return_value.textContent = "Task to Toggle"

    mocker.patch.object(app.storage, 'update_task_check')
    mocker.patch.object(app, 'load_tasks')

    app.toggle_task_check(mock_target)

    app.storage.update_task_check.assert_called_once_with("Task to Toggle", True)
    app.load_tasks.assert_called_once()

def test_delete_all(app, mocker):
    mock_event = mocker.Mock()
    mock_event.preventDefault = mocker.Mock()

    mocker.patch.object(app.storage, 'save_main_task')
    mocker.patch.object(app, 'load_tasks')

    app.delete_all(mock_event)

    mock_event.preventDefault.assert_called_once()
    app.storage.save_main_task.assert_called_once_with("", -1)
    app.load_tasks.assert_called_once()

# Add more tests for other methods as needed