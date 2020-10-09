import { v4 as uuid } from 'uuid';

export type Todo = {
  id: string;
  createdAt: Date;
  title: string;
  content: string;
  done: boolean;
};

export function createTodo (title: string, content: string, done: boolean = false): Todo {
  return {
    id: uuid(),
    createdAt: new Date(),
    title,
    content,
    done,
  }
};
