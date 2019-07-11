import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FilesController from './app/controllers/FilesController';
import MeetappController from './app/controllers/MeetappController';
import SubscriberController from './app/controllers/SubscriberController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);

routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FilesController.store);

routes.post('/meetapp', MeetappController.store);
routes.get('/meetapp/users', MeetappController.index);
routes.put('/meetapp/:id', MeetappController.update);
routes.delete('/meetapp/:id', MeetappController.delete);

routes.post('/subscriber/:id/meetapp', SubscriberController.store);

export default routes;
