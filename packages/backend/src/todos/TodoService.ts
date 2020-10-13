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

  deleteTodo (id: string): void {
    delete this.todos[id];
  }

  getTodo (id: string): Todo {
    return this.todos[id];
  }

  getAllTodos (): Todo[] {
    return Object.values(this.todos);
  }

  updateTodo (id: string, update: Partial<Todo>): Todo {
    const todo = this.getTodo(id);
    const updated = {
      ...todo,
      ...update,
    }

    if (update.id) {
      this.deleteTodo(id);
      this.todos[updated.id] = updated;
    } else {
      this.todos[id] = updated;
    }

    return updated;
  }
}

export default TodoService;
