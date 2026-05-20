import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middlewares/validateMiddleware';
import { registrarUsuarioSchema, loginSchema } from '../dtos/authDtos';

const router = Router();
const ctrl = new AuthController();

router.post('/register', validate(registrarUsuarioSchema), (req, res, next) => ctrl.register(req, res, next));
router.post('/login', validate(loginSchema), (req, res, next) => ctrl.login(req, res, next));

export default router;
