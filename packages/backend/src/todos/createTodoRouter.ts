
import Router from 'koa-router';
// import bodyParser from 'koa-bodyparser';
import TodoService from './TodoService';
import { Context, Next } from 'koa';

const createGetHandler = (todoService: TodoService) =>
  (ctx: Context, next: Next) => {
    ctx.status = 200;
  }

const createPostHandler = (todoService: TodoService) =>
  (ctx: Context, next: Next) => {
    ctx.status = 200;
  }

const createTodoRouter = (todoService: TodoService): Router => {
  const router = new Router();
  router.get('/todos', createGetHandler(todoService));
  router.post('/todos', createPostHandler(todoService));
  return router;
}

export default createTodoRouter;
