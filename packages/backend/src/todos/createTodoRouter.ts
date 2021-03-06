
import { Context, Next } from 'koa';
import Router, { RouterContext } from 'koa-router';
import bodyParser from 'koa-bodyparser';
import Ajv from 'ajv';
import { Todo } from '@workspaces-demo/common';
import patchSchema from './schemas/patch-todo-schema.json';
import postSchema from './schemas/post-todo-schema.json';
import TodoService from './TodoService';

const ajv = new Ajv();

const createGetHandler = (todoService: TodoService) =>
  (ctx: Context, _next: Next) => {
    ctx.status = 200;
    ctx.body = todoService.getAllTodos();
  }

const validatePost = ajv.compile(postSchema);
const createPostHandler = (todoService: TodoService) =>
  (ctx: Context, _next: Next) => {
    const { body } = ctx.request;
    const valid = validatePost(body);
    
    if (!valid && validatePost.errors) {
      ctx.status = 400;
      ctx.body = { errors: validatePost.errors.map(e => e.message) };
      return;
    }

    const todo = todoService.createTodo(body.title, body.content);
    ctx.status = 201;
    ctx.body = todo;
  }

// TODO: proper types
type Getter<T, U = string> = (id: U) => T;

const makeExistsOr404 = <T>(key: string, getter: Getter<T>) =>
  async (ctx: RouterContext, next: Next) => {
    const obj = getter(ctx.params.id)

    if (!obj) {
      ctx.status = 404;
      return;
    }

    ctx.state[key] = obj;
    await next();
  }

const validatePatch = ajv.compile(patchSchema);
const createDetailPatchHandler = (todoService: TodoService) =>
  (ctx: Context) => {
    const { id } = ctx.params;
    const { body } = ctx.request;
    const valid = validatePatch(body);
    
    if (!valid) {
      ctx.status = 400;
      return;
    }

    // TODO: remove cast
    const update = body as Partial<Todo>;
    const updated = todoService.updateTodo(id, update);
    ctx.status = 200;
    ctx.body = updated;
  }

const createDetailGetHandler = (_todoService: TodoService) =>
  (ctx: RouterContext, _next: Next) => {
    ctx.status = 200;
    ctx.body = ctx.state.todo;
  }

const createDetailDeleteHandler = (todoService: TodoService) =>
  (ctx: RouterContext) => {
    const { id } = ctx.params;
    todoService.deleteTodo(id);
    ctx.status = 200;
  }

const createTodoRouter = (todoService: TodoService): Router => {
  const router = new Router();
  const todoExistsOr404 = makeExistsOr404<Todo>("todo", id => todoService.getTodo(id));
  router.use(bodyParser());

  router.get('/todos', createGetHandler(todoService));
  router.post('/todos', createPostHandler(todoService));

  router.get('/todos/:id', todoExistsOr404, createDetailGetHandler(todoService));
  router.patch('/todos/:id', todoExistsOr404, createDetailPatchHandler(todoService));
  router.delete('/todos/:id', todoExistsOr404, createDetailDeleteHandler(todoService));

  return router;
}

export default createTodoRouter;
