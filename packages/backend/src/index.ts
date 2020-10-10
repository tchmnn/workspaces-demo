import Koa from 'koa';
import createTodoRouter from './todos/createTodoRouter';
import TodoService from './todos/TodoService';

const todoService = new TodoService();
const todoRouter = createTodoRouter(todoService);

const app = new Koa();
app.use(todoRouter.routes());
app.use(todoRouter.allowedMethods());

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
