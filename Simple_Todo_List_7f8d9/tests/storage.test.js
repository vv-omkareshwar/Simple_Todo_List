import pytest
from src.js.storage import Storage

@pytest.fixture
def storage():
    return Storage()

def test_load_main_tasks(storage):
    main_tasks = storage.load_main_tasks()
    assert isinstance(main_tasks, list)

def test_load_inner_tasks(storage):
    inner_tasks = storage.load_inner_tasks()
    assert isinstance(inner_tasks, list)

def test_save_main_task(storage, mocker):
    mock_local_storage = mocker.patch.object(storage, '_get_local_storage')
    mock_local_storage.return_value = {'mainTasks': []}

    storage.save_main_task("Test Task", 1)
    assert mock_local_storage.return_value['mainTasks'] == [{"text": "Test Task", "check": False}]

    storage.save_main_task("Test Task", 0)
    assert mock_local_storage.return_value['mainTasks'] == []

def test_save_inner_task(storage, mocker):
    mock_local_storage = mocker.patch.object(storage, '_get_local_storage')
    mock_local_storage.return_value = {'innerTasks': []}

    storage.save_inner_task({"text": "Inner Task", "check": False}, 1, "Main Task")
    assert mock_local_storage.return_value['innerTasks'] == [{"text": "Inner Task", "check": False, "upperText": "Main Task"}]

    storage.save_inner_task({"text": "Inner Task", "check": False}, 0, "Main Task")
    assert mock_local_storage.return_value['innerTasks'] == []

def test_update_task_check(storage, mocker):
    mock_local_storage = mocker.patch.object(storage, '_get_local_storage')
    mock_local_storage.return_value = {
        'mainTasks': [{"text": "Main Task", "check": False}],
        'innerTasks': [{"text": "Inner Task", "check": False, "upperText": "Main Task"}]
    }

    storage.update_task_check("Main Task", True)
    assert mock_local_storage.return_value['mainTasks'][0]['check'] == True

    storage.update_task_check("Inner Task", False, "Main Task")
    assert mock_local_storage.return_value['innerTasks'][0]['check'] == True

# Additional helper method for mocking localStorage
def _get_local_storage(self):
    if not hasattr(self, '_mock_storage'):
        self._mock_storage = {}
    return self._mock_storage