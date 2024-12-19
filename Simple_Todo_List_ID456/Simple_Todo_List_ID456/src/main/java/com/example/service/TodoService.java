from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .database import get_db
from .models import Todo as TodoModel
from .schemas import TodoCreate, TodoUpdate, TodoResponse

router = APIRouter()

class TodoService:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def get_all_todos(self) -> List[TodoResponse]:
        """
        Retrieve all Todo items.

        Returns:
            List[TodoResponse]: A list of all Todo items.
        """
        todos = self.db.query(TodoModel).all()
        return [TodoResponse.from_orm(todo) for todo in todos]

    def get_todo_by_id(self, todo_id: int) -> Optional[TodoResponse]:
        """
        Retrieve a Todo item by its ID.

        Args:
            todo_id (int): The ID of the Todo item to retrieve.

        Returns:
            Optional[TodoResponse]: The Todo item if found, None otherwise.
        """
        todo = self.db.query(TodoModel).filter(TodoModel.id == todo_id).first()
        return TodoResponse.from_orm(todo) if todo else None

    def create_todo(self, todo: TodoCreate) -> TodoResponse:
        """
        Create a new Todo item.

        Args:
            todo (TodoCreate): The Todo item to create.

        Returns:
            TodoResponse: The created Todo item.
        """
        db_todo = TodoModel(**todo.dict())
        self.db.add(db_todo)
        self.db.commit()
        self.db.refresh(db_todo)
        return TodoResponse.from_orm(db_todo)

    def update_todo(self, todo_id: int, todo: TodoUpdate) -> Optional[TodoResponse]:
        """
        Update an existing Todo item.

        Args:
            todo_id (int): The ID of the Todo item to update.
            todo (TodoUpdate): The updated Todo item data.

        Returns:
            Optional[TodoResponse]: The updated Todo item if found, None otherwise.
        """
        db_todo = self.db.query(TodoModel).filter(TodoModel.id == todo_id).first()
        if db_todo:
            for key, value in todo.dict(exclude_unset=True).items():
                setattr(db_todo, key, value)
            self.db.commit()
            self.db.refresh(db_todo)
            return TodoResponse.from_orm(db_todo)
        return None

    def delete_todo(self, todo_id: int) -> bool:
        """
        Delete a Todo item by its ID.

        Args:
            todo_id (int): The ID of the Todo item to delete.

        Returns:
            bool: True if the Todo item was deleted, False otherwise.
        """
        db_todo = self.db.query(TodoModel).filter(TodoModel.id == todo_id).first()
        if db_todo:
            self.db.delete(db_todo)
            self.db.commit()
            return True
        return False

# FastAPI route handlers
@router.get("/todos", response_model=List[TodoResponse])
def get_all_todos(service: TodoService = Depends()):
    """
    Get all Todo items.
    """
    return service.get_all_todos()

@router.get("/todos/{todo_id}", response_model=TodoResponse)
def get_todo_by_id(todo_id: int, service: TodoService = Depends()):
    """
    Get a Todo item by ID.
    """
    todo = service.get_todo_by_id(todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@router.post("/todos", response_model=TodoResponse, status_code=201)
def create_todo(todo: TodoCreate, service: TodoService = Depends()):
    """
    Create a new Todo item.
    """
    return service.create_todo(todo)

@router.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo: TodoUpdate, service: TodoService = Depends()):
    """
    Update an existing Todo item.
    """
    updated_todo = service.update_todo(todo_id, todo)
    if not updated_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return updated_todo

@router.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int, service: TodoService = Depends()):
    """
    Delete a Todo item.
    """
    if not service.delete_todo(todo_id):
        raise HTTPException(status_code=404, detail="Todo not found")