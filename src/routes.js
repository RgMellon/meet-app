import { Router } from 'express';

import TesteController from './app/controllers/TesteController';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();

routes.post('/users', UserController.store);

routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.get('/oi', TesteController.index);

export default routes;
