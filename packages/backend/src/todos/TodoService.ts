import { v4 as uuid } from 'uuid';
import { Todo } from '@workspaces-demo/common';

type TodoStore = {
  [key: string]: Todo;
}

class TodoService {
  private todos: TodoStore = {};

  createTodo (title: string, content: string, done: boolean = false): Todo {
    const created: Todo =  {
        id: uuid(),
        createdAt: new Date(),
        title,
        content,
        done,
    };
    this.todos[created.id] = created;
    return created;
  }

  deleteTodo (id: string) {
    delete this.todos[id];
  }

  getTodo (id: string) {
    return this.todos[id];
  }
}

export default TodoService;
