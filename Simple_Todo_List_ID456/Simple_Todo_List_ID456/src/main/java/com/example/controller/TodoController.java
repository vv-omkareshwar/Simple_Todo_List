from flask import Flask, request, jsonify
from flask_restx import Api, Resource, fields
from http import HTTPStatus
from typing import List, Optional

app = Flask(__name__)
api = Api(app, version='1.0', title='Todo API', description='A simple Todo API')

ns = api.namespace('api/todos', description='Todo operations')

todo_model = api.model('Todo', {
    'id': fields.Integer(readonly=True, description='The task unique identifier'),
    'title': fields.String(required=True, description='The task details'),
    'completed': fields.Boolean(required=True, description='The task completion status')
})

class TodoService:
    def __init__(self):
        self.todos = []
        self.next_id = 1

    def get_all_todos(self) -> List[dict]:
        return self.todos

    def get_todo_by_id(self, todo_id: int) -> Optional[dict]:
        return next((todo for todo in self.todos if todo['id'] == todo_id), None)

    def create_todo(self, todo: dict) -> dict:
        new_todo = {
            'id': self.next_id,
            'title': todo['title'],
            'completed': todo['completed']
        }
        self.todos.append(new_todo)
        self.next_id += 1
        return new_todo

    def update_todo(self, todo_id: int, updated_todo: dict) -> Optional[dict]:
        todo = self.get_todo_by_id(todo_id)
        if todo:
            todo.update(updated_todo)
            return todo
        return None

    def delete_todo(self, todo_id: int) -> bool:
        initial_length = len(self.todos)
        self.todos = [todo for todo in self.todos if todo['id'] != todo_id]
        return len(self.todos) < initial_length

todo_service = TodoService()

@ns.route('/')
class TodoList(Resource):
    @ns.doc('list_todos')
    @ns.marshal_list_with(todo_model)
    def get(self):
        """List all todos"""
        return todo_service.get_all_todos(), HTTPStatus.OK

    @ns.doc('create_todo')
    @ns.expect(todo_model)
    @ns.marshal_with(todo_model, code=201)
    def post(self):
        """Create a new todo"""
        return todo_service.create_todo(api.payload), HTTPStatus.CREATED

@ns.route('/<int:id>')
@ns.response(404, 'Todo not found')
@ns.param('id', 'The task identifier')
class Todo(Resource):
    @ns.doc('get_todo')
    @ns.marshal_with(todo_model)
    def get(self, id):
        """Fetch a todo given its identifier"""
        todo = todo_service.get_todo_by_id(id)
        return todo if todo else (None, HTTPStatus.NOT_FOUND)

    @ns.doc('update_todo')
    @ns.expect(todo_model)
    @ns.marshal_with(todo_model)
    def put(self, id):
        """Update a todo given its identifier"""
        updated_todo = todo_service.update_todo(id, api.payload)
        return updated_todo if updated_todo else (None, HTTPStatus.NOT_FOUND)

    @ns.doc('delete_todo')
    @ns.response(204, 'Todo deleted')
    def delete(self, id):
        """Delete a todo given its identifier"""
        if todo_service.delete_todo(id):
            return None, HTTPStatus.NO_CONTENT
        return None, HTTPStatus.NOT_FOUND

if __name__ == '__main__':
    app.run(debug=True)