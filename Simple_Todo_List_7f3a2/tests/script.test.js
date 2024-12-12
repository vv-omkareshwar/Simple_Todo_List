import pytest
from script import createNewTask, addInnerTask, handleDeleteItem, handleDeleteInnerItem, handleCheckItem, handleInnerCheckItem

@pytest.fixture
def mock_document():
    class MockDocument:
        def __init__(self):
            self.elements = {}

        def querySelector(self, selector):
            return self.elements.get(selector, None)

        def createElement(self, tag):
            return MockElement(tag)

    return MockDocument()

class MockElement:
    def __init__(self, tag):
        self.tag = tag
        self.className = ""
        self.innerHTML = ""
        self.children = []

    def appendChild(self, child):
        self.children.append(child)

def test_createNewTask(mock_document):
    task_text = "Test Task"
    is_checked = False
    
    new_task = createNewTask(task_text, is_checked)
    
    assert new_task.tag == "li"
    assert "task" in new_task.className
    assert task_text in new_task.innerHTML
    assert len(new_task.children) == 3  # Checkbox, text, and delete button

def test_addInnerTask(mock_document):
    upper_text = "Main Task"
    inner_text = "Inner Task"
    is_checked = False
    
    inner_task = addInnerTask(upper_text, inner_text, is_checked)
    
    assert inner_task.tag == "li"
    assert "inner-task" in inner_task.className
    assert inner_text in inner_task.innerHTML
    assert len(inner_task.children) == 3  # Checkbox, text, and delete button

def test_handleDeleteItem(mock_document):
    task = MockElement("li")
    task.className = "task"
    parent = MockElement("ul")
    parent.appendChild(task)
    
    event = type('Event', (), {'target': task})()
    
    handleDeleteItem(event)
    
    assert len(parent.children) == 0

def test_handleDeleteInnerItem(mock_document):
    inner_task = MockElement("li")
    inner_task.className = "inner-task"
    parent = MockElement("ul")
    parent.appendChild(inner_task)
    
    event = type('Event', (), {'target': inner_task})()
    
    handleDeleteInnerItem(event)
    
    assert len(parent.children) == 0

def test_handleCheckItem(mock_document):
    task = MockElement("li")
    task.className = "task"
    checkbox = MockElement("input")
    checkbox.type = "checkbox"
    task.appendChild(checkbox)
    
    event = type('Event', (), {'target': checkbox})()
    
    handleCheckItem(event)
    
    assert "checked" in task.className

def test_handleInnerCheckItem(mock_document):
    inner_task = MockElement("li")
    inner_task.className = "inner-task"
    checkbox = MockElement("input")
    checkbox.type = "checkbox"
    inner_task.appendChild(checkbox)
    
    event = type('Event', (), {'target': checkbox})()
    
    handleInnerCheckItem(event)
    
    assert "checked" in inner_task.className

# Add more tests as needed for other functions