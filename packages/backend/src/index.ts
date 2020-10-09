import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { Todo } from '@workspaces-demo/common';

const todos: Todo[] = [];

const app = new Koa();

app.use(bodyParser())

const router = new Router();

router.get('/todos', (ctx, next) => {
  ctx.body = todos;
  next();
})

router.post('/todos', (ctx, next) => {
  const { body } = ctx.request;
  if (body) {
    todos.push(body);
    ctx.response.status = 201;
  } else {
    ctx.response.status = 400;
  }
  next();
})

app.use(router.routes());

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

console.log("test")