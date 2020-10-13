
import Router, { RouterContext } from 'koa-router';
import TodoService from './TodoService';
import { Context, Next } from 'koa';
import bodyParser from 'koa-bodyparser';
import Ajv from 'ajv';
import patchSchema from './schemas/patch-todo-schema.json';
import { Todo } from '@workspaces-demo/common';

const createGetHandler = (todoService: TodoService) =>
  (ctx: Context, _next: Next) => {
    ctx.status = 200;
    ctx.body = todoService.getAllTodos();
  }


const createDetailGetHandler = (todoService: TodoService) =>
  (ctx: RouterContext, _next: Next) => {
    ctx.status = 200;
    const todo = todoService.getTodo(ctx.params.id);

    if (!todo) {
      ctx.status = 404;
      return;
    }

    ctx.status = 200;
    ctx.body = todo;
  }

const createPostHandler = (todoService: TodoService) =>
  (ctx: Context, _next: Next) => {
    const { body } = ctx.request;

    if (!body.title) {
      ctx.status = 400;
      ctx.body = "Field `title` is required"
      return;
    }

    if (!body.content) {
      ctx.status = 400;
      ctx.body = "Field `content` is required"
      return;
    }
    
    const todo = todoService.createTodo(body.title, body.content);
    ctx.status = 201;
    ctx.body = todo;
  }

const ajv = new Ajv();
const validatePatch = ajv.compile(patchSchema);
const createDetailPatchHandler = (todoService: TodoService) =>
  (ctx: Context) => {
    const { id } = ctx.params;
    if (!todoService.getTodo(id)) {
      ctx.status = 404;
      return;
    }

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

const createTodoRouter = (todoService: TodoService): Router => {
  const router = new Router();
  router.use(bodyParser());

  router.get('/todos', createGetHandler(todoService));
  router.post('/todos', createPostHandler(todoService));

  router.get('/todos/:id', createDetailGetHandler(todoService));
  router.patch('/todos/:id', createDetailPatchHandler(todoService));
  // router.delete('/todos/:id', createDetailDeleteHandler(todoService));

  return router;
}

export default createTodoRouter;
